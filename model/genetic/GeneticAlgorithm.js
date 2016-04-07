module.exports = GeneticAlgorithm

var Restaurant = require("../Restaurant"),
	Attraction = require("../Attraction"),
	Hotel = require("../Hotel"),
	Trip = require("../Trip"),
	Evaluation = require("./Evaluation"),
	assert = require('assert');

function GeneticAlgorithm(numberofRestaurants, numberofHotels, numberofAttractions){
	this.numRestaurants = numberofRestaurants;
	this.startRestaurantIndex = 0;

	this.numHotels = numberofHotels;
	this.startHotelIndex = this.numRestaurants;


	this.numAttractions = numberofAttractions;
	this.startAttractionIndex = this.startHotelIndex + this.numHotels;

	this.numDays = 4;

	this.geneLength = numberofRestaurants + numberofHotels + numberofAttractions;
	this.trip = Array.apply(null, Array(this.geneLength)).map(Number.prototype.valueOf, 0);
	
}


GeneticAlgorithm.prototype.createRandomTrip = function() {
	this.generateRestaurants();
	this.generateHotel();
	this.generateAttractions();

};

GeneticAlgorithm.prototype.printTrip = function() {
	console.log(this.trip.toString());		
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


GeneticAlgorithm.prototype.markRandomBit = function(max, min) {
	var randomIndex;
	do {
		randomIndex = Math.floor(Math.random() * (max - min)) + min;	
	} while(this.trip[randomIndex] === 1);
	this.trip[randomIndex] = 1;
}

GeneticAlgorithm.prototype.generateRestaurants = function(){
	for(var i=0; i<(this.numDays*2); i++)
		this.markRandomBit(this.startHotelIndex, this.startRestaurantIndex);
}

GeneticAlgorithm.prototype.generateHotel = function(){
	this.markRandomBit(this.startAttractionIndex, this.startHotelIndex);
}

GeneticAlgorithm.prototype.generateAttractions = function(){
	for(var i=0; i<(this.numDays*2); i++){
		this.markRandomBit(this.trip.length, this.startAttractionIndex);
	}
}

GeneticAlgorithm.prototype.flipBit = function(max, min) {
	var randomIndex = Math.floor(Math.random() * (max - min)) + min;
	var bit = this.trip[randomIndex];

	if(bit === 0) {
		this.trip[randomIndex] = 1;
		var flipIndex;
		while(true) {
			flipIndex = Math.floor(Math.random() * (max - min)) + min;
			if(flipIndex === randomIndex)
				continue;
			else if(this.trip[flipIndex] === 0)
				continue;
			else
				break;
		}
		this.trip[flipIndex] = 0;
	}

}

//mutation
GeneticAlgorithm.prototype.mutate = function() {
	for(var i = 0; i < 4; i++) {
		var randomNumber = Math.floor(Math.random());
		if((randomNumber % 2) == 0)
			this.flipBit(this.startHotelIndex, this.startRestaurantIndex);
	}
	for(var i = 0; i < 2; i++) {
		var randomNumber = Math.floor(Math.random());
		if((randomNumber % 2) == 0)
			this.flipBit(this.startAttractionIndex, this.startHotelIndex);
	}
	for(var i = 0; i < 4; i++) {
		var randomNumber = Math.floor(Math.random());
		if((randomNumber % 2) == 0)
			this.flipBit(this.trip.length, this.startAttractionIndex);
	}
}

//fitness
GeneticAlgorithm.prototype.getFitness = function(currentTrip) {
	currentTrip.restaurants = [];
	currentTrip.hotels = [];
	currentTrip.attractions = [];
	currentTrip.printTrip(this);

	var newScore = currentTrip.eval.calculateScore();
	console.log("SCORE: ",newScore);

	return newScore;
}

// getters --> need to check if this is what you want! --> return array of indexes, or whole chunk?

GeneticAlgorithm.prototype.getRestaurantBits = function(){
	var restaurants = this.trip.slice(0,this.startHotelIndex);
	return restaurants;
}

GeneticAlgorithm.prototype.getHotelBits = function(){
	var hotels = this.trip.slice(this.startHotelIndex,this.startAttractionIndex);
	return hotels;	
}

GeneticAlgorithm.prototype.getAttractionBits = function(){
	var attractions = this.trip.slice(this.startAttractionIndex, this.trip.length);
	return attractions;
}

// setters

GeneticAlgorithm.prototype.setRestaurantBits = function(restaurants){
	Array.prototype.splice.apply(this.trip, [0, restaurants.length].concat(restaurants));
}

GeneticAlgorithm.prototype.setHotelBits = function(hotels){
	Array.prototype.splice.apply(this.trip, [this.startHotelIndex, hotels.length].concat(hotels));
}

GeneticAlgorithm.prototype.setAttractionBits = function(attractions){
	Array.prototype.splice.apply(this.trip, [this.startAttractionIndex, attractions.length].concat(attractions));
}