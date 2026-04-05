require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const connectDB = require("./src/database/db");
const passport = require("passport");
const session = require("express-session");
const GitHubStrategy = require("passport-github").Strategy;
const cors = require("cors");

const userRoutes = require("./src/routes/userRoutes");
const productRoutes = require("./src/routes/productRoutes");
const authRoutes = require("./src/routes/authRoutes");

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, sameSite: "lax", maxAge: 24 * 60 * 60 * 1000 },
  }),
);

app.use(
  cors({
    origin: ["https://cse341-ncxu.onrender.com", "http://localhost:3000"],
    credentials: true,
  }),
);
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

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

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use("/api/auth", authRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

app.get("/login", (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.redirect("/?message=already_logged_in");
  }
  res.redirect("/api/auth/github");
});

app.get("/", (req, res) => {
  const auth = req.isAuthenticated && req.isAuthenticated();
  let message = "";

  if (req.query.message === "already_logged_in") {
    message = "You are already logged in.";
  }
  if (req.query.message === "logged_in") {
    message = "You are now logged in.";
  }
  if (req.query.message === "login_failed") {
    message = "Login failed. Please try again.";
  }

  res.send(`
    <h1>CSE341 API</h1>
    ${message ? `<p>${message}</p>` : ""}
    ${auth ? `<p>Logged in as ${req.user.displayName}</p><a href="/api/auth/logout">Logout</a>` : `<a href="/login">Login</a>`}
    <p><a href="/api-docs">API Docs</a></p>
  `);
});

app.use((req, res) =>
  res.status(404).json({ success: false, error: "Route not found" }),
);

app.listen(PORT, () => console.log(`Server on port ${PORT}`));

module.exports = app;
