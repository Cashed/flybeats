const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const expressJwt = require('express-jwt');
const session = require('express-session');
const app = express();

require('dotenv').load();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, './node_modules')));
app.use(session({
  secret: process.env.SECRET,
  cookie: { secure: 'auto', maxAge: 3600000 },
  saveUnitialized: true,
  resave: false }
));

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: process.env.SECRET }));

// routes
app.use('/login', require('./routes/login'));
app.use('/register', require('./routes/register'));
app.use('/app', require('./routes/app_access'));
app.use('/api/users', require('./routes/api/users'));
// app.use('/api/comments', require('routes/api/comments'));
// app.use('/api/pictures', require('routes/api/pictures'));
// app.use('/api/posts', require('routes/api/posts'));

// make '/app' default route
app.get('/', (req, res, next) => {
  return res.redirect('/app');
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

module.exports = app;
