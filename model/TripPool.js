module.exports = TripPool

var assert = require('assert'),
	RadarSearch = require("../node_modules/googleplaces/lib/RadarSearch.js"),
	PlaceSearch = require("../node_modules/googleplaces/lib/PlaceSearch.js"),
	geocoder = require('geocoder'),
	config = require("../config.js"),
	Restaurant = require("./Restaurant"),
	Attraction = require("./Attraction"),
	Hotel = require("./Hotel"),
	Trip = require("./Trip"),
	Population = require("./Population");

function TripPool(state, city, culturalInfo, inspiringSet){
	this.state = state.trim();
	this.city = city.trim();
	this.culturalInfo = culturalInfo;
	this.inspiringSet = inspiringSet;
	this.latitude = -1;
	this.longitude = -1;
	this.allPossibleRestaurants = [];
	this.allPossibleHotels = [];
	this.allPossibleAttractions = [];

	this.loadedRestaurants = 0;
	this.loadedAttractions = 0;
	this.loadedHotels = 0;

	this.calculateLatAndLong();
}

TripPool.prototype.calculateLatAndLong = function(){
	var curr = this;
	geocoder.geocode(this.city +","+ this.state, function(err,data){
		var location = data.results[0].geometry.location;
		curr.latitude = location.lat;
		curr.longitude = location.lng;
		curr.radarSearch();
	});	
}

TripPool.prototype.radarSearch = function(){
	var radarSearch = new RadarSearch(config.apiKey, config.outputFormat);
	var placeSearch = new PlaceSearch(config.apiKey, config.outputFormat);

	var locationParam = [this.latitude, this.longitude];
  	
    var parameters = {
        location: locationParam,
        keyword: "restaurant",
        radius: '50000'
    };

    var curr = this;
    //placeSearch(parameters, function (error, response) {
	 radarSearch(parameters, function (error, response) {
        if (error) throw error;
        assert.notEqual(response.results.length, 0, "Place search must not return 0 results");
        for(var i in response.results){
        	var newRestaurant = new Restaurant(curr,curr.mood, curr.city, curr.state, response.results[i]);
    		curr.allPossibleRestaurants.push(newRestaurant);
        }
        curr.complete();
    });
   
    parameters = {
        location: locationParam,
        keyword: "lodging",
        radius: '50000'
    };

    //placeSearch(parameters, function (error, response) {
     radarSearch(parameters, function (error, response) {
        if (error) throw error;
        // assert.notEqual(response.results.length, 0, "Place search must not return 0 results");
        for(var i in response.results){
        	var newHotel = new Hotel(curr,curr.mood, curr.city, curr.state, response.results[i]);
        	curr.allPossibleHotels.push(newHotel);
        }
        curr.complete();
    });

    //getting points of interest--multiple calls
    this.findAttractions(radarSearch, locationParam);
}

TripPool.prototype.findAttractions = function(radarSearch, locationParam) {
	var curr = this;
	var attractions = ["art_gallery", "amusement_park", "aquarium", "bowling_alley",
						"movie_theater", "museum", "night_club", "park", "shopping_mall",
						"spa", "zoo"];
	for(var i = 0; i < attractions.length; i++) {
		var parameters = {
	        location: locationParam,
	        type: [attractions[i]],
	        radius: '50000'
	    };

	    radarSearch(parameters, function (error, response) {
	        if (error) throw error;
	        // if(response.results.length == 0) console.log("didn't find", attractions[i]);
	        //assert.notEqual(response.results.length, 0, "Place search must not return 0 results");
	        for(var i in response.results){
	        	var newAttraction = new Attraction(curr,curr.mood, curr.city, curr.state, response.results[i]);
	        	curr.allPossibleAttractions.push(newAttraction);
	        }
	        curr.complete();
	    });
	}
}
TripPool.prototype.containsInArray = function(list, toFind){
	for(var i in list){
		var currAttractionName = list[i].name;
		if(currAttractionName == toFind)
			return true;
	}
	return false;
}
TripPool.prototype.filterHelper=function(types){
	for(var t in types){
		var type = types[t];
		if(type == "doctor" || type == "hospital" || type  == "veterinary_care" || type == "restaurant")
			return true;
	}
	return false;
}

TripPool.prototype.filterAttractions = function() {
	var newAttractions = [];
	for( var i = 0; i < this.allPossibleAttractions.length; i++) {
		var attractionName = this.allPossibleAttractions[i].name;
		
	
		var match = this.containsInArray(newAttractions, attractionName);
		if(!match) {
			//doctor, hospital, veterinary_care
			var types = this.allPossibleAttractions[i].types;
			match = this.filterHelper(types);
			if(!match)
				newAttractions.push(this.allPossibleAttractions[i]);

		}
		
	}
	this.allPossibleAttractions = newAttractions;

}

TripPool.prototype.complete = function(){
	// console.log("REST: ",this.loadedRestaurants,"/",this.allPossibleRestaurants.length);
	// console.log("Attractions: ",this.loadedAttractions,"/",this.allPossibleAttractions.length);
	// console.log("Hotels: ",this.loadedHotels,"/",this.allPossibleHotels.length);
	if((this.loadedRestaurants == this.allPossibleRestaurants.length) && (this.loadedHotels == this.allPossibleHotels.length) && (this.loadedAttractions == this.allPossibleAttractions.length)){
		if(this.allPossibleRestaurants.length!=0 && this.allPossibleAttractions.length!=0 && this.allPossibleHotels.length!=0) {
			this.filterAttractions();
			this.generateTrip();
		}
	}
}

TripPool.prototype.generateTrip = function(){
	//genetic algorithm part!
	var population = new Population(50, this.loadedRestaurants, this.loadedHotels, this.loadedAttractions, this);
	population.init();

	var generations = 35;
	for(var g = 0; g < generations; g++) {
		population.evolve();
		population.survivalOfTheFittest();
		//console.log("AFTER EVOLVE: ",population.size());
	}

	var bestGATrip = population.getBestTrip(this);			//bestTrip INSTANCEOF GeneticAlgorithm
	this.bestTrip = this.getTrip(bestGATrip);

	console.log("*****GOT A BEST TRIP");
	this.inspiringSet.findOverallBestTrip();

	//figure out how to split up budget between attractions and lodging.....
	// var moneyForAttractions = this.budget/2.0;
	// var moneyForHotels = this.budget/2.0;

	// return bestTrip;

	//TODO send this best trip back to inspiring set, pick the best of the three and render

}
TripPool.prototype.getBestTrip = function(){
	return this.bestTrip;
}

TripPool.prototype.getTrip = function(gaTripString){
	var toReturn = new Trip(this.state, this.city, this.culturalInfo, this.inspiringSet);
	var restaurantBits = gaTripString.getRestaurantBits();
	for(var i=0; i<this.allPossibleRestaurants.length; i++){
		if(restaurantBits[i] == 0)
			continue;
		var newRestaurant = this.allPossibleRestaurants[i];
		toReturn.restaurants.push(newRestaurant);
	}
	var attractionBits = gaTripString.getAttractionBits();
	for(var i=0; i<this.allPossibleAttractions.length; i++){
		if(attractionBits[i] == 0)
			continue;
		var newAttraction = this.allPossibleAttractions[i];
		toReturn.attractions.push(newAttraction);
	}
	var hotelBits = gaTripString.getHotelBits();
	for(var i=0; i<this.allPossibleHotels.length; i++){
		if(hotelBits[i] == 0)
			continue;
		var newHotel = this.allPossibleHotels[i];
		toReturn.hotels.push(newHotel);
	}
	return toReturn;
}