module.exports = Attraction

function Attraction(db){
	this.db = db;
	this.name = "";
	this.city = "";
	this.state = "";
	this.price = 0.0;
	this.category = "";
	this.ratings = null;
	this.popularity = null;
}


Attraction.prototype.someMethodHere = function() {
	// body...
};