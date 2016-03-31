module.exports = GeneticAlgorithm

var Restaurant = require("../Restaurant"),
	Attraction = require("../Attraction"),
	Hotel = require("../Hotel"),
	Trip = require("../Trip"),
	Evaluation = require("./Evaluation"),
	assert = require('assert');

function GeneticAlgorithm(numberofRestaurants, numberofHotels, numberofAttractions){
	//console.log("in GeneticAlgorithm");
	//console.log("rest: ", numberofRestaurants, " hotel: ", numberofHotels, " attr: ",  numberofAttractions);
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
	//console.log("Creating random trip");
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
	//console.log("min: ", min, "max:", max);
	var randomIndex;
	do {

		randomIndex = Math.floor(Math.random() * (max - min)) + min;	
		//console.log("randomindex: ",randomIndex);
	} while(this.trip[randomIndex] === 1);
	this.trip[randomIndex] = 1;
}

GeneticAlgorithm.prototype.generateRestaurants = function(){
	//console.log("Generating restaurants");
	for(var i=0; i<(this.numDays*2); i++){
		this.markRandomBit(this.startHotelIndex, this.startRestaurantIndex);
	}
}

GeneticAlgorithm.prototype.generateHotel = function(){
	//console.log("generating hotels");
	this.markRandomBit(this.startAttractionIndex, this.startHotelIndex);
}

GeneticAlgorithm.prototype.generateAttractions = function(){
	//console.log("generating attractions");
	for(var i=0; i<(this.numDays*2); i++){
		this.markRandomBit(this.trip.length, this.startAttractionIndex);
	}
}

GeneticAlgorithm.prototype.flipBit = function(max, min) {
	//console.log("in flip bit");
	var randomIndex = Math.floor(Math.random() * (max - min)) + min;
	var bit = this.trip[randomIndex];
	//console.log("randome index: ", randomIndex, " value: ", bit);

	if(bit === 0) {
		this.trip[randomIndex] = 1;
		var flipIndex;
		while(true) {
			flipIndex = Math.floor(Math.random() * (max - min)) + min;
			//console.log("INVERT BIT CHECK");
			//console.log("change index: ", flipIndex, "value: ", this.trip[flipIndex]);
			if(flipIndex === randomIndex)
				continue;
			else if(this.trip[flipIndex] === 0)
				continue;
			else
				break;
		}
		//console.log("INVERTING");
		//console.log("change index: ", flipIndex, "value: ", this.trip[flipIndex]);
		this.trip[flipIndex] = 0;
	}

}

//mutation
GeneticAlgorithm.prototype.mutate = function() {
	//console.log("MUTATION");
	for(var i = 0; i < 4; i++) {
		//console.log("before:");
		//console.log("restaurants:", this.getRestaurantBits().toString());
		var randomNumber = Math.floor(Math.random());
		if((randomNumber % 2) == 0)
			this.flipBit(this.startHotelIndex, this.startRestaurantIndex);
		//console.log("after:");
		//console.log("restaurants:", this.getRestaurantBits().toString());
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

	return newScore;
}

// getters --> need to check if this is what you want! --> return array of indexes, or whole chunk?

GeneticAlgorithm.prototype.getRestaurantBits = function(){
	var restaurants = this.trip.slice(0,this.startHotelIndex);
	//console.log("get restaurants: ", restaurants.length);
	return restaurants;
}

GeneticAlgorithm.prototype.getHotelBits = function(){
	var hotels = this.trip.slice(this.startHotelIndex,this.startAttractionIndex);
	//console.log("get hotels: ", hotels.length);
	return hotels;	
}

GeneticAlgorithm.prototype.getAttractionBits = function(){
	var attractions = this.trip.slice(this.startAttractionIndex, this.trip.length);
	//console.log("get attractions: ", attractions.length);
	return attractions;
}

// setters

GeneticAlgorithm.prototype.setRestaurantBits = function(restaurants){
	//console.log("before set restaurants");
	//this.printTrip();
	Array.prototype.splice.apply(this.trip, [0, restaurants.length].concat(restaurants));
	//console.log("after set restaurants");
	//this.printTrip();
}

GeneticAlgorithm.prototype.setHotelBits = function(hotels){
	//console.log("before set hotels");
	//this.printTrip();
	Array.prototype.splice.apply(this.trip, [this.startHotelIndex, hotels.length].concat(hotels));
	//console.log("after set hotel");
	//this.printTrip();
}

GeneticAlgorithm.prototype.setAttractionBits = function(attractions){
	//console.log("before set attractions");
	//this.printTrip();
	//console.log(attractions.length);
	Array.prototype.splice.apply(this.trip, [this.startAttractionIndex, attractions.length].concat(attractions));
	//console.log("after set attractions");
	//this.printTrip();
}