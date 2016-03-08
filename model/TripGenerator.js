module.exports = TripGenerator

var Restaurant = require("./Restaurant"),
	Attraction = require("./Attraction"),
	Hotel = require("./Hotel"),
	assert = require('assert');

function TripGenerator(place, restaurants, hotels, attractions){
	
	this.place = place;
	this.restaurants = restaurants;
	this.hotels = hotels;
	this.attractions = attractions;
	this.picture = null;
	this.numDays = 4;


}

TripGenerator.prototype.complete = function(){
	this.initialize();
}


TripGenerator.prototype.initialize = function() {

	//making population
	var population = [];
	for(var i = 0; i < 10; i++) {
		var trip = [];
		

	}

	this.generateLocation();

	this.generateRestaurants();
	this.generateAttractions(moneyForAttractions);
	this.generateHotels(moneyForHotels);

	this.res.render('tripoutput', {
        "restaurantlist" : this.restaurants,
        "hotellist": this.hotels,
        "attractionlist": this.attractions,
        "city":this.city,
        "state":this.state,
        "money":this.budget,
        "mood":this.mood
    });
	

};

TripGenerator.prototype.generateLocation = function(){
	this.city = "Provo";
	this.state = "UT";
	//wikipedia info
	//other sites
}


TripGenerator.prototype.generateRestaurants = function(){
	for(var i=0; i<(this.numDays*2); i++){
		var newRestaurant = new Restaurant(this.mood, this.city, this.state, this.restaurantsQueried);
		this.restaurants.push(newRestaurant);
	}
}

TripGenerator.prototype.generateAttractions = function(money){
	var moneyPerAttraction = money/(this.numDays*2);
	for(var i=0; i<(this.numDays*2); i++){
		var newAttraction = new Attraction(this.mood, moneyPerAttraction, this.city, this.state, this.attractionsQueried);
		this.attractions.push(newAttraction);
	}
}

TripGenerator.prototype.generateHotels = function(money){
	var moneyPerHotel = money/(this.numDays);
	for(var i=0; i<this.numDays; i++){
		var newHotel = new Hotel(this.mood, moneyPerHotel, this.city, this.state, this.hotelsQueried);
		this.hotels.push(newHotel);
	}
	
}