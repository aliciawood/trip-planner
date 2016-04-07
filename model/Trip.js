module.exports = Trip

var Restaurant = require("./Restaurant"),
	Attraction = require("./Attraction"),
	Hotel = require("./Hotel"),
	Population = require("./Population"),
	GeneticAlgorithm = require("./genetic/GeneticAlgorithm"),
	Evaluation = require("./genetic/Evaluation"),
	assert = require('assert'),
	RadarSearch = require("../node_modules/googleplaces/lib/RadarSearch.js"),
	config = require("../config.js");

function Trip(db, budget, mood, res){
	this.db = db;
	this.budget = budget;
	this.mood = mood;
	this.res = res;
	
	this.placeName = "";
	this.state = "";
	this.city = "";
	this.restaurants = [];
	this.hotels = [];
	this.attractions = [];
	this.picture = null;
	this.numDays = 4;

	this.restaurantsQueried = [];
	this.hotelsQueried = [];
	this.attractionsQueried = [];

	this.loadedRestaurants = 0;
	this.loadedAttractions = 0;
	this.loadedHotels = 0;

	var curr = this;


    var radarSearch = new RadarSearch(config.apiKey, config.outputFormat);
  	
    var parameters = {
        location: [40.2338438, -111.65853370000002],
        keyword: "restaurant",
        radius: '100'
    };
    radarSearch(parameters, function (error, response) {
        if (error) throw error;
        assert.notEqual(response.results.length, 0, "Place search must not return 0 results");
        for(var i in response.results){
        	var newRestaurant = new Restaurant(curr,curr.mood, curr.city, curr.state, response.results[i]);
    		curr.restaurantsQueried.push(newRestaurant);
        }
        curr.complete();
    });
   
    parameters = {
        location: [40.2338438, -111.65853370000002],
        keyword: "lodging",
        radius: '200'
    };

    radarSearch(parameters, function (error, response) {
        if (error) throw error;
        assert.notEqual(response.results.length, 0, "Place search must not return 0 results");
        for(var i in response.results){
        	var newHotel = new Hotel(curr,curr.mood, curr.city, curr.state, response.results[i]);
        	curr.hotelsQueried.push(newHotel);
        }
        curr.complete();
    });

    //getting points of interest--multiple calls
    this.findAttractions(radarSearch);

    // google maps api stuff
    this.generateLocation();
}

Trip.prototype.findAttractions = function(radarSearch) {
	var curr = this;
	//doctor, hospital, veterinary_care
	var attractions = ["art_gallery", "amusement_park", "aquarium", "bowling_alley",
						"movie_theater", "museum", "night_club", "park", "shopping_mall",
						"spa", "zoo"];
	for(var i = 0; i < attractions.length; i++) {
		var parameters = {
	        location: [40.2338438, -111.65853370000002],
	        type: [attractions[i]],
	        radius: '500'
	    };

	    radarSearch(parameters, function (error, response) {
	        if (error) throw error;
	        if(response.results.length == 0) console.log("didn't find", attractions[i]);
	        //assert.notEqual(response.results.length, 0, "Place search must not return 0 results");
	        for(var i in response.results){
	        	var newAttraction = new Attraction(curr,curr.mood, curr.city, curr.state, response.results[i]);
	        	curr.attractionsQueried.push(newAttraction);
	        }
	        curr.complete();
	    });
	}
}

Trip.prototype.filterAttractions = function() {
	var newAttractions = [];
	//this.attractionsQueried.forEach(function(element, index, array) {console.log(element.name);});
	for( var i = 0; i < this.attractionsQueried.length; i++) {
		var attractionName = this.attractionsQueried[i].name;
		var match = newAttractions.find(function (attraction) {return attraction.name == attractionName;});
		if(!match)
			newAttractions.push(this.attractionsQueried[i]);
	}
	//newAttractions.forEach(function(element, index, array) {console.log(element.name);});
}

