const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  // log the user out
  // delete req.session.token;

  // create success message on local variable and delete so it only appears once
  const success = 'req.session.success';
  // delete req.session.success;

  res.render('login', { sucess: success });
});

module.exports = router;
