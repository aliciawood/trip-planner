var express = require('express');
var router = express.Router();
var TripGenerator = require('../model/TripGenerator');

var Evaluation = require('../model/genetic/Evaluation');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('inputfortrip', { title: 'Enter Input for Trip' });
});


router.post('/addinput', function(req, res) {

    var budget = req.body.budget;
    var mood = req.body.mood;

    var trip = new TripGenerator(req.db, budget, mood, res);
    var score = new Evaluation(trip, budget, mood, req.db);
});


router.get('/inputfortrip', function(req, res) {
    
    res.render('inputfortrip', { title: 'Enter Input for Trip' });
});

router.get('/displaytrip', function(req, res) {
    // res.render('displaytrip', { title: 'Your Trip' });
    var db = req.db;
    var collection = db.get('restaurants');
    collection.find({},{},function(e,docs){
        res.render('restaurantlist', {
            "restaurantlist" : docs
        });
    });
});

router.get('/displayGoogleMaps', function(req, res) {
    //var city = req.session.city;
    //var state = req.session.state;
    res.render('googleMaps', { title: 'Google Maps data' });
});

module.exports = router;
