const express = require('express');
const router = express.Router();
const User = require('../services/users.service');

// routes
router.get('/', registerView);
router.post('/', registerUser);

module.exports = router;

function registerView(req, res, next) {
  res.render('register');
}

function registerUser(req, res, next) {
  User.createUser(req.body, (error, user) => {
    if (error) {
      return res.render('register', { error: error.detail });
    }

    // return to login page with success message
    req.session.success = 'Registration successful!';
    return res.redirect('/login');
  });
}


module.exports = router;
