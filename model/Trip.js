module.exports = Trip

var Restaurant = require("./Restaurant"),
	Attraction = require("./Attraction"),
	Hotel = require("./Hotel"),
	Population = require("./Population"),
	GeneticAlgorithm = require("./genetic/GeneticAlgorithm"),
	assert = require('assert'),
	NearBySearch = require("../node_modules/googleplaces/lib/NearBySearch.js"),
	config = require("../config.js");

function Trip(db, budget, mood, res){
	console.log("TRIP GENERATOR!");
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

	var curr = this;


    var nearBySearch = new NearBySearch(config.apiKey, config.outputFormat);
  	
    var parameters = {
        location: [40.2338438, -111.65853370000002],
        keyword: "restaurants",
        radius: '500'
    };
    nearBySearch(parameters, function (error, response) {
        if (error) throw error;
        assert.notEqual(response.results.length, 0, "Place search must not return 0 results");
        for(var i in response.results){
        	// console.log("response: ",response.results[i].place_id);
        	var newRestaurant = new Restaurant(curr.mood, curr.city, curr.state, response.results[i]);
    		curr.restaurantsQueried.push(newRestaurant);
        }
        curr.complete();
        
    });


   
    parameters = {
        location: [40.2338438, -111.65853370000002],
        keyword: "lodging",
        radius: '500'
    };

    nearBySearch(parameters, function (error, response) {
        if (error) throw error;
        assert.notEqual(response.results.length, 0, "Place search must not return 0 results");
        for(var i in response.results){
        	var newHotel = new Hotel(curr.mood, curr.city, curr.state, response.results[i]);
        	curr.hotelsQueried.push(newHotel);
        }
        curr.complete();
    });

    parameters = {
        location: [40.2338438, -111.65853370000002],
        keyword: "establishment",
        radius: '500'
    };

    nearBySearch(parameters, function (error, response) {
        if (error) throw error;
        assert.notEqual(response.results.length, 0, "Place search must not return 0 results");
        for(var i in response.results){
        	var newAttraction = new Attraction(curr.mood, curr.city, curr.state, response.results[i]);
        	curr.attractionsQueried.push(newAttraction);
        }
        curr.complete();
    });


    // google maps api stuff
    this.generateLocation();
    this.getData();

}
Trip.prototype.complete = function(){
	if(this.restaurantsQueried.length!=0 && this.attractionsQueried.length!=0 && this.hotelsQueried.length!=0){
		this.generateTrip();
	}
}


Trip.prototype.generateTrip = function() {
	console.log("GENERATE TRIP!");
	
	//genetic algorithm part!
	var population = new Population(10, this.restaurantsQueried.length, this.hotelsQueried.length, this.attractionsQueried.length);
	population.init();
	console.log("before evolve: ", population.size());
	this.evolvePopulation(population);
	console.log("after evolve: ", population.size());
	var bestTrip = population.getBestTrip();
	this.printTrip(bestTrip);


	//figure out how to split up budget between attractions and lodging.....
	var moneyForAttractions = this.budget/2.0;
	var moneyForHotels = this.budget/2.0;

	this.generateLocation();


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
		//newTrip.mutate();
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

	var bestTrip = tournament.getBestTrip();
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
		// var newRestaurant = new Restaurant(this.mood, this.city, this.state, this.restaurantsQueried[i]);
		var newRestaurant = this.restaurantsQueried[i];
		this.restaurants.push(newRestaurant);
	}
}

Trip.prototype.getAttractions = function(trip){
	var attractionBits = trip.getAttractionBits();
	for(var i=0; i<this.attractionsQueried.length; i++){
		if(attractionBits[i] == 0)
			continue;
		// var newAttraction = new Attraction(this.mood, this.city, this.state, this.attractionsQueried[i]);
		var newAttraction = this.attractionsQueried[i];
		this.attractions.push(newAttraction);
	}
}

Trip.prototype.getHotels = function(trip){
	var hotelBits = trip.getHotelBits();
	for(var i=0; i<this.hotelsQueried.length; i++){
		if(hotelBits[i] == 0)
			continue;
		// var newHotel = new Hotel(this.mood, this.city, this.state, this.hotelsQueried[i]);
		var newHotel = this.hotelsQueried[i];
		this.hotels.push(newHotel);
	}
	
}

Trip.prototype.getData = function() {
	var displayMap;
	var service;
	/*var test = "test";

	displayMap = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 40.2338438, lng: -111.65853370000002},
		zoom: 15 });


	var geocoder = new google.maps.Geocoder();
	var address = document.getElementById('address').value;

	gmAPI.geocode({'address': address}, function(results, status) {
		if (status === google.maps.GeocoderStatus.OK) {
			var infowindow = new google.maps.InfoWindow();
			google.maps.event.addListener(marker, 'click', function() {
				infowindow.setContent(address);
				infowindow.open(displayMap, this);
			});

			updatePoints(displayMap)
		} else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
	});

    function callback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        restaurants = results;
        var list = document.getElementById('restaurantList');
        list.innerHTML = '';
        for (var i = 0; i < results.length; i++) {
          var place = results[i];
          updateRestaurants(place);
          createMarker(place, displayMap);
        }
      }
    }

    function updateRestaurants(place) {
      var list = document.getElementById('restaurantList');
      var newEntry = document.createElement('li');
      newEntry.appendChild(document.createTextNode(place.name));
      list.appendChild(newEntry);
    }

    function updatePoints(map) {
      var request = {
            location: map.getCenter(),
            radius: '500',
            types: ["food"]
      };
      service = new google.maps.places.PlacesService(displayMap);
      service.nearbySearch(request, callback);
    }

    function createMarker(place, map) {
      var placeLoc = place.geometry.location;
      var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
      });

      var infowindow = new google.maps.InfoWindow();
      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
      });
    }*/
}

Trip.prototype.generateRestaurantList = function() {

}

Trip.prototype.generateHotelList = function() {

}

Trip.prototype.generateAttractionList = function() {

}
