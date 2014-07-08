FBS.Model = function(){
	var RESULT_LIMIT = 50;

	var model = {
		searchResults : [],
		favorites : [],
		pages : {}
	}
	var favsLookup = {},
		searchResultsLookup = {};

	var checkFavorite = function(pageId){
		if(favsLookup[pageId] || favsLookup[pageId] === 0){
			return true;
		}
	}

	var setSearchResults = function(response){
		var searchList,
			item;
		if(response.data){
			searchList = response.data.slice(0, 50);
		} else{
			//handle error
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

	var setPageDetails = function(data){
		var id = data.id,
			dataOb = {};

		if(!data.id){
			// handle error
			return;
		}
		dataOb.id = data.id;
		dataOb.name = data.name;
		dataOb.category = data.category;
		dataOb.about = data.about || "This information is not public for this particular page";
		dataOb.image = "https://graph.facebook.com/" + data.id + "/picture?type=large";
		dataOb.likes = data.likes;
		dataOb.link = data.link;
		dataOb.website = data.website;

		model.pages[id] = dataOb;
	}

	var setFavorites = function(favs){
		model.favorites = favs;
		// create a hash of favs on pageIds for easy lookups
		for(var i=0, len=favs.length; i<len; i++){
			favsLookup[favs[i].pageId] = i;
		}
	}

	var addFavorite = function(pageId){
		var pageIndex = searchResultsLookup[pageId],
			pageData = model.searchResults[pageIndex];
		pageData.isFavorite = true;
		model.favorites.push(pageData);
		FBS.Utils.Store.set("favorites", model.favorites);
	}

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