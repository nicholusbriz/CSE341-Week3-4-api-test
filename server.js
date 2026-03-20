require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const connectDB = require('./src/database/db');

// Import routes
const userRoutes = require('./src/routes/userRoutes');
const productRoutes = require('./src/routes/productRoutes');

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

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
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Swagger documentation
const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'W03 Project API Documentation',
  explorer: true
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'W03 Project API',
    version: '1.0.0',
    description: 'Node.js API with MongoDB and Swagger for CSE 341 W03 Project',
    documentation: '/api-docs',
    endpoints: {
      users: '/api/users',
      products: '/api/products'
    }
  });
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

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({
      success: false,
      error: `Validation error: ${errors.join(', ')}`
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate field value entered'
    });
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format'
    });
  }

  // Default server error
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger documentation available at: http://localhost:${PORT}/api-docs`);
  console.log(`Health check available at: http://localhost:${PORT}/health`);
});

module.exports = app;
