var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (!req.user || isNaN(req.user.id)) {
    return res.redirect('/login?returnUrl=' + encodeURIComponent('/' + req.path));
  }
  next();
});

router.use('/', express.static('app'));

module.exports = router;
