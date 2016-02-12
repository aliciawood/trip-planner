module.exports = Restaurant

function Restaurant(mood, city, state, db){
	this.db = db;
	this.mood = mood;
	this.city = city;
	this.state = state;

	this.name = "";
	this.genre = "";
	this.ratings = null;


	// var collection = db.get('usercollection');
	// collection.find({},{},function(e,docs){
 //        res.render('userlist', {
 //            "userlist" : docs
 //        });
 //    });
	

}


Restaurant.prototype.someMethodHere = function() {
	// body...
};