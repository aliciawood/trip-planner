module.exports = TripGenerator

var Restaurant = require("./Restaurant"),
	Attraction = require("./Attraction"),
	Hotel = require("./Hotel"),
	Population = require("./Population"),
	Trip = require("./Trip"),
	assert = require('assert');

function TripGenerator(db, budget, mood, res){
	this.db = db;
	this.budget = budget;
	this.mood = mood;
	this.res = res;
	
	this.placeName = "";
	this.city = "";
	this.state = "";
	this.restaurants = [];
	this.hotels = [];
	this.attractions = [];
	this.picture = null;
	this.numDays = 4;

	
	this.restaurantsQueried = null;
	this.hotelsQueried = null;
	this.attractionsQueried = null;


	var curr = this;
	var collection1 = db.get("restaurants");
    collection1.find({},{},function(e,docs){
    	curr.restaurantsQueried = docs;
    	curr.complete();
    });


    var collection2 = db.get("hotels");
    collection2.find({},{},function(e,docs){
    	curr.hotelsQueried = docs;
    	curr.complete();
    });

    var collection3 = db.get("attractions");
    collection3.find({},{},function(e,docs){
    	curr.attractionsQueried = docs;
    	curr.complete();
    });

}
TripGenerator.prototype.complete = function(){
	if(this.restaurantsQueried!=null && this.attractionsQueried!=null && this.hotelsQueried!=null){
		this.generateTrip();
	}
}


TripGenerator.prototype.generateTrip = function() {
	
	//genetic algorithm part!
	var population = new Population(10, this.restaurantsQueried.length, this.hotelsQueried.length, this.attractionsQueried.length);
	population.init();
	console.log("before evolve: ", population.size());
	this.evolvePopulation(population);
	console.log("after evolve: ", population.size());
	var bestTrip = population.getBestTrip();
	bestTrip.printTrip();


	//figure out how to split up budget between attractions and lodging.....
	var moneyForAttractions = this.budget/2.0;
	var moneyForHotels = this.budget/2.0;

	this.generateLocation();

	this.generateRestaurants();
	this.generateAttractions(moneyForAttractions);
	this.generateHotels(moneyForHotels);

	this.res.render('tripoutput', {
        "restaurantlist" : this.restaurants,
        "hotellist": this.hotels,
        "attractionlist": this.attractions,
        "city":this.city,
        "state":this.state,
        "money":this.budget,
        "mood":this.mood
    });
	

};

TripGenerator.prototype.evolvePopulation = function(population) {
	//var newPopulation = new Population(population.size(), this.restaurantsQueried.length, this.hotelsQueried.length, this.attractionsQueried.length);
	var size = population.size();
	for(var i = 0; i < size; i++) {
		var trip1 = this.tournamentSelection(population);
		var trip2 = this.tournamentSelection(population);
		var newTrip = this.crossover(trip1, trip2);
		//newTrip.mutate();
		population.addTrip(newTrip);
	}
}

TripGenerator.prototype.tournamentSelection = function(population) {
	var tournament = new Population(6, this.restaurantsQueried.length, this.hotelsQueried.length, this.attractionsQueried.length);
	for(var i = 0; i < 6; i++) {
		var randomTripIndex = Math.floor(Math.random() * population.size());
		var randomTrip = population.getTrip(randomTripIndex);
		tournament.addTrip(randomTrip);
	}

	var bestTrip = tournament.getBestTrip();
	return bestTrip;
}

TripGenerator.prototype.crossover = function(trip1, trip2) {
	var newTrip = new Trip(this.restaurantsQueried.length, this.hotelsQueried.length, this.attractionsQueried.length);

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

TripGenerator.prototype.generateLocation = function(){
	this.city = "Provo";
	this.state = "UT";
	//wikipedia info
	//other sites
}


TripGenerator.prototype.generateRestaurants = function(){
	for(var i=0; i<(this.numDays*2); i++){
		var newRestaurant = new Restaurant(this.mood, this.city, this.state, this.restaurantsQueried);
		this.restaurants.push(newRestaurant);
	}
}

TripGenerator.prototype.generateAttractions = function(money){
	var moneyPerAttraction = money/(this.numDays*2);
	for(var i=0; i<(this.numDays*2); i++){
		var newAttraction = new Attraction(this.mood, moneyPerAttraction, this.city, this.state, this.attractionsQueried);
		this.attractions.push(newAttraction);
	}
}

TripGenerator.prototype.generateHotels = function(money){
	var moneyPerHotel = money/(this.numDays);
	for(var i=0; i<this.numDays; i++){
		var newHotel = new Hotel(this.mood, moneyPerHotel, this.city, this.state, this.hotelsQueried);
		this.hotels.push(newHotel);
	}
	
}