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
  //location, restMood, attrMood, hotelMood, price, restRating, attrRating, hotelRating,  overallRating
  "adventurous": [ 0.3, 0.5, 1, 0.3, 0.1, 0.5, 1, 0.3, 1],
  "relaxing":[1,1,.7,.8,.4,.7,.6,1,.8],
  "romantic":[1,.8,.3,1,0.4,1,.3,1,.9],
  "happy":[.6,.7,.8,.8,.5,.7,.7,.5,.6]
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
