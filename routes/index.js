var express = require('express');
var router = express.Router();
var InspiringSet = require('../model/InspiringSet');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('inputfortrip', { title: 'Enter Input for Trip' });
});


router.post('/addinput', function(req, res) {

    
    var inspiringSet = new InspiringSet(req.db, req.body.budget, req.body.mood)
    // var generatedTrip = inspiringSet.getGeneratedTrip();


    // this.res.render('tripoutput', {
    //     "restaurantlist" : generatedTrip.restaurants,
    //     "hotellist": generatedTrip.hotels,
    //     "attractionlist": generatedTrip.attractions,
    //     "city":generatedTrip.city,
    //     "state":generatedTrip.state,
    //     "money":generatedTrip.budget,
    //     "mood":generatedTrip.mood
    // });

});

router.get('/displayGoogleMaps', function(req, res) {
    //var city = req.session.city;
    //var state = req.session.state;
    res.render('googleMaps', { title: 'Google Maps data' });
});

module.exports = router;
