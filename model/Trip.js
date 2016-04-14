module.exports = Trip

function Trip(state, city, culturalInfo, inspiringSet){
	this.state = state;
	this.city = city;
	this.culturalInfo = culturalInfo;
	this.inspiringSet = inspiringSet;
	this.restaurants = [];
	this.hotels = [];
	this.attractions = [];
}

Trip.prototype.getFitness = function() {
	var score = 0;
	//location fitting mood score

	var locationMoodScore = (this.inspiringSet.weights["location"] * this.inspiringSet.calculateMoodScore(undefined,this.culturalInfo));
	score += locationMoodScore;

	//restaurants score
	for(var r in this.restaurants){
		//individual restaurant score
		var currRestaurant = this.restaurants[r];
		var restaurantMoodScore = (this.inspiringSet.weights["restMood"] * this.inspiringSet.calculateMoodScore(currRestaurant.name, currRestaurant.reviewText));
		// console.log(currRestaurant.name,":",restaurantMoodScore);
		this.score += restaurantMoodScore;
		// 	var someMoney = 10;
		// 	score += (this.scoreWeights["restPrice"] * currRestaurant.getPriceScore(someMoney));
	}

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


	return score;
};
