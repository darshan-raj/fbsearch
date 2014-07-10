// the module that communcates with the graph api of facebook using jsonp
FBS.Communicator = function(){
	var token = "CAACEdEose0cBAHotQtc1QS6ZB2YN7Niyl8AfWGcfoSKS11u25EOUvYbardvbxBE4yZB8APuvq1AWtT9BgCLQZBN2jk27PGA5B2ZA5trBa8SKtSghFyuMScKDnFGfyE612f1wAHPfC36F9aNeDNVYHjrI2XbDjpfYrbuQyO1M4qmT4B0gwfGi2fOI6tntBV8ZD";
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
