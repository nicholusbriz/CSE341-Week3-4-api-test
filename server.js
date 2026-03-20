require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const connectDB = require('./src/database/db');
const { errorHandler } = require('./src/middleware/errorHandler');

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

// Dynamic host configuration for Swagger
app.use('/api-docs', (req, res, next) => {
  const host = req.get('host');
  const protocol = req.get('x-forwarded-proto') || req.protocol;

  // Create a copy of swagger document with dynamic host
  const swaggerDoc = { ...swaggerDocument };
  swaggerDoc.host = host;
  swaggerDoc.schemes = [protocol];

  swaggerUi.serve();
  return swaggerUi.setup(swaggerDoc, swaggerOptions)(req, res, next);
});

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

// Global Error Handler Middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger documentation available at: http://localhost:${PORT}/api-docs`);
  console.log(`Health check available at: http://localhost:${PORT}/health`);
});

module.exports = app;
