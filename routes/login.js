const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../services/users.service');

// routes
router.get('/', loginView);
router.post('/', authenticateUser);

module.exports = router;

function loginView(req, res, next) {
  //log user out
  delete req.session.token;

  //move success message into local variable so it only appears once (single read)
  const viewData = req.session.success ;
  delete req.session.success;

  res.render('login', { success: viewData });
}

function authenticateUser(req, res, next) {
  User.authenticate(req.body, (error, user) => {
    if (error) {
      return res.render('login', { error: error.details });
    }
    else if (user) {

      const claim = {
        id: user.id
      }

      const token = {
        token: jwt.sign(claim, process.env.SECRET)
      }

      // save JWT token in the session to make it available to the angular app
      req.session.token = token;

      // redirect to returnUrl
      const returnUrl = req.query.returnUrl && decodeURIComponent(req.query.returnUrl) || '/';
      res.redirect(returnUrl);
    }
    else {
      // unauthorized
      res.sendStatus(401);
    }
  });
}
