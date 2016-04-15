var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/tripPlanner');


var routes = require('./routes/index');

var app = express();

globalWeights = {
  "adventurous": {
      "location": 0.3,
      "restMood": 0.5,
      "attrMood": 1,
      "hotelMood": 0.3,
      "price": 0.1,
      "restRating": 0.5,
      "attrRating": 1,
      "hotelRating": 0.3,
      "overallRating": 1
  },
  "relaxing":{
      "location": 1,
      "restMood": 1,
      "attrMood": 1,
      "hotelMood": 1,
      "price": 1,
      "restRating": 1,
      "attrRating": 1,
      "hotelRating": 1,
      "overallRating": 1
  },
  "romantic":{
      "location": 1,
      "restMood": 1,
      "attrMood": 1,
      "hotelMood": 1,
      "price": 0.5,
      "restRating": 1,
      "attrRating": 1,
      "hotelRating": 1,
      "overallRating": 1
  },
  "happy":{
      "location": 1,
      "restMood": 1,
      "attrMood": 1,
      "hotelMood": 1,
      "price": 0.5,
      "restRating": 1,
      "attrRating": 1,
      "hotelRating": 1,
      "overallRating": 1
  }
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));      //where to find views
app.set('view engine', 'jade');                       //what engine to use to render views

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));      //take stuff from the public directory and make it seem like its coming from the top level


// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
