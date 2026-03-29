require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const connectDB = require('./src/database/db');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github').Strategy;
const MongoStore = require('connect-mongo')(session);

// Import routes
const userRoutes = require('./src/routes/userRoutes');
const productRoutes = require('./src/routes/productRoutes');
const authRoutes = require('./src/routes/authRoutes');

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Session configuration
app.use(session({
  store: process.env.NODE_ENV === 'production'
    ? new MongoStore({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions'
    })
    : undefined, // MemoryStore for development
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }
}));

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
},
  (accessToken, refreshToken, profile, done) => {
    // User is authenticated with GitHub
    return done(null, profile);
  }
));

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Max-Age', '86400');
    res.sendStatus(200);
  } else {
    next();
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

app.get('/login', (req, res) => {
  res.redirect('/api/auth/github');
});

// Swagger documentation
const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'W03 Project API Documentation',
  explorer: true
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

// Root route
app.get('/', async (req, res) => {
  try {
    const isAuthenticated = req.isAuthenticated();
    let statusHtml = '';

    if (isAuthenticated && req.user) {
      statusHtml = `
        <h2>You are logged in!</h2>
        <p>User: ${req.user.displayName || req.user.username}</p>
        <p>ID: ${req.user.id}</p>
        <a href="/api/auth/logout" style="display: inline-block; padding: 10px 20px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px;">Logout</a>
      `;
    } else {
      statusHtml = `
        <h2>You are logged out</h2>
        <p><a href="/login">login here</a></p>
      `;
    }

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>CSE341 API</title>
      </head>
      <body>
          ${statusHtml}
      </body>
      </html>
    `);
  } catch (error) {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>CSE341 API</title>
      </head>
      <body>
          <h1>CSE341 API</h1>
          <p>Hello, my name is Atbriz and this is my week3 and week4 web service project.</p>
          <p>API is running...</p>
      </body>
      </html>
    `);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger documentation available at: http://localhost:${PORT}/api-docs`);
  console.log(`Health check available at: http://localhost:${PORT}/health`);
});

module.exports = app;
