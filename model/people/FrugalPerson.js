module.exports = FrugalPerson

var Restaurant = require("./Restaurant"),
	Attraction = require("./Attraction"),
	Hotel = require("./Hotel"),
	assert = require('assert');

function FrugalPerson(){
	this.scoreWeights = {
		"location": 0.5,
		"restMood": 0.1,
		"restPrice": 1,
		"restOverall": 1,
		"attrMood": 0.1,
		"attrPrice": 1,
		"attrOverall": 1,
		"hotelMood": 0.1,
		"hotelPrice": 1
	};
}