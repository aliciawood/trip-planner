module.exports = Population

var GeneticAlgorithm = require("./GeneticAlgorithm"),
	Restaurant = require("./Restaurant"),
	Attraction = require("./Attraction"),
	Hotel = require("./Hotel"),
	assert = require('assert');

function Population(populationSize, numberofRestaurants, numberofHotels, numberofAttractions, tripPool){
	this.populationSize = populationSize;
	this.numRestaurants = numberofRestaurants;
	this.numHotels = numberofHotels;
	this.numAttractions = numberofAttractions;
	this.population = [];
	this.tripPool = tripPool;
}

Population.prototype.init = function() {
	//making population
	for(var i = 0; i < this.populationSize; i++) {
		var trip = new GeneticAlgorithm(this.numRestaurants, this.numHotels, this.numAttractions, this.tripPool);
		trip.createRandomTrip();
		this.population.push(trip);
	}

};

Population.prototype.getTrip = function(index) {
	return this.population[index];
}

Population.prototype.getBestTrip = function() {
	var fittest = this.population[0];
	var fittestIndex = 0;
	for(var i = 1; i < this.population.length; i++) {
		if(fittest.getFitness() < this.getTrip(i).getFitness()) {
			fittest = this.getTrip(i);
			fittestIndex = i;
		}
	}
	this.population.splice(fittestIndex, 1);
	return fittest;
}

Population.prototype.size = function() {
	return this.population.length;
}

Population.prototype.addTrip = function(trip) {
	this.population.push(trip);
}

Population.prototype.addChildren = function(children) {
	for(var i in children)
		this.population.push(children[i]);
}

Population.prototype.evolve = function(){
	var len = this.population.length/2;
	var children = [];
	for(var i = 0; i < len; i++) {
		var trip1 = this.tournamentSelection();
		var trip2 = this.tournamentSelection();
		var newTrip = this.crossover(trip1, trip2);
		newTrip.mutate();
		newTrip.getFitness();
		children.push(newTrip);
	}
	this.addChildren(children);

}

Population.prototype.survivalOfTheFittest = function() {
	var initialSize = this.population.length;
	var maxSize = 50;
	if(initialSize < maxSize)
		return;
	var survivors = [];
	for(var i = 0; i < maxSize; i++) {
		var trip = this.getBestTrip();
		survivors.push(trip);
	}
	this.population = survivors;
}

Population.prototype.crossover = function(trip1, trip2) {
	var newTrip = new GeneticAlgorithm(this.numRestaurants, this.numHotels, this.numAttractions, this.tripPool);

	//restaurants
	if (Math.random() % 2 === 1) {
		var restaurants1 = trip1.getRestaurantBits();
		newTrip.setRestaurantBits(restaurants1);
	}
	else {
		var restaurants2 = trip2.getRestaurantBits();
		newTrip.setRestaurantBits(restaurants2);
	}

	//hotels
	if (Math.random() % 2 === 1) {
		var hotels1 = trip1.getHotelBits();
		newTrip.setHotelBits(hotels1);
	}
	else {
		var hotels2 = trip2.getHotelBits();
		newTrip.setHotelBits(hotels2);
	}

	//attractions
	if (Math.random() % 2 === 1) {
		var attractions1 = trip1.getAttractionBits();
		newTrip.setAttractionBits(attractions1);
	}
	else {
		var attractions2 = trip2.getAttractionBits();
		newTrip.setAttractionBits(attractions2);
	}

	return newTrip;
}


Population.prototype.tournamentSelection = function() {
	var length = 12;
	var tournament = new Population(length, this.numRestaurants, this.numHotels, this.numAttractions, this.tripPool);
	for(var i = 0; i < length; i++) {
		var randomTripIndex = Math.floor(Math.random() * this.population.length);
		var randomTrip = this.population[randomTripIndex];
		tournament.addTrip(randomTrip);
	}
	return tournament.getBestTrip(this);
}
