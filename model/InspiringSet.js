module.exports = InspiringSet

var TripPool = require("./TripPool"),
	http = require('http'),
	et = require('elementtree');
	// Evaluation = require('./Evaluation');

function InspiringSet(db, budget, mood, res){
	this.db = db;
	this.budget = budget;
	this.mood = mood;
	this.res = res;
	
	this.stateToTripPool = {};
	this.reviewScores = {};
	this.SOME_CONSTANT = 1000;

	this.tripPoolsCompleted = 0;

	if(this.mood == "adventurous")
		this.weights = globalWeights["adventurous"];
	else if(this.mood == "relaxing")
		this.weights = globalWeights["relaxing"];
	else if(this.mood == "romantic")
		this.weights = globalWeights["romantic"];
	else
		this.weights = globalWeights["happy"];

	//get synonyms for mood - store in this
	this.getRelatedWordsForMood();    
}

InspiringSet.prototype.getRelatedWordsForMood = function(){
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

InspiringSet.prototype.parseXML = function(xml){
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
	this.generateTopThreeLocations();
}

InspiringSet.prototype.generateTopThreeLocations = function(){

	var curr = this;
	var collection1 = this.db.get("culturalinfo");
	var scoreToState = {}
	collection1.find({},{},function(e,docs){
		for(var i in docs){
			var currStateInfo = docs[i];
			var stateName = docs[i]['state'];
			var stateCapital = docs[i]['capital'];
			var culturalInfo = docs[i]['info'];
			var stateScore = curr.calculateMoodScore(undefined,culturalInfo);
			scoreToState[stateScore] = [stateName,stateCapital,culturalInfo];
		}
		//sort scores
		var sorted = [];
	    for(var key in scoreToState) 
	        sorted[sorted.length] = key;
	    sorted.sort(function(a, b){return b-a});

	    var rand1 = Math.floor((Math.random() * sorted.length) + 2);
	    var rand2 = Math.floor((Math.random() * sorted.length) + 2);
	    //get the top three
	    //then get them from the dictionary
	    var thirdState = scoreToState[sorted[0]][0];
	    var thirdCapital = scoreToState[sorted[0]][1];
	    var thirdCulturalInfo = scoreToState[sorted[0]][2];
	    var fourthState = scoreToState[sorted[1]][0];
	    var fourthCapital = scoreToState[sorted[1]][1];
	    var fourthCulturalInfo = scoreToState[sorted[1]][2];

	    var firstState = scoreToState[sorted[rand1]][0];
	    var firstCapital = scoreToState[sorted[rand1]][1];
	    var firstCulturalInfo = scoreToState[sorted[rand1]][2];
	    var secondState = scoreToState[sorted[rand2]][0];
	    var secondCapital = scoreToState[sorted[rand2]][1];
	    var secondCulturalInfo = scoreToState[sorted[rand2]][2];
	    console.log("FIRST: ",sorted[rand1],":",firstState);
	    console.log("SECOND: ",sorted[rand2],":",secondState);
	    console.log("THIRD: ",sorted[0],":",thirdState);
	    console.log("FOURTH: ",sorted[1],":",fourthState);

	    //get the top three locations to go to
	    curr.stateToTripPool[firstState] = new TripPool(firstState,firstCapital,firstCulturalInfo,curr);
	    curr.stateToTripPool[secondState] = new TripPool(secondState,secondCapital,secondCulturalInfo,curr);
	    curr.stateToTripPool[thirdState] = new TripPool(thirdState,thirdCapital,thirdCulturalInfo,curr);
	    curr.stateToTripPool[fourthState] = new TripPool(fourthState,fourthCapital,fourthCulturalInfo,curr);

	});
}

InspiringSet.prototype.findOverallBestTrip = function(){
	this.tripPoolsCompleted++;
	if(this.tripPoolsCompleted == 4){
		console.log("FIND BEST ONE!");
		this.tripPoolsCompleted = 0;
		//go through the stateToTripPool 
		var maxScore = -1;
		var bestTrip = null;
		for(var key in this.stateToTripPool){
			var currBestTrip = this.stateToTripPool[key].getBestTrip();
			console.log("STATE: ",currBestTrip.state);
			var currScore = currBestTrip.getFitness();
			console.log("SCORE: ",currScore);
			if(currScore > maxScore){
				maxScore = currScore;
				bestTrip = currBestTrip;
			}

		}
		console.log("BEST TRIP!",bestTrip.state);
		console.log("BEST TRIP! location",bestTrip.lat);
		console.log("BEST TRIP! location",bestTrip.long);
		
		this.res.render('tripoutput', {
	        "restaurantlist" : bestTrip.restaurants,
	        "hotellist": bestTrip.hotels,
	        "attractionlist": bestTrip.attractions,
	        "city":bestTrip.city,
	        "state":bestTrip.state,
	        "money":this.budget,
	        "mood":this.mood,
	        "bestTrip":bestTrip,
	        "weights":this.weights,
	        "latitude":bestTrip.lat,
	        "longitude":bestTrip.long
	    });
	}
}

InspiringSet.prototype.calculateMoodScore = function(name, text){
	if(text==undefined)
		return 0;
	if(name!=undefined)
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