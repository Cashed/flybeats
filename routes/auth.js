'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../services/users.service');

// routes
router.post('/authenticate', authenticateUser);
router.post('/register', registerUser);

module.exports = router;

function authenticateUser(req, res, next) {
  User.authenticate(req.body, (error, user) => {
    if (error) {
      res.status(400).send(error);
    }
    else if (user) {

      let claim = {
        id: user.id,
        username: user.username,
        avatar: user.avatar
      }

      let token = {
        token: jwt.sign(claim, process.env.SECRET)
      }

      res.send({ token: token });
    }
    else {
      // unauthorized
      res.sendStatus(401);
    }
  });
}

function registerUser(req, res, next) {
  User.createUser(req.body, (error, user) => {
    if (error) {
      res.status(400).send(error);
    }
    else {
      console.log('success');
      res.send(user);
    }
  });
}
