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

	var locationMoodScore = (this.inspiringSet.weights["location"] * this.inspiringSet.calculateMoodScore(undefined,this.culturalInfo));
	score += locationMoodScore;

	var overallCost = 0;
	var overallRating = 0;


	//restaurants score
	var restRating = 0;
	for(var r in this.restaurants){
		//individual restaurant score
		var currRestaurant = this.restaurants[r];
		var restaurantMoodScore = (this.inspiringSet.weights["restMood"] * this.inspiringSet.calculateMoodScore(currRestaurant.name, currRestaurant.reviewText));
		score += restaurantMoodScore;
		overallCost += currRestaurant.price;
		restRating += currRestaurant.rating;
	}
	overallRating += restRating;
		

	//attractions score
	var attrRating = 0;
	for(var r in this.attractions){
		//individual attractions score
		var currAttraction = this.attractions[r];
		var attractionMoodScore = this.inspiringSet.weights["attrMood"] * this.inspiringSet.calculateMoodScore(currAttraction.name,currAttraction.reviewText);
		score += attractionMoodScore;
		overallCost += currAttraction.price;
		attrRating += currAttraction.rating;
	}
	overallRating += attrRating;


	//hotel score
	
	var hotel = this.hotels[0];			//TODO change soon
	score += (this.inspiringSet.weights["hotelMood"] * this.inspiringSet.calculateMoodScore(hotel.name,hotel.reviewText));
	overallCost += (hotel.price * 4);
	var avgHotelRating = hotel.rating;
	overallRating += (hotel.rating*4);

	var budget = this.inspiringSet.budget;
	var priceScore = this.inspiringSet.weights["price"]*this.calculatePriceScore(budget, overallCost);

	var avgRating = overallRating/20;
	var avgRestRating = restRating/8;
	var avgAttrRating = attrRating/8;

	score += this.inspiringSet.weights["restRating"] * (avgRestRating/10.0);
	score += this.inspiringSet.weights["attrRating"] * (avgAttrRating/10.0); 
	score += this.inspiringSet.weights["hotelRating"] * (avgHotelRating/10.0);
	score += this.inspiringSet.weights["overallRating"] * (avgRating/10.0);
	score += priceScore;

	return score;
};

Trip.prototype.calculatePriceScore = function(budget, overallCost){
	var squaredDiff = Math.pow((budget - overallCost),2);
	var divided = squaredDiff/10000;
	var subtracted = 100 - divided;
	var dividedAgain = subtracted/100;
	return dividedAgain;

}






