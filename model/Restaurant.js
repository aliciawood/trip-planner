module.exports = Restaurant

var PlaceDetails = require("./PlaceDetails");

function Restaurant(mood, city, state, restaurant){
	// this.restaurants = restaurants
	this.mood = mood;
	this.city = city;
	this.state = state;

	this.name = restaurant.name;
	this.placeID = restaurant.place_id;
	// this.genre = restaurant.genre;
	this.rating = restaurant.rating;

}


Restaurant.prototype.getMoodScore = function(mood, synonyms, relatedWords, antonyms, denom) {
	console.log("get the score for the mood of the restaurant");
	// this.placeID = "ChIJTfDFs1SXTYcRHlWMQvuZegA";			//marriot hotel

	var placeDetails = new PlaceDetails();
	var score = placeDetails.getReviewsText(this.placeID, synonyms, relatedWords, antonyms, denom);
	console.log("restaurant mood score: ",score);
	return 0;
};

Restaurant.prototype.getPriceScore = function(price) {
	console.log("get the score for the price of the restaurant");
	return 0;
};