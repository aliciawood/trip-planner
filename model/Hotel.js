module.exports = Hotel


function Hotel(mood, moneyToUse, city, state, hotels){
	this.mood = mood;
	this.moneyToUse = moneyToUse; 
	this.city = city;
	this.state = state;
	this.hotels = hotels

	this.popularity = null;

	var rand = Math.floor(Math.random() * this.hotels.length);
	var randomHotel = this.hotels[rand];
	this.name = randomHotel.name;
	this.price = randomHotel.price;
	this.ratings = randomHotel.rating;
}


Hotel.prototype.someMethodHere = function() {
	// body...
};