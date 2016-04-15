module.exports = AdventurePerson

var Restaurant = require("./Restaurant"),
	Attraction = require("./Attraction"),
	Hotel = require("./Hotel"),
	assert = require('assert');

function AdventurePerson(){
	this.scoreWeights = {
		"location": 1,
		"restMood": 0.5,
		"attrMood": 1,
		"hotelMood": 0.1,

		"location": 1,
		"restMood":1,
		"attrMood":1,
		"hotelMood":1,

		"price":1,
		
		"restRating":1,
		"attrRating":1,
		"hotelRating":1,
		"overallRating":1
	};
}