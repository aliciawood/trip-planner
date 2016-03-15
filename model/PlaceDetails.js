module.exports = PlaceDetails

var assert = require("assert");

function PlaceDetails(){
}


PlaceDetails.prototype.getReviewsText = function(placeId, synonyms, relatedWords, antonyms, denom) {
  var PlaceDetailsRequest = require("../node_modules/googleplaces/lib/PlaceDetailsRequest.js");
  var config = require("../config.js");

  var placeDetailsRequest = new PlaceDetailsRequest(config.apiKey, config.outputFormat);
  var reviewText = "";
  var self = this;

	placeDetailsRequest({placeid: placeId}, function (error, response) {
      if (error) throw error;
      assert.equal(response.status, "OK", "Place details request response status is OK");

      var reviews = response.result.reviews;
      var rating = response.result.rating;
      for(var r in reviews){
      	var currReview = reviews[r];
      	console.log("TEXT: ",currReview.text);
      	reviewText += currReview.text;
      }
      console.log("FINISHED!");
      return self.calculateScore(reviewText, synonyms, relatedWords, antonyms, denom);
      
  });
}



PlaceDetails.prototype.calculateScore = function(reviews, synonyms, relatedWords, antonyms, denom){
	var synonymPoints = 10;
	var relatedWordPoints = 5;
	var antonymsPoints = -5;
	var SOME_CONSTANT = 1000.0;

	var sCount = 0;
	var rwCount = 0;
	var aCount = 0;

	for(var s in synonyms){
		var syn = synonyms[s];
		if(syn.length > 0){
			var re = new RegExp(syn, 'g');
			sCount += (reviews.match(re) || []).length;
		}
	}

	for(var r in relatedWords){
		var rel = relatedWords[r];
		if(rel.length > 0){
			var re = new RegExp(rel, 'g');
			rwCount += (reviews.match(re) || []).length;
		}
	}

	for(var a in antonyms){
		var ant = antonyms[a];
		if(ant.length > 0){
			var re = new RegExp(ant, 'g');
			aCount += (reviews.match(re) || []).length;
		}
	}
	console.log("sCount: ",sCount);
	console.log("rwCount: ",rwCount);
	console.log("aCount: ",aCount);
	console.log("mood score: ",((sCount*synonymPoints) + (rwCount*relatedWordPoints) + (aCount*antonymsPoints))/denom);
	return ((sCount*synonymPoints) + (rwCount*relatedWordPoints) + (aCount*antonymsPoints))/denom;
}
