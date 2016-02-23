module.exports = Attraction

function Attraction(mood, moneyToUse, city, state, attractions){
	this.mood = mood;
	this.city = city;
	this.state = state;
	this.moneyToUse = moneyToUse;
	this.attractions = attractions

	this.category = "";
	this.popularity = null;

	var rand = Math.floor(Math.random() * this.attractions.length);
	var randomAttraction = this.attractions[rand];
	this.name = randomAttraction.name;
	this.price = randomAttraction.price;
	this.ratings = randomAttraction.rating;

}


Attraction.prototype.someMethodHere = function() {
	// body...
};