module.exports = Hotel


function Hotel(mood, city, state, hotel){
	this.mood = mood; 
	this.city = city;
	this.state = state;

	this.popularity = null;

	this.name = hotel.name;
	this.price = hotel.price;
	this.ratings = hotel.rating;
}


Hotel.prototype.someMethodHere = function() {
	// body...
};