module.exports = Population

var Trip = require("./Trip"),
	Restaurant = require("./Restaurant"),
	Attraction = require("./Attraction"),
	Hotel = require("./Hotel"),
	assert = require('assert');

function Population(populationSize){
	this.populationSize = populationSize;
	this.init();
}

Population.prototype.complete = function(){
	console.log("population complete");
}


Population.prototype.init = function() {
	console.log("initialize");
	//making population
	this.population = [];
	for(var i = 0; i < this.populationSize; i++) {
		var trip = new Trip();
		trip.createRandomTrip();
		this.population.push(trip);
	}

};

Population.prototype.getTrip = function(index) {
	return this.population[index];
}

Population.prototype.size = function() {
	return this.population.length;
}