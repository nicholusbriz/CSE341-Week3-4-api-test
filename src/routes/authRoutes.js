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
  console.log('GitHub callback accessed');
  console.log('Before auth - session:', req.session);
  console.log('Before auth - user:', req.user);
  console.log('Query params:', req.query);

  passport.authenticate('github', {
    failureRedirect: '/',
    successRedirect: '/',
    failureFlash: true
  })(req, res, (err) => {
    if (err) {
      console.error('Auth error:', err);
      return next(err);
    }

    console.log('After auth - session:', req.session);
    console.log('After auth - user:', req.user);
    console.log('Is authenticated:', req.isAuthenticated());

    // User is now authenticated, redirect to home
    res.redirect('/');
  });
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
