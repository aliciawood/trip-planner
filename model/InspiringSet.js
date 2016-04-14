module.exports = InspiringSet

var TripPool = require("./TripPool"),
	http = require('http'),
	et = require('elementtree');
	// Evaluation = require('./Evaluation');

function InspiringSet(db, budget, mood){
	this.db = db;
	this.budget = budget;
	this.mood = mood;
	
	this.stateToTripPool = {};
	this.reviewScores = {};
	this.SOME_CONSTANT = 1000;

	// this.eval = new Evaluation();

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
	// this.eval.addInspiringSet(this);

	var curr = this;
	var collection1 = this.db.get("culturalinfo");
	var scoreToState = {}
	collection1.find({},{},function(e,docs){
		for(var i in docs){
			var currStateInfo = docs[i];
			var stateName = docs[i]['state'];
			var stateCapital = docs[i]['capital'];
			var stateScore = curr.calculateMoodScore(undefined,docs[i]['info']);
			console.log(stateName,":",stateScore);
			scoreToState[stateScore] = [stateName,stateCapital];
		}
		//sort scores
		var sorted = [];
	    for(var key in scoreToState) 
	        sorted[sorted.length] = key;
	    sorted.sort(function(a, b){return b-a});

	    //get the top three
	    //then get them from the dictionary
	    var firstState = scoreToState[sorted[0]][0];
	    var firstCapital = scoreToState[sorted[0]][1];
	    var secondState = scoreToState[sorted[1]][0];
	    var secondCapital = scoreToState[sorted[1]][1];
	    var thirdState = scoreToState[sorted[2]][0];
	    var thirdCapital = scoreToState[sorted[2]][1];
	    console.log("FIRST: ",sorted[0],":",firstState);
	    console.log("SECOND: ",sorted[1],":",secondState);
	    console.log("THIRD: ",sorted[2],":",thirdState);

	    //get the top three locations to go to
	    curr.stateToTripPool[firstState] = new TripPool(firstState,firstCapital,this);
	    curr.stateToTripPool[secondState] = new TripPool(secondState,secondCapital,this);
	    curr.stateToTripPool[thirdState] = new TripPool(thirdState,thirdCapital,this);

	});
}

InspiringSet.prototype.findOverallBestTrip = function(){
	//go through the stateToTripPool 
	var maxScore = -1;
	var bestState = "";
	for(var key in this.stateToTripPool){
		var currBestTrip = this.stateToTripPool[key].getBestTrip();
		// var currScore = currBestTrip.getFitness(weights);

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