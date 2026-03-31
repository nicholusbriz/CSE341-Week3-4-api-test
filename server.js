require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const connectDB = require("./src/database/db");
const passport = require("passport");
const session = require("express-session");
const GitHubStrategy = require("passport-github").Strategy;
const cors = require("cors");

// Import routes
const userRoutes = require("./src/routes/userRoutes");
const productRoutes = require("./src/routes/productRoutes");
const authRoutes = require("./src/routes/authRoutes");

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Temporarily disabled for testing
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

// Middleware
app.use(cors({
  origin: ['https://cse341-ncxu.onrender.com', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

// Login route
app.get("/login", (req, res) => {
  res.redirect("/api/auth/github");
});

// Root route
app.get("/", (req, res) => {
  const isAuthenticated = req.isAuthenticated();

  let statusHtml = "";
  if (isAuthenticated && req.user) {
    statusHtml = `
      <h2>You are logged in!</h2>
      <p>User: ${req.user.displayName || req.user.username}</p>
      <p>ID: ${req.user.id}</p>
      <a href="/api/auth/logout" style="display: inline-block; padding: 10px 20px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px;">Logout</a>
    `;
  } else {
    statusHtml = `
      <h2>You are not logged in</h2>
      <p><a href="/login" style="display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">Login with GitHub</a></p>
    `;
  }

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>CSE341 API</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .container { max-width: 600px; margin: 0 auto; }
            .links { margin-top: 20px; }
            .links a { display: block; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>CSE341 Week 3-4 Project API</h1>
            ${statusHtml}
            <div class="links">
                <p><a href="/api-docs">API Documentation</a></p>
                <p><a href="/api/auth/status">Check Authentication Status</a></p>
            </div>
        </div>
    </body>
    </html>
  `);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
