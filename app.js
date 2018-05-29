var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var multer = require('multer');
var flash = require('connect-flash');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var db = mongoose.connection;
var logger = require('morgan');
var nodemailer = require('nodemailer');
var expressValidator = require('express-validator');

var routes = require('./routes/index');
var about = require('./routes/about');
var contact = require('./routes/contact');
var users = require('./routes/users');
var test = require('./routes/test');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Handle Express Sessions
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());


//Validator
app.use(expressValidator());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Flash Messages
app.use(flash());

//express Messages
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


//globals

app.use(function(req,res,next){
  res.locals.error_msg = req.flash('error_msg');
  res.locals.success_msg = req.flash('success_msg');
  next();
});


// Handle fileUploads
var uploads = multer({dest:'./uploads'});

app.get('*',function(req,res,next){
  res.locals.user = req.user || null;
  next();
});


app.use('/', routes);
app.use('/about', about);
app.use('/contact', contact);
app.use('/users', users);
app.use('/test',test);

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


app.listen(3000, function () {
   console.log('Example app listening on port 3000!')
});

module.exports = app;
