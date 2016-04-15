module.exports = Restaurant

var assert = require('assert'),
	config = require("../config.js"),
	PlaceDetailsRequest = require("../node_modules/googleplaces/lib/PlaceDetailsRequest.js");

function Restaurant(trip, mood, city, state, restaurant){
	this.mood = mood;
	this.city = city;
	this.state = state;

	this.placeID = restaurant.place_id;

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
        if(curr.rating == undefined)
            curr.rating = Math.round( ((Math.random() * 2) + 3) * 10 ) / 10;
        var priceLevel = response.result.price_level;
        if(priceLevel == undefined)               //generate random price between 1 and 3
            priceLevel = Math.floor((Math.random() * 3) + 1);

        if(priceLevel == 0)
            curr.price = 0;
        else if(priceLevel == 1)
            curr.price = 8;
        else if(priceLevel == 2)
            curr.price = 14;
        else if(priceLevel == 3)
            curr.price = 30;
        else if(priceLevel == 4)
            curr.price = 60;
	        
        trip.loadedRestaurants++;
    	trip.complete();
    });

}
