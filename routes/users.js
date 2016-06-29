const express = require('express');
const router = express.Router();
const User = require('../services/users.service');

// routes
router.post('/authenticate', authenticateUser);
router.post('/register', registerUser);
router.get('/current', getCurrentUser);
router.get('/:id', getUserById);
router.get('/name/:username', getUserByName);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;

function authenticateUser(req, res, next) {
  User.authenticate(req.body.username, req.body.password, (error, token) => {
    if (error) {
      res.status(400).send(error);
    }
    else if (token) {
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
      res.status(400).send(error.error);
    }
    else {
      res.sendStatus(200);
    }
  });
}

function getCurrentUser(req, res, next) {
  User.getById(req.user.sub, (error, user) => {
    if (error) {
      res.status(400).send(error);
    }
    else if (user) {
      res.send(user);
    }
    else {
      res.sendStatus(404);
    }
  });
}

function getUserById(req, res, next) {
  User.getById(req.params.id, (error, user) => {
    if (error) {
      res.status(400).send(error);
    }
    else if (user) {
      res.send(user);
    }
    else {
      res.sendStatus(404);
    }
  });
}

function getUserByName(req, res, next) {
  User.getByUsername(req.params.username, (error, user) => {
    if (error) {
      res.status(400).send(error);
    }
    else if (user) {
      res.send(user);
    }
    else {
      res.sendStatus(404);
    }
  });
}

function updateUser(req, res, next) {
  const userId = req.user.sub;

  if (req.params.id !== userId) {
    return res.status(401).send('You can only update your own account!');
  }

  User.updateUser(userId, req.body, (error, user) => {
    if (error) {
      res.status(400).send(error);
    }
    else {
      res.sendStatus(200);
    }
  });
}

function deleteUser(req, res, next) {
  const userId = req.user.sub;

  if (req.params.id !== userId) {
    return res.status(401).send('You can only delete your own account!');
  }

  User.updateUser(userId, req.body, (error, user) => {
    if (error) {
      res.status(400).send(error);
    }
    else {
      res.sendStatus(200);
    }
  });
}