Trip.prototype.complete = function(){
	//TODO add loadedHotels and loadedAttractions
	if((this.loadedRestaurants == this.restaurantsQueried.length) && (this.loadedHotels == this.hotelsQueried.length) && (this.loadedAttractions == this.attractionsQueried.length)){
		if(this.restaurantsQueried.length!=0 && this.attractionsQueried.length!=0 && this.hotelsQueried.length!=0) {
			this.filterAttractions();
			this.generateEvaluation();
		}
	}
}

Trip.prototype.generateEvaluation = function(){
	this.eval = new Evaluation(this);
}


Trip.prototype.generateTrip = function() {
	console.log("GENERATING TRIP!!!");
	//genetic algorithm part!
	var population = new Population(10, this.restaurantsQueried.length, this.hotelsQueried.length, this.attractionsQueried.length);
	population.init();
	this.evolvePopulation(population);
	var bestTrip = population.getBestTrip(this);			//bestTrip INSTANCEOF GeneticAlgorithm
	this.printTrip(bestTrip);

	var score = bestTrip.getFitness(this);
	console.log("SCORE OF BEST TRIP: ",score);


	//figure out how to split up budget between attractions and lodging.....
	var moneyForAttractions = this.budget/2.0;
	var moneyForHotels = this.budget/2.0;

	


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

Trip.prototype.evolvePopulation = function(population) {
	//var newPopulation = new Population(population.size(), this.restaurantsQueried.length, this.hotelsQueried.length, this.attractionsQueried.length);
	var size = population.size();
	for(var i = 0; i < size; i++) {
		var trip1 = this.tournamentSelection(population);
		var trip2 = this.tournamentSelection(population);
		var newTrip = this.crossover(trip1, trip2);
		newTrip.mutate();
		population.addTrip(newTrip);
	}
}

Trip.prototype.tournamentSelection = function(population) {
	var tournament = new Population(6, this.restaurantsQueried.length, this.hotelsQueried.length, this.attractionsQueried.length);
	for(var i = 0; i < 6; i++) {
		var randomTripIndex = Math.floor(Math.random() * population.size());
		var randomTrip = population.getTrip(randomTripIndex);
		tournament.addTrip(randomTrip);
	}

	var bestTrip = tournament.getBestTrip(this);
	return bestTrip;
}

Trip.prototype.crossover = function(trip1, trip2) {
	var newTrip = new GeneticAlgorithm(this.restaurantsQueried.length, this.hotelsQueried.length, this.attractionsQueried.length);

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

Trip.prototype.generateLocation = function(){
	this.city = "Provo";
	this.state = "Alabama";
	//wikipedia info
	//other sites
}

Trip.prototype.printTrip = function(trip) {
	this.getRestaurants(trip);
	this.getAttractions(trip);
	this.getHotels(trip);
}

Trip.prototype.getRestaurants = function(trip){
	var restaurantBits = trip.getRestaurantBits();
	for(var i=0; i<this.restaurantsQueried.length; i++){
		if(restaurantBits[i] == 0)
			continue;
		var newRestaurant = this.restaurantsQueried[i];
		this.restaurants.push(newRestaurant);
	}
}

Trip.prototype.getAttractions = function(trip){
	var attractionBits = trip.getAttractionBits();
	for(var i=0; i<this.attractionsQueried.length; i++){
		if(attractionBits[i] == 0)
			continue;
		var newAttraction = this.attractionsQueried[i];
		this.attractions.push(newAttraction);
	}
}

Trip.prototype.getHotels = function(trip){
	var hotelBits = trip.getHotelBits();
	for(var i=0; i<this.hotelsQueried.length; i++){
		if(hotelBits[i] == 0)
			continue;
		var newHotel = this.hotelsQueried[i];
		this.hotels.push(newHotel);
	}
	
}

Trip.prototype.generateRestaurantList = function() {

}

Trip.prototype.generateHotelList = function() {

}

Trip.prototype.generateAttractionList = function() {

}
