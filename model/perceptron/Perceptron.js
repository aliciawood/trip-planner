module.exports = Perceptron

var Restaurant = require("../Restaurant"),
	Attraction = require("../Attraction"),
	Hotel = require("../Hotel"),
	Trip = require("../Trip"),
	Evaluation = require("./Evaluation"),
	assert = require('assert');

function Perceptron(tripScores, tripOverallScore, tripWeights, peopleWeights) {
	this.tripScores = tripScores;
	this.tripOverallScore = tripOverallScore;
	this.tripWeights = tripWeights;
	this.peopleWeights = peopleWeights;
	this.learningRate = 0.1;
	this.theta = 0;
}

Perceptron.prototype.run = function() {
	var peopleTripScore = 0;
	//go through each instance to calculate the predicted class
    for (var s in this.tripScores) {
        peopleTripScore += (this.tripScores[s] * this.peopleWeights[s]);
    }
    //now check if above/below theta
    var difference = peopleTripScore - this.tripOverallScore;

    /*if (difference > theta)
        output = 1;
    else
        output = 0;*/

    //update weights
    for (var w in this.tripWeights) {
        this.tripWeights[w] += (this.learningRate * difference * this.tripScores[w]);
    }
    return this.tripWeights;
}