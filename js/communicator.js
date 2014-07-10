// the module that communcates with the graph api of facebook using jsonp
FBS.Communicator = function(){
	var token = "CAACEdEose0cBAIt7isswblQxeHqrrwZAQt7y5Yg38ZAyTX1JREr1iTCE23glXsx3Td73UZAj8RGPB4XPcbTtZAYgUBWrxbGUB5WZCUfPi9pzgmfq8KqSrHTko2IJ8jWpHZCOf0njFje73VddaKiXbQ9PnrxZBrc5d78NwEX4qyQjWChivhCRSnagvpxAxIHI1sZD";
	var appCallback;		// the callback of the app to be called after receiving the jsonp response

	var fireRequest = function(query){
		var queryEl = document.createElement("script");
		queryEl.src = query + "&callback=FBS.Communicator.fbCallback&access_token=" + token;
		document.head.appendChild(queryEl);
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

	// set the access token. 
	// used when refreshing a token
	var setToken = function(newToken){
		token = newToken;
	}

	return {
		searchPages : searchPages,
		getPageDetail : getPageDetail,
		fbCallback : fbCallback,
		setToken : setToken
	}
}();
