const authMiddleware = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      error: "Authentication required to access this route. Please login first.",
      message: "You need to be logged in to perform this action."
    });
  }
  next();
};

module.exports = authMiddleware;
