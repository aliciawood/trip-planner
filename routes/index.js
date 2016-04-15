var express = require('express');
var router = express.Router();
var InspiringSet = require('../model/InspiringSet');
var Perceptron = require('../model/perceptron/Perceptron');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('inputfortrip', { title: 'Enter Input for Trip' });
});


router.post('/addinput', function(req, res) {


    var inspiringSet = new InspiringSet(req.db, req.body.budget, req.body.mood, res);

    // res.render('tripoutput', {
    //     "mood":req.body.mood,
    // });

});
router.post('/autorate',function(req,res){

    console.log("********POSTED AUTORATE: ");
    var subscores = req.body.subscores;
    var overallScore = req.body.overallScore;
    var mood = req.body.mood;
    var weights = req.body.weights;


    var userRatings = undefined;
    if(req.body.radioGroup1 !=undefined)
        userRatings = [req.body.radioGroup1, req.body.radioGroup2, req.body.radioGroup3, req.body.radioGroup4, req.body.radioGroup5, req.body.radioGroup6];
    
    var perceptron = new Perceptron(subscores,overallScore, weights, mood, userRatings);
    perceptron.run();

    res.render('finishedrating', { title: 'Finished Rating!'})
});

router.get('/displayGoogleMaps', function(req, res) {
    //var city = req.session.city;
    //var state = req.session.state;
    res.render('googleMaps', { title: 'Google Maps data' });
});

module.exports = router;
