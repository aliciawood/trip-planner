module.exports = Trip

function Trip(state, city){
	// this.budget = budget;
	// this.mood = mood;
	
	this.state = state;
	this.city = city;
	this.restaurants = [];
	this.hotels = [];
	this.attractions = [];
    
}

Trip.prototype.getFitness = function() {
	
};

Trip.prototype.calculateScore = function(weights){
	this.score = 0;
	//location fitting mood score
	// var locationMoodScore = (this.scoreWeights["location"] * this.calculateMoodScore(undefined,this.trip.culturalinfo));
	// this.score += locationMoodScore;

	// //restaurants score
	// for(var r in this.trip.restaurants){
	// 	//individual restaurant score
	// 	var currRestaurant = this.trip.restaurants[r];
	// 	var restaurantMoodScore = (this.scoreWeights["restMood"] * this.calculateMoodScore(currRestaurant.name, currRestaurant.reviewText));
	// 	this.score += restaurantMoodScore;
	// // 	// score += (this.scoreWeights["restMood"] * currRestaurant.getMoodScore(this.mood, this.synonyms, this.relatedWords, this.antonyms, this.SOME_CONSTANT));
	// // 	var someMoney = 10;
	// // 	score += (this.scoreWeights["restPrice"] * currRestaurant.getPriceScore(someMoney));
	// }

	// // score += (this.scoreWeights["restOverall"] * this.calculateRestaurantsScore());
	
		

	// //attractions score
	// for(var r in this.trip.attractions){
	// 	//individual attractions score
	// 	var currAttraction = this.trip.attractions[r];
	// 	var attractionMoodScore = this.scoreWeights["attrMood"] * this.calculateMoodScore(currAttraction.name,currAttraction.reviewText);
	// 	this.score += attractionMoodScore;
	// // 	var someMoney = 10;
	// 	// score += (this.scoreWeights["attrPrice"] * currAttraction.getPriceScore(someMoney));
	// }

	// // score += (this.scoreWeights["attrOverall"] * this.calculateAttractionsScore());


	// //hotel score
	// var hotel = this.trip.hotels[0];			//TODO change soon
	// this.score += (this.scoreWeights["hotelMood"] * this.calculateMoodScore(hotel.name,hotel.reviewText));

	// var somePrice = 20;
	// score += (this.scoreWeights["hotelPrice"] * hotel.getPriceScore(somePrice));


	return this.score;
};
