'use strict';

const jwt = require('jsonwebtoken');
require('dotenv').load();

function getToken(req) {
  const token = req.get('Authorization');

  if (token) {
    const tokenSplit = token.split(' ');
    if (tokenSplit.length === 2) {
      return tokenSplit[1];
    }
    else return false;
  }
}

function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRET, (error, decoded) => {
      if (error) {
        console.log(error);
      }
      resolve(decoded);
    });
  });
}

function checkToken(req, res, next) {
  const token = getToken(req);

  if (token) {
    verifyToken(token).then( user => {
      req.user = user;
      next();
    });
  }
  else {
    next();
  }
}

function loggedIn(req, res, next) {
  if(req.user && !isNaN(Number(req.user.id))) next();
  else {
    res.status(401);
    res.json({message: 'UnAuthorized'});
  }
}

module.exports = {
  checkToken,
  loggedIn
};
