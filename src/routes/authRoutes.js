const express = require('express');
const passport = require('passport');
const router = express.Router();

// Test route to verify authRoutes is loaded
router.get('/test', (req, res) => {
  res.json({ message: 'authRoutes is working!' });
});

router.get('/github', (req, res, next) => {
  passport.authenticate('github', { prompt: 'consent' })(req, res, next);
});

router.get('/github/callback', (req, res, next) => {
  passport.authenticate('github', { failureRedirect: '/' })(req, res, next);
});

router.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }

  res.json({
    success: true,
    message: 'User authenticated successfully',
    user: {
      id: req.user.id,
      username: req.user.username,
      displayName: req.user.displayName,
      profileUrl: req.user.profileUrl
    }
  });
});

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

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
