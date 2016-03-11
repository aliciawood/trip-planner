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
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


Trip.prototype.markRandomBit = function(max, min) {
	var randomIndex;
	do {
		randomIndex = Math.floor(Math.random() * (max - min)) + min;
		console.log("randomIndex: ", randomIndex);	
	} while(this.trip[randomIndex] === 1);
	this.trip[randomIndex] = 1;
	console.log("marked");
}

Trip.prototype.generateRestaurants = function(){
	console.log("generating restaurants");
	var startRestaurantIndex = 0;
	var endRestaurantIndex = this.numRestaurants;
	console.log("start index: ", startRestaurantIndex);
	console.log("end index: ", endRestaurantIndex);
	for(var i=0; i<(this.numDays*2); i++){
		this.markRandomBit(endRestaurantIndex, startRestaurantIndex);
	}
}

Trip.prototype.generateHotel = function(){
	console.log("generating hotels");
	var startHotelIndex = this.numRestaurants;
	var endHotelIndex = this.numHotels + this.numRestaurants;
	console.log("start index: ", startHotelIndex);
	console.log("end index: ", endHotelIndex);
	this.markRandomBit(endHotelIndex, startHotelIndex);
}

Trip.prototype.generateAttractions = function(){
	console.log("generating attractions");
	var startAttractionIndex = this.numHotels + this.numRestaurants;
	var endAttractionIndex = this.trip.length;
	console.log("start index: ", startAttractionIndex);
	console.log("end index: ", endAttractionIndex);
	for(var i=0; i<(this.numDays*2); i++){
		this.markRandomBit(endAttractionIndex, startAttractionIndex);
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