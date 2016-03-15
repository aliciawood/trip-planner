module.exports = Attraction

function Attraction(mood, city, state, attraction){
	this.mood = mood;
	this.city = city;
	this.state = state;

	this.category = "";
	this.popularity = null;

	this.name = attraction.name;
	this.price = attraction.price;
	this.ratings = attraction.rating;

}


Attraction.prototype.someMethodHere = function() {
	// body...
};