module.exports = Restaurant

var assert = require('assert'),
	config = require("../config.js"),
	PlaceDetailsRequest = require("../node_modules/googleplaces/lib/PlaceDetailsRequest.js");

function Restaurant(trip, mood, city, state, restaurant){
	this.mood = mood;
	this.city = city;
	this.state = state;

	this.placeID = restaurant.place_id;
	// this.genre = restaurant.genre;


	var placeDetailsRequest = new PlaceDetailsRequest(config.apiKey, config.outputFormat);

	var curr = this;
	
	placeDetailsRequest({placeid: restaurant.place_id}, function (error, response) {
        if (error) throw error;
        assert.equal(response.status, "OK", "Place details request response status is OK");
        var reviews = response.result.reviews;
        var reviewText = "";
      	for(var r in reviews)
    	  	reviewText += reviews[r].text;
    	curr.reviewText = reviewText;
    	curr.name = response.result.name;
        curr.rating = response.result.rating;		        
        trip.loadedRestaurants++;
    	trip.complete();
    });

}
