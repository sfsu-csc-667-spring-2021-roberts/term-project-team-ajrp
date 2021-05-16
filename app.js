var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');

const isLoggedIn = require('./routes/unauthenticated/sessionCheck');

require("dotenv").config();
/*if(process.env.NODE_ENV === 'development') {
  require("dotenv").config();
}*/

var passport = require('./config/passport');

var indexRouter = require('./routes/unauthenticated/index');
var usersRouter = require('./routes/users');
var testsRouter = require('./routes/tests');

var authRouter = require('./routes/unauthenticated/auth');

var dashboardRouter = require('./routes/authenticated/dashboard');
var gameRouter = require('./routes/authenticated/game');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(flash());

app.use(
  session({
    //possibly move into .env
    secret: 'justsomesecretkey',
    resave: false,
    saveUninitialized: false
    
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.locals.basedir = path.join(__dirname, 'public');

// home router, will go dashboard if session is detected
app.use('/', indexRouter, authRouter);

// unauthenticated router
app.use('/users', usersRouter);
app.use('/tests', testsRouter);

// authenticated routes
app.use('/dashboard', isLoggedIn, dashboardRouter);
app.use('/game', gameRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
