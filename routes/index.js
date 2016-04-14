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
// router.post('',function(req,res){
//     inspiringSet.updateWeights();
// });

router.get('/displayGoogleMaps', function(req, res) {
    //var city = req.session.city;
    //var state = req.session.state;
    res.render('googleMaps', { title: 'Google Maps data' });
});

module.exports = router;
