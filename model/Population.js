module.exports = Population

var Trip = require("./Trip"),
	Restaurant = require("./Restaurant"),
	Attraction = require("./Attraction"),
	Hotel = require("./Hotel"),
	assert = require('assert');

function Population(populationSize, numberofRestaurants, numberofHotels, numberofAttractions){
	this.populationSize = populationSize;
	this.numRestaurants = numberofRestaurants;
	this.numHotels = numberofHotels;
	this.numAttractions = numberofAttractions;

	this.population = [];
}

Population.prototype.init = function() {
	console.log("initialize");
	//making population
	for(var i = 0; i < this.populationSize; i++) {
		var trip = new Trip(this.numRestaurants, this.numHotels, this.numAttractions);
		trip.createRandomTrip();
		this.population.push(trip);
	}

};

Population.prototype.getTrip = function(index) {
	return this.population[index];
}

Population.prototype.getBestTrip = function() {
	var fittest = this.population[0];
	for(var i = 1; i < this.populationSize; i++) {
		if(fittest.getFitness() < this.getTrip(i).getFitness())
			fittest = this.getTrip(i);
	}
	return fittest;
}

Population.prototype.size = function() {
	return this.population.length;
}

Population.prototype.addTrip = function(trip) {
	this.population.push(trip);
}