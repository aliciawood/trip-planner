module.exports = Trip

function Trip(db){
	this.db = db;
	this.placeName = "";
	this.mood = "";
	this.budget = 0.0;
	this.restaurants = [];
	this.hotels = [];
	this.attractions = [];
	this.picture = null;
}


Trip.prototype.generateTrip = function() {
	console.log("HERES A TRIP!");
};