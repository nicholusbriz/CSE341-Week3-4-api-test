const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/github", passport.authenticate("github"));

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/?message=login_failed",
    successRedirect: "/?message=logged_in",
  }),
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
