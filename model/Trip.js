module.exports = Trip

var Restaurant = require("./Restaurant"),
	Attraction = require("./Attraction"),
	Hotel = require("./Hotel");

function Trip(db){
	this.db = db;
	this.placeName = "";
	this.city = "";
	this.state = "";
	this.mood = "";
	this.budget = 0.0;
	this.restaurants = [];
	this.hotels = [];
	this.attractions = [];
	this.picture = null;
	this.numDays = 4;

	// var collection = db.get('tripPlanner');
	// collection.find({},{},function(e,docs){
 //        res.render('userlist', {
 //            "userlist" : docs
 //        });
 //    });

}


Trip.prototype.generateTrip = function(budget,mood) {
	console.log("GENERATING A TRIP!: $"+budget+", and mood: ",mood);
	this.budget = budget;
	this.mood = mood;
	

	//figure out how to split up budget between attractions and lodging.....
	var moneyForAttractions = this.budget/2.0;
	var moneyForHotels = this.budget/2.0;

	this.generateLocation();

	this.generateRestaurants();
	this.generateAttractions(moneyForAttractions);
	this.generateHotels(moneyForHotels);

};

Trip.prototype.generateLocation = function(){
	console.log("GENERATING A LOCATION!");
	this.city = "Provo";
	this.state = "UT";
	console.log("CITY: ",this.city);
	console.log("STATE: ",this.state);


	//wikipedia info
	//other sites
}


Trip.prototype.generateRestaurants = function(){
	console.log("GENERATING RESTAURANTS!");
	for(var i=0; i<(this.numDays*2); i++){
		var newRestaurant = new Restaurant(this.mood, this.city, this.state, this.db);
		this.restaurants.push(newRestaurant);
	}
}

Trip.prototype.generateAttractions = function(money){
	console.log("GENERATING ATTRACTIONS WITH: $"+money+"!");
	var moneyPerAttraction = money/(this.numDays*2);
	for(var i=0; i<(this.numDays*2); i++){
		var newAttraction = new Attraction(this.mood, moneyPerAttraction, this.city, this.state, this.db);
		this.attractions.push(newAttraction);
	}
}

Trip.prototype.generateHotels = function(money){
	console.log("GENERATING HOTELS WITH: $"+money+"!");
	var moneyPerHotel = money/(this.numDays);
	for(var i=0; i<this.numDays; i++){
		var newHotel = new Hotel(this.mood, moneyPerHotel, this.city, this.state, this.db);
		this.hotels.push(newHotel);
	}
	
}