module.exports = Restaurant

function Restaurant(db){
	this.db = db;
	this.name = "";
	this.genre = "";
	this.city = "";
	this.state = "";
	this.ratings = null;
}


Restaurant.prototype.someMethodHere = function() {
	// body...
};