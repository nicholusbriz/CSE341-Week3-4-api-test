// Authentication middleware - protects routes requiring login
const authMiddleware = (req, res, next) => {
  // Verify user is authenticated via session
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please login to access this resource.',
      message: 'You must be authenticated to perform this action'
    });
  }

  // User authenticated - proceed to next middleware/route
  next();
};

module.exports = authMiddleware;
