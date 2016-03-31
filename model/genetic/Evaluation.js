module.exports = Evaluation

var http = require('http');
var et = require('elementtree');
// var PlaceDetails = require('../PlaceDetails');

function Evaluation(currTrip){
	console.log("creating a new evaluation!");
	this.trip = currTrip;
	console.log("currTrip State: ",this.trip.state)
	this.budget = currTrip.budget;
	this.mood = currTrip.mood;
	this.db = currTrip.db;
	this.synonyms = [];
	this.relatedWords = [];
	this.antonyms = [];
	this.reviewScores = {};

	this.SOME_CONSTANT = 1000.0;

	this.scoreWeights = {
		"location": 1,
		"restMood": 1,
		"restPrice": 1,
		"restOverall": 1,
		"attrMood": 1,
		"attrPrice": 1,
		"attrOverall": 1,
		"hotelMood": 1,
		"hotelPrice": 1
	};

	var curr = this;
	callback = function(response) {
	  var str = '';
	  response.on('data', function (chunk) {
	    str += chunk;
	  });
	  response.on('end', function () {
	    curr.parseXML(str);
	  });
	}
	http.get("http://www.dictionaryapi.com/api/v1/references/thesaurus/xml/"+this.mood+"?key=4273db84-5343-4dc4-aae2-ed3b1b497d63", callback)
}


Evaluation.prototype.parseXML = function(xml){
	var etree = et.parse(xml);
	var synonymsExtracted = etree.findall('./entry/sens/syn');
	for(var s in synonymsExtracted){
		var currSynonym = synonymsExtracted[s];
		var children = currSynonym["_children"];
		this.synonyms += currSynonym["text"]+" ";
		if(children.length !=0 )
			this.synonyms += children[0]["tail"];
	}

	this.synonyms = this.synonyms.replace(/[\])}[{(]/g, '');
	this.synonyms = this.synonyms.split(/[ ,]+/);


	var relatedWordsExtracted = etree.findall('./entry/sens/rel');
	for(var s in relatedWordsExtracted){
		var currRelatedWord = relatedWordsExtracted[s];
		var children = currRelatedWord["_children"];
		this.relatedWords += currRelatedWord["text"]+" ";
		if(children.length !=0 )
			this.relatedWords += children[0]["tail"];
	}

	this.relatedWords = this.relatedWords.replace(/[\])}[{(]/g, '');
	this.relatedWords = this.relatedWords.split(/[ ,]+/);
	


	var antonymsExtracted = etree.findall('./entry/sens/ant');
	for(var s in antonymsExtracted){
		var currAntonym = antonymsExtracted[s];
		var children = currAntonym["_children"];
		this.antonyms += currAntonym["text"]+" ";
		if(children.length !=0 )
			this.antonyms += children[0]["tail"];
	}

	this.antonyms = this.antonyms.replace(/[\])}[{(]/g, '');
	this.antonyms = this.antonyms.split(/[ ,]+/);


	var curr = this;
	var collection1 = this.db.get("culturalinfo");
	console.log("STATE: ",this.trip.state);
    collection1.find({"state":this.trip.state},{},function(e,docs){
    	// console.log("DOCS: ",docs);
    	// console.log("E: ",e);
    	curr.culturalinfo = docs[0]["info"];
    	curr.trip.generateTrip();
    	// curr.calculateScore(culturalinfo);
    });

}



Evaluation.prototype.calculateScore = function(){
	this.score = 0;
	//location fitting mood score
	var locationMoodScore = (this.scoreWeights["location"] * this.calculateMoodScore(this.culturalinfo));
	this.score += locationMoodScore;

	//restaurants score
	for(var r in this.trip.restaurants){
		//individual restaurant score
		var currRestaurant = this.trip.restaurants[r];
		var restaurantMoodScore = (this.scoreWeights["restMood"] * this.calculateMoodScore(currRestaurant.name, currRestaurant.reviewText));
		this.score += restaurantMoodScore;
	// 	// score += (this.scoreWeights["restMood"] * currRestaurant.getMoodScore(this.mood, this.synonyms, this.relatedWords, this.antonyms, this.SOME_CONSTANT));
	// 	var someMoney = 10;
	// 	score += (this.scoreWeights["restPrice"] * currRestaurant.getPriceScore(someMoney));
	}

	// score += (this.scoreWeights["restOverall"] * this.calculateRestaurantsScore());
	
		

	//attractions score
	for(var r in this.trip.attractions){
		//individual attractions score
		var currAttraction = this.trip.attractions[r];
		var attractionMoodScore = this.scoreWeights["attrMood"] * this.calculateMoodScore(currAttraction.name,currAttraction.reviewText);
		this.score += attractionMoodScore;
	// 	var someMoney = 10;
		// score += (this.scoreWeights["attrPrice"] * currAttraction.getPriceScore(someMoney));
	}

	// score += (this.scoreWeights["attrOverall"] * this.calculateAttractionsScore());


	//hotel score
	var hotel = this.trip.hotels[0];			//TODO change soon
	this.score += (this.scoreWeights["hotelMood"] * this.calculateMoodScore(hotel.name,hotel.reviewText));

	// var somePrice = 20;
	// score += (this.scoreWeights["hotelPrice"] * hotel.getPriceScore(somePrice));


	return this.score;
};

Evaluation.prototype.calculateMoodScore = function(name, text){
	if(text==undefined)
		return 0;
	
	if(name in this.reviewScores)
		return this.reviewScores[name];

	var synonymPoints = 10;
	var relatedWordPoints = 5;
	var antonymsPoints = -5;

	var sCount = 0;
	var rwCount = 0;
	var aCount = 0;

	for(var s in this.synonyms){
		var syn = this.synonyms[s];
		if(syn.length > 0){
			var re = new RegExp(syn, 'g');
			sCount += (text.match(re) || []).length;
		}
	}

	for(var r in this.relatedWords){
		var rel = this.relatedWords[r];
		if(rel.length > 0){
			var re = new RegExp(rel, 'g');
			rwCount += (text.match(re) || []).length;
		}
	}

	for(var a in this.antonyms){
		var ant = this.antonyms[a];
		if(ant.length > 0){
			var re = new RegExp(ant, 'g');
			aCount += (text.match(re) || []).length;
		}
	}
	var moodScore = ((sCount*synonymPoints) + (rwCount*relatedWordPoints) + (aCount*antonymsPoints))/this.SOME_CONSTANT;

	this.reviewScores[name] = moodScore;

	return moodScore;
}

Evaluation.prototype.calculateRestaurantsScore = function(){
	console.log("calculate the overall restaurant score!");
	return 0;
}

Evaluation.prototype.calculateAttractionsScore = function(){
	console.log("calculate the overall attractions score!");
	return 0;
}


Evaluation.prototype.updateWeights = function(newWeights){
	///this will eventually update the weights of differents parts of the fitness function
};
