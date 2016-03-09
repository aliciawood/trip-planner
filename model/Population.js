module.exports = Population

var Trip = require("./Trip"),
	Restaurant = require("./Restaurant"),
	Attraction = require("./Attraction"),
	Hotel = require("./Hotel"),
	assert = require('assert');

function Population(populationSize){
	
	

}

Population.prototype.complete = function(){
	this.initialize();
}


Population.prototype.initialize = function() {

	//making population
	this.population = [];
	for(var i = 0; i < populationSize; i++) {
		var trip = new Trip();
		trip.createRandomTrip();
		this.population.push(trip);
	}

};

Population.prototype.getTrip(index) {
	return this.population[index];
}

Population.prototype.size() {
	return this.population.length;
}