module.exports = Hotel


function Hotel(mood, moneyToUse, city, state, db){
	this.db = db;
	this.mood = mood;
	this.moneyToUse = moneyToUse; 
	this.city = city;
	this.state = state;

	this.name = "";
	this.price = 0.0;
	this.ratings = null;
	this.popularity = null;
}


Hotel.prototype.someMethodHere = function() {
	// body...
};