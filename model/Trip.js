module.exports = Trip

var Restaurant = require("./Restaurant"),
	Attraction = require("./Attraction"),
	Hotel = require("./Hotel"),
	assert = require('assert');

function Trip(numberofRestaurants, numberofHotels, numberofAttractions){
	console.log("in Trip");
	console.log("rest: ", numberofRestaurants, " hotel: ", numberofHotels, " attr: ",  numberofAttractions);
	this.numRestaurants = numberofRestaurants;
	this.numHotels = numberofHotels;
	this.numAttractions = numberofAttractions;
	this.numDays = 4;

	this.geneLength = numberofRestaurants + numberofHotels + numberofAttractions;
	this.trip = Array.apply(null, Array(this.geneLength)).map(Number.prototype.valueOf, 0);
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
	console.log("generating restaurants");
	var startRestaurantIndex = 0;
	var endRestaurantIndex = this.numRestaurants;
	console.log("start index: ", startRestaurantIndex);
	console.log("end index: ", endRestaurantIndex);
	for(var i=0; i<(this.numDays*2); i++){
		var randomRestaurantIndex = Math.floor(Math.random() * (endRestaurantIndex - startRestaurantIndex) + startRestaurantIndex);
		console.log("random index: ", randomRestaurantIndex);
		this.trip[randomRestaurantIndex] = 1;
	}
}

Trip.prototype.generateHotel = function(){
	console.log("generating hotels");
	var startHotelIndex = this.numRestaurants;
	var endHotelIndex = this.numHotels;
	console.log("start index: ", startHotelIndex);
	console.log("end index: ", endHotelIndex);
	var randomHotelIndex = Math.floor(Math.random() * (endHotelIndex - startHotelIndex) + startHotelIndex);
	console.log("random index: ", randomHotelIndex);
	this.trip[randomHotelIndex] = 1;
}

Trip.prototype.generateAttractions = function(){
	console.log("generating attractions");
	var startAttractionIndex = this.numHotels + this.numRestaurants;
	var endAttractionIndex = this.trip.length;
	console.log("start index: ", startAttractionIndex);
	console.log("end index: ", endAttractionIndex);
	for(var i=0; i<(this.numDays*2); i++){
		var randomAttractionIndex = Math.floor(Math.random() * (endAttractionIndex - startAttractionIndex) + startAttractionIndex);
		console.log("random index: ", randomAttractionIndex);
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