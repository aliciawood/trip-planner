module.exports = Hotel

var assert = require('assert'),
	config = require("../config.js"),
	PlaceDetailsRequest = require("../node_modules/googleplaces/lib/PlaceDetailsRequest.js");


function Hotel(trip, mood, city, state, hotel){
	this.mood = mood; 
	this.city = city;
	this.state = state;

	this.popularity = null;

	this.name = hotel.name;
	this.price = hotel.price;
	this.placeID = hotel.place_id;
	this.rating = hotel.rating;


	var placeDetailsRequest = new PlaceDetailsRequest(config.apiKey, config.outputFormat);

	var curr = this;
	
	placeDetailsRequest({placeid: hotel.place_id}, function (error, response) {
        if (error) throw error;
        assert.equal(response.status, "OK", "Place details request response status is OK");
        var reviews = response.result.reviews;
        var reviewText = "";
      	for(var r in reviews)
    	  	reviewText += reviews[r].text;
    	curr.reviewText = reviewText;
    	curr.name = response.result.name;
        curr.rating = response.result.rating;
        if(curr.rating == undefined)
            curr.rating = Math.round( ((Math.random() * 2) + 3) * 10 ) / 10;
        curr.price = 137;

    	trip.loadedHotels++;
    	trip.complete();
		        
    });

}
