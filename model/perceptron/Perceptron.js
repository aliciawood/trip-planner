module.exports = Perceptron

function Perceptron(tripScores, tripOverallScore, tripWeights, mood, userRatings) {
	this.tripSubscores = tripScores.split(",");                      
    for(var i in this.tripSubscores)
        this.tripSubscores[i] = +this.tripSubscores[i];
	this.tripOverallScore = tripOverallScore;          
	this.tripWeights = tripWeights.split(",");                    
    for(var i in this.tripWeights)
        this.tripWeights[i] = +this.tripWeights[i];
	this.learningRate = 0.8;
	this.theta = 0;
    this.mood = mood;

    if(userRatings == undefined){
        //location, restMood, attrMood, hotelMood, price, restRating, attrRating, hotelRating,  overallRating
        this.peopleWeightsDicionary = {
            1 : [.2,.2,.2,.2,1,.2,.2,.2,.2],
            2 : [1,1,.5,1,.2,.8,.4,1,.7],
            3 : [.3,.5,1,.1,.5,.5,1,.3,.5],
            4 : [.7,.5,.7,.5,.7,.7,.8,.6,.6],
            5 : [.8,.5,1,.7,.9,.6,1,.7,.6]
        }
        
        var rand = Math.floor((Math.random() * 5) + 1);
        this.peopleWeights = this.peopleWeightsDicionary[rand];
    }
    else{
        var overallTrip = userRatings[0]*.2;
        var restaurantScore = userRatings[1]*.2;
        var attractionScore = userRatings[2]*.2;
        var hotelScore = userRatings[3]*.2;
        var priceScore = userRatings[4]*.2;
        var locationScore = userRatings[5]*.2;
        this.peopleWeights = [locationScore,restaurantScore,attractionScore,hotelScore,priceScore,restaurantScore,attractionScore,hotelScore,overallTrip];
    }
    console.log("PEOPLE WEIGHTS: ",this.peopleWeights);
    

}

Perceptron.prototype.run = function() {

    console.log("mood: ",this.mood);
    console.log("weights before: ",this.tripWeights);
    console.log("people's ratings: ",this.peopleWeights);
	var peopleTripScore = 0;
	//go through each instance to calculate the predicted class
    for (var s=0; s<this.tripSubscores.length; s++) 
        peopleTripScore += (this.tripSubscores[s] * this.peopleWeights[s]);

    //now check if above/below theta
    var difference = peopleTripScore - this.tripOverallScore;

    //update weights
    for (var w in this.tripWeights)
        this.tripWeights[w] += (this.learningRate * difference * this.tripSubscores[w]);

    globalWeights[this.mood] = this.tripWeights;
    console.log("weights after: ",this.tripWeights);
}