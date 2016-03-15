// var wrap = require('co-monk');

module.exports = Restaurant

function Restaurant(mood, city, state, restaurant){
	this.mood = mood;
	this.city = city;
	this.state = state;

	this.name = restaurant.name;
	this.genre = restaurant.genre;
	this.ratings = restaurant.rating;

}


Restaurant.prototype.someMethodHere = function() {
	// body...
};