module.exports = Restaurant

var PlaceDetails = require("./PlaceDetails"),
	assert = require('assert'),
	config = require("../config.js"),
	PlaceDetailsRequest = require("../node_modules/googleplaces/lib/PlaceDetailsRequest.js");

function Restaurant(mood, city, state, restaurant){
	// this.restaurants = restaurants
	this.mood = mood;
	this.city = city;
	this.state = state;

	this.name = restaurant.name;
	this.placeID = restaurant.place_id;
	// this.genre = restaurant.genre;
	this.rating = restaurant.rating;


	var placeDetailsRequest = new PlaceDetailsRequest(config.apiKey, config.outputFormat);

	var curr = this;
	// console.log("RRRRestaurant.place_id: ",restaurant.place_id);
	var reviewText = "";
	placeDetailsRequest({placeid: restaurant.place_id}, function (error, response) {
        if (error) throw error;
        assert.equal(response.status, "OK", "Place details request response status is OK");
        var reviews = response.result.reviews;
      	for(var r in reviews){
    	  	var currReview = reviews[r];
    	  	reviewText += currReview.text;
    	}
    	curr.reviewText = reviewText;
		        
    });

}


Restaurant.prototype.getMoodScore = function(mood, synonyms, relatedWords, antonyms, denom) {
	console.log("get the score for the mood of the restaurant");
	// this.placeID = "ChIJTfDFs1SXTYcRHlWMQvuZegA";			//marriot hotel

	var placeDetails = new PlaceDetails();
	var score = placeDetails.calculateScore(this.reviewText);
	// var score = placeDetails.getReviewsText(this.placeID, synonyms, relatedWords, antonyms, denom);
	console.log("restaurant mood score: ",score);
	return 0;
};

Restaurant.prototype.getPriceScore = function(price) {
	console.log("get the score for the price of the restaurant");
	return 0;
};