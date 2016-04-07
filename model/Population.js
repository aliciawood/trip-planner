module.exports = Population

var GeneticAlgorithm = require("./genetic/GeneticAlgorithm"),
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
	//making population
	// console.log("\tpop size: ",this.populationSize);
	for(var i = 0; i < this.populationSize; i++) {
		var trip = new GeneticAlgorithm(this.numRestaurants, this.numHotels, this.numAttractions);
		// console.log("\tnew GeneticAlgorithm");
		trip.createRandomTrip();
		// console.log("createRandomTrip");
		this.population.push(trip);
		// console.log("add");
	}

};

Population.prototype.getTrip = function(index) {
	return this.population[index];
}

Population.prototype.getBestTrip = function(currTrip) {
	var fittest = this.population[0];
	for(var i = 1; i < this.populationSize; i++) {
		if(fittest.getFitness(currTrip) < this.getTrip(i).getFitness(currTrip))
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