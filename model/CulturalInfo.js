module.exports = CulturalInfo

function CulturalInfo(db){
	this.db = db;
	this.city = "";
	this.state = "";
	this.listOfTags = [];
}


CulturalInfo.prototype.someMethodHere = function() {
	// body...
};