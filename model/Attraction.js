module.exports = Attraction

function Attraction(mood, moneyToUse, city, state, db){
	this.db = db;
	this.mood = mood;
	this.city = city;
	this.state = state;
	this.moneyToUse = moneyToUse;

	this.name = "";
	this.price = 0.0;
	this.category = "";
	this.ratings = null;
	this.popularity = null;
}


Attraction.prototype.someMethodHere = function() {
	// body...
};