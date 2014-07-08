var FBS = (function(){

	var renderSearchResults = function(){
		var data = FBS.Model.getData("search");
		FBS.View.renderSearchResults(data);
	}

	var makeAsFavorite = function(pageId){
		FBS.Model.addFavorite(pageId);
	}
 	var removeAsFavorite = function(pageId){
 		FBS.Model.removeFavorite(pageId);
 	}

	var showFavorites = function(){
		FBS.View.renderSearchResults(FBS.Model.getData("favorites"));
	}

	var showPageDetails = function(pageId){
		// the page details is getting cached if fetched once
		if(FBS.Model.getData("page", pageId)){
			FBS.View.renderPageDetails(FBS.Model.getData("page", pageId));
		} else{
			FBS.Communicator.getPageDetail(pageId, function(response){
				if(response){
					FBS.Model.setData("page", response);
					FBS.View.renderPageDetails(FBS.Model.getData("page", pageId));
				}
			});
		}
	}

	// the public api that can be called from the target page
	var doSearch = function(term){
		FBS.Communicator.searchPages(term, function(response){
			if(response){
				FBS.Model.setData("search", response);
				renderSearchResults();
			}
		});
	}

	var init = function(config){
		var favorites;

		// initialize the view
		FBS.View.init({
			holder : config.holder
		});

		// load the already existing favorite list
		favorites = FBS.Utils.Store.get("favorites") || [];
		FBS.Model.setData("favorites", favorites);

		// attach events
		FBS.View.on("pageSelect", showPageDetails);
		FBS.View.on("favorite", makeAsFavorite);
		FBS.View.on("unfavorite", removeAsFavorite);
	}

	return {
		init : init,
		doSearch : doSearch,
		showFavorites : showFavorites
	}
})();	