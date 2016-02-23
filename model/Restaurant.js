// var wrap = require('co-monk');

module.exports = Restaurant

function Restaurant(mood, city, state, restaurants){
	this.restaurants = restaurants
	this.mood = mood;
	this.city = city;
	this.state = state;

	
    var rand = Math.floor(Math.random() * this.restaurants.length);
	var randomRestaurant = this.restaurants[rand];
	this.name = randomRestaurant.name;
	this.genre = randomRestaurant.genre;
	this.ratings = randomRestaurant.rating;

}


Restaurant.prototype.someMethodHere = function() {
	// body...
};