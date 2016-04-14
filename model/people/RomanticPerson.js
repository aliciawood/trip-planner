module.exports = RomanticPerson

var Restaurant = require("./Restaurant"),
	Attraction = require("./Attraction"),
	Hotel = require("./Hotel"),
	assert = require('assert');

function RomanticPerson(){
	this.scoreWeights = {
		"location": 1,
		"restMood": 1,
		"restPrice": 0.1,
		"restOverall": 1,
		"attrMood": 0.5,
		"attrPrice": 0.1,
		"attrOverall": 1,
		"hotelMood": 1,
		"hotelPrice": 0.1
	};
}