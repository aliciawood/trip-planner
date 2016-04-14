module.exports = Attraction

var assert = require('assert'),
	config = require("../config.js"),
	PlaceDetailsRequest = require("../node_modules/googleplaces/lib/PlaceDetailsRequest.js");

function Attraction(trip, mood, city, state, attraction){
	this.mood = mood;
	this.city = city;
	this.state = state;

	this.category = "";
	this.popularity = null;

	this.name = attraction.name;
	this.price = attraction.price;
	this.placeID = attraction.place_id;
	this.rating = attraction.rating;


	var placeDetailsRequest = new PlaceDetailsRequest(config.apiKey, config.outputFormat);

	var curr = this;
	
	placeDetailsRequest({placeid: attraction.place_id}, function (error, response) {
        if (error) throw error;
        assert.equal(response.status, "OK", "Place details request response status is OK");
        var reviews = response.result.reviews;
        var reviewText = "";
      	for(var r in reviews)
    	  	reviewText += reviews[r].text;
    	curr.reviewText = reviewText;
    	curr.name = response.result.name;
        curr.rating = response.result.rating;	
        curr.types = response.result.types;
    	trip.loadedAttractions++;
    	trip.complete();
    });

}
