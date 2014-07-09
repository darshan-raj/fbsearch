// the model
FBS.Model = function(){
	var RESULT_LIMIT = 50;

	var model = {
		searchResults : [],			// the search results
		favorites : [],				// list of favorites
		pages : {}					// cache the detail view of pages
	}

	// lookups for easily accessing model objects
	var favsLookup = {},
		searchResultsLookup = {};

	// check if a particular search result item is among the favorites
	var checkFavorite = function(pageId){
		if(favsLookup[pageId] || favsLookup[pageId] === 0){
			return true;
		}
	}

	// handles any response and data related errors
	var errorHandler = function(data){
		var code = data.error.code;
		if(code == "190"){
			FBS.View.showError("session-expiry");
		}
	}

	// process the search results
	var setSearchResults = function(response){
		var searchList,
			item;
		if(response.data){
			searchList = response.data.slice(0, 50);
		} else{
			//handle error
			errorHandler(response);
			return;
		}
		model.searchResults = [];
		for(var i=0, len = searchList.length; i<len; i++){
			item = searchList[i];
			model.searchResults.push({
				pageId : item.id,
				name : item.name,
				category : item.category || "",
				isFavorite : checkFavorite(item.id)
			});
			searchResultsLookup[item.id] = i;
		}
	}

	// set the detail view data of a page
	var setPageDetails = function(data){
		var id = data.id,
			dataOb = {};

		if(!data.id){
			// handle error
			errorHandler(data);
			return;
		}
		dataOb.id = data.id;
		dataOb.name = data.name;
		dataOb.category = data.category;
		dataOb.about = data.about || data.description || data.company_overview || "The details of this page is not publicly available.";
		dataOb.image = "https://graph.facebook.com/" + data.id + "/picture?type=large";
		dataOb.likes = data.likes;
		dataOb.link = data.link || "";
		dataOb.website = data.website || "";

		model.pages[id] = dataOb;
	}

	// create the list of favorited pages
	// called once during the init of the app
	var setFavorites = function(favs){
		model.favorites = favs;
		// create a hash of favs on pageIds for easy lookups
		for(var i=0, len=favs.length; i<len; i++){
			favsLookup[favs[i].pageId] = i;
		}
	}

	// set a page as a favorite
	var addFavorite = function(pageId){
		var pageIndex = searchResultsLookup[pageId],
			pageData = model.searchResults[pageIndex];
		pageData.isFavorite = true;
		model.favorites.push(pageData);
		favsLookup[pageId] = model.favorites.length-1;
		FBS.Utils.Store.set("favorites", model.favorites);		// persist to localstore
	}

	// remove a page from the favorited list
	var removeFavorite = function(pageId){
		var pageIndex = searchResultsLookup[pageId],
			favIndex = favsLookup[pageId],
			pageData = model.searchResults[pageIndex];
		if(pageData){
			pageData.isFavorite = false;
		}
		delete favsLookup[pageId];
		model.favorites.splice(favIndex, 1);
		FBS.Utils.Store.set("favorites", model.favorites);
	}

	// setter api
	var setData = function(type, data){
		switch(type){
			case "search" :
				setSearchResults(data);
			break;
			case "favorites" :
				setFavorites(data)
			break;
			case "page" :
				setPageDetails(data);
			break;
		}
	}

	// getter api
	var getData = function(type, param){
		switch(type){
			case "search" :
				return model.searchResults;
			break;
			case "favorites" :
				return model.favorites;
			break;
			case "page" :
				return model.pages[param];
			break;
		}
	}

	return {
		setData : setData,
		getData : getData,
		addFavorite : addFavorite,
		removeFavorite : removeFavorite
	}

}();