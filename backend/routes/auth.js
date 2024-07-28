const express = require('express');
const passport = require('passport');
const router = express.Router();

require('../config/passport');

router.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    if (req.user) {
      const token = jwt.sign({ id: req.user.id }, process.env.SECRET_KEY, { expiresIn: '5h' });
      res.redirect(`http://localhost:3000/login?token=${token}`);
    } else {
      res.redirect('http://localhost:3000/login?error=authentication_failed');
    }
  }
);

module.exports = router;
