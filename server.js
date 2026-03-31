require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const connectDB = require('./src/database/db');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github').Strategy;
const MongoStore = require('connect-mongo');
const cors = require('cors');

// Import routes
const userRoutes = require('./src/routes/userRoutes');
const productRoutes = require('./src/routes/productRoutes');
const authRoutes = require('./src/routes/authRoutes');

console.log('authRoutes loaded:', typeof authRoutes);
console.log('authRoutes routes:', authRoutes.stack?.map(layer => layer.route?.path).filter(Boolean));

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Session configuration
app.use(session({
  store: process.env.NODE_ENV === 'production'
    ? MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions'
    })
    : undefined,
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Middleware
app.use(cors({
  origin: 'https://cse341-ncxu.onrender.com',
  credentials: true
}));
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
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Swagger documentation
const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'W03 Project API Documentation',
  explorer: true
};

// Replace environment variables in swagger.json
const swaggerDocumentWithEnv = JSON.parse(JSON.stringify(swaggerDocument)
  .replace(/\$\{SWAGGER_HOST\}/g, process.env.SWAGGER_HOST || 'localhost:3000')
  .replace(/\$\{SWAGGER_SCHEME\}/g, process.env.SWAGGER_SCHEME || 'http'));

// Routes
console.log('Registering auth routes...');
app.use('/api/auth', authRoutes);
console.log('Auth routes registered');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocumentWithEnv, swaggerOptions));
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Login route
app.get('/login', (req, res) => {
  console.log('Login route accessed');
  res.redirect('/api/auth/github');
});

// Root route
app.get('/', (req, res) => {
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
        <p><a href="/api-docs">API Documentation</a></p>
        <p><a href="/health">Health Check</a></p>
    </body>
    </html>
  `);
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

  // Debug: Show all registered routes
  console.log('Registered routes:');
  const router = app._router || app.router;
  if (router && router.stack) {
    router.stack.forEach((middleware) => {
      if (middleware.route) {
        console.log(`Route: ${middleware.route.path} [${Object.keys(middleware.route.methods).join(', ')}]`);
      } else if (middleware.name === 'router' && middleware.handle && middleware.handle.stack) {
        middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
            console.log(`Route: ${handler.route.path} [${Object.keys(handler.route.methods).join(', ')}]`);
          }
        });
      }
    });
  } else {
    console.log('Router stack not available');
  }
});

module.exports = app;
