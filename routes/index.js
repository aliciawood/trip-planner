var express = require('express');
var router = express.Router();
var InspiringSet = require('../model/InspiringSet');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('inputfortrip', { title: 'Enter Input for Trip' });
});


router.post('/addinput', function(req, res) {


    var inspiringSet = new InspiringSet(req.db, req.body.budget, req.body.mood, res);

});
router.post('/autorate',function(req,res){

    console.log("********POSTED AUTORATE: ");
    var subscores = req.body.subscores;
    console.log("subscores: ",subscores);
    var overallScore = req.body.overallScore;
    console.log("overallScore: ",overallScore);
    var mood = req.body.mood;
    console.log("mood: ",mood);
    var weights = req.body.weights;
    console.log("weights: ",weights);

    //update weights
    //     inspiringSet.updateWeights();


    res.render('finishedrating', { title: 'Finished Rating!'})
});

router.get('/displayGoogleMaps', function(req, res) {
    //var city = req.session.city;
    //var state = req.session.state;
    res.render('googleMaps', { title: 'Google Maps data' });
});

module.exports = router;
