require("dotenv").config({ quiet: true });
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const connectDB = require("./src/database/db");
const passport = require("passport");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const GitHubStrategy = require("passport-github").Strategy;
const cors = require("cors");

const userRoutes = require("./src/routes/userRoutes");
const productRoutes = require("./src/routes/productRoutes");
const authRoutes = require("./src/routes/authRoutes");

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Session setup for authentication
app.use(session({
  secret: process.env.SESSION_SECRET || "mysecretkey",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { secure: false, sameSite: "lax", maxAge: 24 * 60 * 60 * 1000 },
}));

// CORS setup
app.use(cors({ origin: ["https://cse341-ncxu.onrender.com", "http://localhost:3000"], credentials: true }));
app.use(express.json());

// Passport authentication setup
app.use(passport.initialize());
app.use(passport.session());

// GitHub OAuth strategy
passport.use(new GitHubStrategy(
  {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
  },
  (accessToken, refreshToken, profile, done) => {
    console.log("GitHub authentication successful for:", profile.username);
    done(null, profile);
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

// Home page route
app.get("/", (req, res) => {
  console.log("Home page accessed, checking authentication");
  const isAuth = req.isAuthenticated?.() || false;
  console.log("User authenticated:", isAuth);

  const messages = {
    already_logged_in: "You are already logged in.",
    logged_in: "You are now logged in.",
    login_failed: "Login failed. Please try again."
  };
  const message = messages[req.query.message] || "";

  res.send(`
    <h1>CSE341 API</h1>
    ${message ? `<p>${message}</p>` : ""}
    ${isAuth ? `<p>Logged in as ${req.user.displayName}</p><a href="/api/auth/logout">Logout</a>` : `<a href="/api/auth/github">Login</a>`}
    <p><a href="/api-docs">API Docs</a></p>
  `);
});

// 404 handler
app.use((req, res) => {
  console.log("404 - Route not found:", req.originalUrl);
  res.status(404).json({
    success: false,
    error: "Route not found"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
});

module.exports = app;