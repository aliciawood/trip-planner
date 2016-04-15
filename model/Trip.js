module.exports = Trip

function Trip(state, city, culturalInfo, inspiringSet){
	this.state = state;
	this.city = city;
	this.culturalInfo = culturalInfo;
	this.inspiringSet = inspiringSet;
	this.restaurants = [];
	this.hotels = [];
	this.attractions = [];
	this.subscores = [];
	this.overallScore = -1;
}

Trip.prototype.getFitness = function() {
	var score = 0;
	var overallCost = 0;
	var overallRating = 0;

	var locationMoodSubScore = this.inspiringSet.calculateMoodScore(undefined,this.culturalInfo);
	var locationMoodScore = (this.inspiringSet.weights["location"] * locationMoodSubScore);
	this.subscores.push(locationMoodSubScore);
	score += locationMoodScore;

	

	//restaurants score
	var restRating = 0;
	var restaurantSubscore = 0;
	for(var r in this.restaurants){
		//individual restaurant score
		var currRestaurant = this.restaurants[r];
		restaurantSubscore += this.inspiringSet.calculateMoodScore(currRestaurant.name, currRestaurant.reviewText)
		overallCost += currRestaurant.price;
		restRating += currRestaurant.rating;
	}

	var restaurantMoodScore = (this.inspiringSet.weights["restMood"] * restaurantSubscore);
	this.subscores.push(restaurantSubscore);
	score += restaurantMoodScore;
	overallRating += restRating;
		

	//attractions score
	var attrRating = 0;
	var attractionSubscore = 0;
	for(var r in this.attractions){
		//individual attractions score
		var currAttraction = this.attractions[r];
		attractionSubscore += this.inspiringSet.calculateMoodScore(currAttraction.name,currAttraction.reviewText);
		overallCost += currAttraction.price;
		attrRating += currAttraction.rating;
	}
	var attractionMoodScore = this.inspiringSet.weights["attrMood"] * attractionSubscore;
	this.subscores.push(attractionSubscore);
	score += attractionMoodScore;

	overallRating += attrRating;


	//hotel score
	
	var hotel = this.hotels[0];			//TODO change soon
	var hotelSubscore = this.inspiringSet.calculateMoodScore(hotel.name,hotel.reviewText);
	score += (this.inspiringSet.weights["hotelMood"] * hotelSubscore);
	this.subscores.push(hotelSubscore);
	overallCost += (hotel.price * 4);
	var avgHotelRating = hotel.rating;
	overallRating += (hotel.rating*4);

	var budget = this.inspiringSet.budget;
	var priceSubscore = this.calculatePriceScore(budget, overallCost);
	var priceScore = this.inspiringSet.weights["price"]* priceSubscore;
	score += priceScore;
	this.subscores.push(priceSubscore);

	var avgRating = overallRating/20;
	var avgRestRating = restRating/8;
	var avgAttrRating = attrRating/8;


	score += this.inspiringSet.weights["restRating"] * (avgRestRating/10.0);
	this.subscores.push((avgRestRating/10.0));
	score += this.inspiringSet.weights["attrRating"] * (avgAttrRating/10.0); 
	this.subscores.push((avgAttrRating/10.0));
	score += this.inspiringSet.weights["hotelRating"] * (avgHotelRating/10.0);
	this.subscores.push((avgHotelRating/10.0));
	score += this.inspiringSet.weights["overallRating"] * (avgRating/10.0);
	this.subscores.push((avgRating/10.0));

	this.overallScore = score;
	return score;
};

Trip.prototype.calculatePriceScore = function(budget, overallCost){
	var squaredDiff = Math.pow((budget - overallCost),2);
	var divided = squaredDiff/10000;
	var subtracted = 100 - divided;
	var dividedAgain = subtracted/100;
	return dividedAgain;

}






