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
	this.trip = Array.apply(null, Array(5)).map(Number.prototype.valueOf, 0);

}

Trip.prototype.complete = function(){
	this.generateTrip();
}


Trip.prototype.createRandomTrip = function() {
	
	//this.generateLocation();

	this.generateRestaurants();
	this.generateHotel();
	this.generateAttractions();
	console.log(this.trip.toString());	

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
	var randomHotelIndex = Math.random() * (endHotelIndex - startHotelIndex) + startHotelIndex;
	this.trip[randomHotelIndex] = 1;
}

Trip.prototype.generateAttractions = function(){
	var startAttractionIndex = this.numHotels + this.numRestaurants;
	var endAttractionIndex = this.trip.length;
	for(var i=0; i<(this.numDays*2); i++){
		var randomAttractionIndex = Math.random() * (endAttractionIndex - startAttractionIndex) + startAttractionIndex;
		this.trip[randomAttractionIndex] = 1;
	}
}

// getters --> need to check if this is what you want! --> return array of indexes, or whole chunk?

Trip.prototype.getRestaurants = function(){
	var restaurants = this.trip.slice(0,this.numRestaurants);
	return restaurants;
}

Trip.prototype.getHotels = function(){
	var endAttractions = this.numRestaurants + this.numHotels + this.numAttractions;
		
}

Trip.prototype.getAttractions = function(){
	var attractions = this.trip.slice(this.numRestaurants, this.numAttractions);
}

// setters

Trip.prototype.setRestaurants = function(){
	var restaurants = this.trip.slice(0,this.numRestaurants);
	return restaurants;
}

Trip.prototype.setHotels = function(hotels){
	var endAttractions = this.numRestaurants + this.numHotels + this.numAttractions;
		
}

Trip.prototype.setAttractions = function(){
	var attractions = this.trip.slice(this.numRestaurants, this.numAttractions);
}