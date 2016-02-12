module.exports = Hotel

function Hotel(db){
	this.db = db;
	this.name = "";
	this.city = "";
	this.state = "";
	this.price = 0.0;
	this.ratings = null;
	this.popularity = null;
}


Hotel.prototype.someMethodHere = function() {
	// body...
};