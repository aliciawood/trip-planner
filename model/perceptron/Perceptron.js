module.exports = Perceptron

function Perceptron(tripScores, tripOverallScore, tripWeights, mood) {
	this.tripSubscores = tripScores.split(",");                      //array
    for(var i in this.tripSubscores)
        this.tripSubscores[i] = +this.tripSubscores[i];
	this.tripOverallScore = tripOverallScore;          //double
	this.tripWeights = tripWeights.split(",");                    //array
    for(var i in this.tripWeights)
        this.tripWeights[i] = +this.tripWeights[i];
	this.learningRate = 0.5;
	this.theta = 0;
    this.mood = mood;

    //location
    //restMood
    //attrMood
    //hotelMood
    //price
    //restRating
    //attrRating
    //hotelRating
    //overallRating

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

Perceptron.prototype.run = function() {

    console.log("mood: ",this.mood);
    console.log("weights before: ",this.tripWeights);
    console.log("people weights: ",this.peopleWeights);
    console.log("tripSubscores: ",this.tripSubscores);
	var peopleTripScore = 0;
	//go through each instance to calculate the predicted class
    for (var s=0; s<this.tripSubscores.length; s++) {
        peopleTripScore += (this.tripSubscores[s] * this.peopleWeights[s]);
    }
    //now check if above/below theta
    console.log("peopleTripScore: ",peopleTripScore);
    var difference = peopleTripScore - this.tripOverallScore;
    console.log("difference: ",difference);

    /*if (difference > theta)
        output = 1;
    else
        output = 0;*/

    //update weights
    for (var w in this.tripWeights) {
        this.tripWeights[w] += (this.learningRate * difference * this.tripSubscores[w]);
    }

    globalWeights[this.mood] = this.tripWeights;
    console.log("weights after: ",this.tripWeights);
    console.log("globalWeights: ",globalWeights[this.mood]);
}