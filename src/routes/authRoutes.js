const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/github', (req, res, next) => {
  console.log('GitHub OAuth route accessed');
  passport.authenticate('github', { prompt: 'consent' })(req, res, next);
});

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    console.log('GitHub OAuth callback successful');
    console.log('User authenticated:', req.isAuthenticated());
    console.log('User data:', req.user);
    console.log('Session after callback:', req.session);
    res.redirect('/');
  }
);

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
    // Clear the session cookie
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      // Clear the cookie and redirect to home page
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
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
