const express = require('express');
const router = express.Router();

// use session auth to secure the angular app files
router.use('/', (req, res, next) => {
  if (req.path !== '/login' && !req.session.token) {
    console.log('no token');
    return res.redirect('/login?returnUrl=' + encodeURIComponent('/app' + req.path));
  }

  next();
});

// make JWT token available to angular app
router.get('/token', (req, res, next) => {
  console.log('sending token');
  res.send(req.session.token);
});

// serve angular app files from the '/app' route
router.use('/', express.static('app'));

module.exports = router;
