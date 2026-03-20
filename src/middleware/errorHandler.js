// Validation Error Handler
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(error => error.message);
  return {
    success: false,
    error: `Validation error: ${errors.join(', ')}`
  };
};

// Duplicate Key Error Handler
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return {
    success: false,
    error: `${field} already exists`
  };
};

// Cast Error Handler (Invalid ID)
const handleCastError = (err) => {
  return {
    success: false,
    error: 'Invalid ID format'
  };
};

// Global Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    return res.status(400).json(handleValidationError(err));
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    return res.status(400).json(handleDuplicateKeyError(err));
  }

  // Mongoose Cast Error
  if (err.name === 'CastError') {
    return res.status(400).json(handleCastError(err));
  }

  // Default Server Error
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
};

// Async Error Wrapper (to avoid try/catch in controllers)
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  asyncHandler
};
