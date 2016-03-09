module.exports = Trip

var Restaurant = require("./Restaurant"),
	Attraction = require("./Attraction"),
	Hotel = require("./Hotel"),
	assert = require('assert');

function Trip(numberofRestaurants, numberofHotels, numberofAttractions){

	this.numRestaurants = numberofRestaurants;
	this.numHotels = numberofHotels;
	this.numAttractions = numberofAttractions;
	this.numDays = 4;

	this.geneLength = numberofRestaurants + numberofHotels + numberofAttractions;
	this.trip = [];
	this.trip.apply(null, Array(5)).map(Number.prototype.valueOf, 0);

}

Trip.prototype.complete = function(){
	this.generateTrip();
}


Trip.prototype.generateTrip = function() {
	
	//this.generateLocation();

	this.generateRestaurants();
	this.generateHotel();
	this.generateAttractions(moneyForAttractions);	

};

Trip.prototype.generateLocation = function(){
	this.city = "Provo";
	this.state = "UT";
	//wikipedia info
	//other sites
}

//generators

Trip.prototype.generateRestaurants = function(){
	var startRestaurantIndex = 0;
	var endRestaurantIndex = this.numRestaurants;
	for(var i=0; i<(this.numDays*2); i++){
		var randomRestaurantIndex = Math.random() * (endRestaurantIndex - startRestaurantIndex) + startRestaurantIndex;
		this.trip[randomRestaurantIndex] = 1;
	}
}

Trip.prototype.generateHotel = function(){
	var startHotelIndex = this.numRestaurants;
	var endHotelIndex = this.numHotels;
	var randomRestaurantIndex = Math.random() * (endRestaurantIndex - startRestaurantIndex) + startRestaurantIndex;
	this.trip[randomRestaurantIndex] = 1;
}

Trip.prototype.generateAttractions = function(money){
	var moneyPerAttraction = money/(this.numDays*2);
	for(var i=0; i<(this.numDays*2); i++){
		var newAttraction = new Attraction(this.mood, moneyPerAttraction, this.city, this.state, this.attractionsQueried);
		this.attractions.push(newAttraction);
	}
}

// getters

Trip.prototype.getRestaurants = function(){
	var restaurants = this.trip.slice(0,this.numberofRestaurants);
	return restaurants;
}

Trip.prototype.getHotels = function(){
	var endAttractions = this.numberofRestaurants + this.numberofHotels + this.numberofAttractions;
		
}

Trip.prototype.getAttractions = function(){
	var attractions = this.trip.slice(this.numberofRestaurants, )
}

// setters

Trip.prototype.setRestaurants = function(){
	var restaurants = this.trip.slice(0,this.numberofRestaurants);
	return restaurants;
}

Trip.prototype.setHotels = function(hotels){
	var endAttractions = this.numberofRestaurants + this.numberofHotels + this.numberofAttractions;
		
}

Trip.prototype.setAttractions = function(){
	var attractions = this.trip.slice(this.numberofRestaurants, )
}