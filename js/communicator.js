FBS.Communicator = function(){
	var token = "CAACEdEose0cBAJpJTaHZACp0o9PdvMzUYRp9B0muJR0upWq1JhaqBYDjNkgcsO6KzlnleoXfzJ1h8ctXY8m0SMIP4F17VB1dVxDBvr3A4W2MlFrWWJOryzqBJf6sfZA1ZAHS82aNTwJ7OOlqT6Ob5mRoRo2mJZAZCJRe2olSvFYo9qHEBRZBP8697V6J0iwGgZD";
	var appCallback;

	var fireRequest = function(query){
		var queryEl = document.createElement("script");
		queryEl.src = query + "&callback=FBS.Communicator.fbCallback&access_token=" + token;
		document.head.appendChild(queryEl);

		var z = {
		  "data": [
		    {
		      "category": "Cars", 
		      "name": "Audi USA", 
		      "id": "96585976469"
		    }, 
		    {
		      "category": "Professional sports team", 
		      "name": "Audi Sport", 
		      "id": "114682131949771"
		    }, 
		    {
		      "category": "Musician/band", 
		      "name": "Audien", 
		      "id": "294749676672"
		    }, 
		    {
		      "category": "Musician/band", 
		      "name": "Audioslave", 
		      "id": "165985866829751"
		    }, 
		    {
		      "category": "Company", 
		      "category_list": [
		        {
		          "id": "2200", 
		          "name": "Company"
		        }
		      ], 
		      "name": "Audible", 
		      "id": "90486735811"
		    }, 
		    {
		      "category": "Cars", 
		      "name": "Audi R8", 
		      "id": "225986164093977"
		    }, 
		    {
		      "category": "Automobiles and parts", 
		      "name": "Audi UK", 
		      "id": "192574850777897"
		    }, 
		    {
		      "category": "Automobiles and parts", 
		      "category_list": [
		        {
		          "id": "2240", 
		          "name": "Automobiles and Parts"
		        }
		      ], 
		      "name": "•••Audi•••", 
		      "id": "215580608616645"
		    }, 
		    {
		      "category": "Company", 
		      "category_list": [
		        {
		          "id": "188620891159326", 
		          "name": "Automotive Manufacturing"
		        }
		      ], 
		      "name": "AUDI AG", 
		      "id": "462552367113314"
		    }, 
		    {
		      "category": "Cars", 
		      "name": "Audi Deutschland", 
		      "id": "96814974590"
		    }
		   ]
		}

		//fbCallback(z);
	}

	// @public
	// the api being exposed as the jsonp callback
	var fbCallback = function(response){
		appCallback.call(null, response);
	}

	var searchPages = function(searchTerm, callback){
		var query = "https://graph.facebook.com/search?q=" + searchTerm + "&type=page";
		appCallback = callback;
		fireRequest(query);
	}

	var getPageDetail = function(id, callback){
		var query = "https://graph.facebook.com/v2.0/" + id + "?";
		appCallback = callback;
		fireRequest(query);
	}

	return {
		searchPages : searchPages,
		getPageDetail : getPageDetail,
		fbCallback : fbCallback
	}
}();