// the module that communcates with the graph api of facebook using jsonp
FBS.Communicator = function(){
	var token = "CAACEdEose0cBAEFhxQJdfJQLJjj3Hd06Xk4REAAHDCORMwFeTbakPxK1tWrflVkXEKtBZAwtuFhAhM7B2ZBmbkSk0ZB0vfaoCVaJJg5751xdg5awPYZCMYquka0tcIZCRK2JH6bCEznitZAjeMiJlLLv9aEt0xZBgcv3u5bODAO0sizKeUzSxNSqSqQwAmdSftlRtAvWNEWFQZDZD";
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