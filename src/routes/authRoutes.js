const express = require('express');
const passport = require('passport');
const router = express.Router();

// GitHub OAuth login route
router.get('/github', (req, res, next) => {
  passport.authenticate('github', { prompt: 'consent' })(req, res, next);
});

// GitHub OAuth callback handler
router.get('/github/callback', passport.authenticate('github', {
  failureRedirect: '/',
  successRedirect: '/'
}));

// Get authenticated user profile
router.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required to access profile'
    });
  }

  res.json({
    success: true,
    message: 'User profile retrieved successfully',
    user: {
      id: req.user.id,
      username: req.user.username,
      displayName: req.user.displayName,
      profileUrl: req.user.profileUrl
    }
  });
});

// Logout user and clear session
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

// Check authentication status
router.get('/status', (req, res) => {
  res.json({
    success: true,
    authenticated: req.isAuthenticated(),
    user: req.isAuthenticated() ? {
      id: req.user.id,
      username: req.user.username,
      displayName: req.user.displayName
    } : null
  });
});

module.exports = router;
