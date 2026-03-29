const authMiddleware = (req, res, next) => {
  // Check if user is authenticated via session
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please login to access this resource.',
      message: 'You must be authenticated to perform this action'
    });
  }
  
  // User is authenticated, proceed to next middleware/route
  next();
};

module.exports = authMiddleware;
