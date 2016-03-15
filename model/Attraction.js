module.exports = Attraction

function Attraction(mood, city, state, attraction){
	this.mood = mood;
	this.city = city;
	this.state = state;

	this.category = "";
	this.popularity = null;

	this.name = attraction.name;
	this.price = attraction.price;
	this.placeID = attraction.place_id;
	this.ratings = attraction.rating;

}

Attraction.prototype.getMoodScore = function(mood) {
	console.log("get the score for the mood of the attraction");
	return 0;
};

Attraction.prototype.getPriceScore = function(price) {
	console.log("get the score for the price of the attraction");
	return 0;
};