module.exports = AdventurePerson

var Restaurant = require("./Restaurant"),
	Attraction = require("./Attraction"),
	Hotel = require("./Hotel"),
	assert = require('assert');

function AdventurePerson(){
	this.scoreWeights = {
		"location": 1,
		"restMood": 0.5,
		"restPrice": 0.1,
		"restOverall": 1,
		"attrMood": 1,
		"attrPrice": 0.1,
		"attrOverall": 1,
		"hotelMood": 0.1,
		"hotelPrice": 0.1
	};
}