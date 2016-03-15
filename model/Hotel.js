module.exports = Hotel

var PlaceDetails = require("./PlaceDetails");


function Hotel(mood, city, state, hotel){
	this.mood = mood; 
	this.city = city;
	this.state = state;

	this.popularity = null;

	this.name = hotel.name;
	this.price = hotel.price;
	this.ratings = hotel.rating;
}


Hotel.prototype.getMoodScore = function(mood, synonyms, relatedWords, antonyms, denom) {
	console.log("get the score for the mood of the hotel");
	this.placeID = "ChIJTfDFs1SXTYcRHlWMQvuZegA";			//marriot hotel

	var placeDetails = new PlaceDetails();
	var score = placeDetails.getReviewsText(this.placeID, synonyms, relatedWords, antonyms, denom);
	console.log("hotel mood score: ",score);
	return 0;
};

Hotel.prototype.getPriceScore = function(price) {
	console.log("get the score for the price of the hotel");
	return 0;
};