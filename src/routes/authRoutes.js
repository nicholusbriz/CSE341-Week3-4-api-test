const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/github', (req, res, next) => {
  console.log('GitHub OAuth route accessed');
  passport.authenticate('github', { prompt: 'consent' })(req, res, next);
});

router.get('/github/callback', (req, res, next) => {
  console.log('=== GitHub OAuth callback route accessed ===');
  console.log('Request URL:', req.originalUrl);
  console.log('Query params:', req.query);
  console.log('Session before auth:', req.session);

  passport.authenticate('github', { failureRedirect: '/' }, (err, user, info) => {
    console.log('Passport authenticate result:');
    console.log('Error:', err);
    console.log('User:', user);
    console.log('Info:', info);

    if (err) {
      console.log('Authentication error:', err);
      return next(err);
    }

    if (!user) {
      console.log('No user returned, redirecting to failure');
      return res.redirect('/');
    }

    req.logIn(user, (err) => {
      if (err) {
        console.log('Login error:', err);
        return next(err);
      }

      console.log('User logged in successfully');
      console.log('User authenticated:', req.isAuthenticated());
      console.log('User data:', req.user);
      console.log('Session after login:', req.session);

      return res.redirect('/');
    });
  })(req, res, next);
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
