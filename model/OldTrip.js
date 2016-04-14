module.exports = Trip

var Restaurant = require("./Restaurant"),
	Attraction = require("./Attraction"),
	Hotel = require("./Hotel"),
	Population = require("./Population"),
	GeneticAlgorithm = require("./genetic/GeneticAlgorithm"),
	Evaluation = require("./genetic/Evaluation"),
	assert = require('assert'),
	RadarSearch = require("../node_modules/googleplaces/lib/RadarSearch.js"),
	PlaceSearch = require("../node_modules/googleplaces/lib/PlaceSearch.js"),
	geocoder = require('geocoder'),
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

	this.latitude = -1;
	this.longitude = -1;

	this.eval = new Evaluation(this);

	// this.generateLocation();
    
}

Trip.prototype.generateLocation = function(){
	var curr = this;
	var collection1 = this.db.get("culturalinfo");
	var scoreToState = {}
	collection1.find({},{},function(e,docs){
		for(var i in docs){
			var currStateInfo = docs[i];
			var stateName = docs[i]['state'];

			// var stateCapital = docs[i]['capital'];
			var stateScore = curr.eval.calculateMoodScore(undefined,docs[i]['info']);
			console.log(stateName,":",stateScore);
			scoreToState[stateScore] = stateName;
		}
		//sort scores
		var sorted = [];
	    for(var key in scoreToState) 
	        sorted[sorted.length] = key;
	    sorted.sort(function(a, b){return b-a});

	    //get the top three
	    //then get them from the dictionary
	    console.log("FIRST: ",sorted[0],":",scoreToState[sorted[0]]);
	    console.log("SECOND: ",sorted[1],":",scoreToState[sorted[1]]);
	    console.log("THIRD: ",sorted[2],":",scoreToState[sorted[2]]);

	});
    	
	this.state = "Maryland";
	
	// var collection1 = this.db.get("culturalinfo");
    // collection1.find({"state":this.state},{},function(e,docs){
    // 	curr.culturalinfo = docs[0]["info"];
    // 	curr.city = docs[0]["capital"];
    // 	curr.convertPlace();
    // });
}
Trip.prototype.sortScores = function(){

}

Trip.prototype.convertPlace = function(){
	var curr = this;
	geocoder.geocode(this.city +","+ this.state, function(err,data){
		var location = data.results[0].geometry.location;
		curr.latitude = location.lat;
		curr.longitude = location.lng;
		curr.radarSearch();
	});	
}

Trip.prototype.radarSearch = function(){
	var radarSearch = new RadarSearch(config.apiKey, config.outputFormat);
	var placeSearch = new PlaceSearch(config.apiKey, config.outputFormat);

	var locationParam = [this.latitude, this.longitude];
  	
    var parameters = {
        location: locationParam,
        keyword: "restaurant",
        radius: '5000'
    };

    var curr = this;
    //placeSearch(parameters, function (error, response) {
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
        location: locationParam,
        keyword: "campground",
        radius: '5000'
    };

    //placeSearch(parameters, function (error, response) {
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
    this.findAttractions(radarSearch, locationParam);
}

Trip.prototype.findAttractions = function(radarSearch, locationParam) {
	var curr = this;
	var attractions = ["art_gallery", "amusement_park", "aquarium", "bowling_alley",
						"movie_theater", "museum", "night_club", "park", "shopping_mall",
						"spa", "zoo"];
	for(var i = 0; i < attractions.length; i++) {
		var parameters = {
	        location: locationParam,
	        type: [attractions[i]],
	        radius: '5000'
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

Trip.prototype.containsInArray = function(list, toFind){
	for(var i in list){
		var currAttractionName = list[i].name;
		if(currAttractionName == toFind)
			return true;
	}
	return false;
}
Trip.prototype.filterHelper=function(types){
	for(var t in types){
		var type = types[t];
		if(type == "doctor" || type == "hospital" || type  == "veterinary_care" || type == "restaurant")
			return true;
	}
	return false;
}

Trip.prototype.filterAttractions = function() {
	var newAttractions = [];
	for( var i = 0; i < this.attractionsQueried.length; i++) {
		var attractionName = this.attractionsQueried[i].name;
		
	
		var match = this.containsInArray(newAttractions, attractionName);
		if(!match) {
			//doctor, hospital, veterinary_care
			var types = this.attractionsQueried[i].types;
			match = this.filterHelper(types);
			if(!match)
				newAttractions.push(this.attractionsQueried[i]);

		}
		
	}
	this.attractionsQueried = newAttractions;

}

Trip.prototype.complete = function(){
	//TODO add loadedHotels and loadedAttractions
	if((this.loadedRestaurants == this.restaurantsQueried.length) && (this.loadedHotels == this.hotelsQueried.length) && (this.loadedAttractions == this.attractionsQueried.length)){
		if(this.restaurantsQueried.length!=0 && this.attractionsQueried.length!=0 && this.hotelsQueried.length!=0) {
			this.filterAttractions();
			// this.generateEvaluation();
			this.generateTrip();
		}
	}
}

// Trip.prototype.generateEvaluation = function(){
	// this.eval.startEval();
	// this.eval.generateTrip();
// }


Trip.prototype.generateTrip = function() {
	// console.log("GENERATING TRIP!!!");
	//genetic algorithm part!
	var population = new Population(10, this.restaurantsQueried.length, this.hotelsQueried.length, this.attractionsQueried.length);
	// console.log("AFTER Population");
	population.init();
	// console.log("AFTER INIT");
	this.evolvePopulation(population);
	// console.log("AFTER EVOLVE");
	var bestTrip = population.getBestTrip(this);			//bestTrip INSTANCEOF GeneticAlgorithm
	// console.log("AFTER GET BEST TRIP");
	this.printTrip(bestTrip);
	// console.log("AFTER PRINT TRIP");

	var score = bestTrip.getFitness(this);
	// console.log("SCORE OF BEST TRIP: ",score);


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
