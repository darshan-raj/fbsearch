// the controller
var FBS = (function(){
	// render the search results
	var renderSearchResults = function(){
		var data = FBS.Model.getData("search");
		FBS.View.renderSearchResults(data);
	}

	// save a page as favorite
	var makeAsFavorite = function(pageId){
		FBS.Model.addFavorite(pageId);
	}

	// remove a favorited page
 	var removeAsFavorite = function(pageId){
 		FBS.Model.removeFavorite(pageId);
 	}

 	// fetch and show the details of a page
	var showPageDetails = function(pageId){
		// the page details is getting cached if fetched once
		if(FBS.Model.getData("page", pageId)){
			FBS.View.renderPageDetails(FBS.Model.getData("page", pageId));
		} else{
			FBS.View.showLoader();
			FBS.Communicator.getPageDetail(pageId, function(response){
				if(response){
					FBS.Model.setData("page", response);
					FBS.View.renderPageDetails(FBS.Model.getData("page", pageId));
				}
			});
		}
	}

	// @public
	// api that can be called from the target page
	var doSearch = function(term){
		FBS.Communicator.searchPages(term, function(response){
			if(response){
				FBS.Model.setData("search", response);
				renderSearchResults();
			}
		});
		FBS.View.reset();
	}

	// @public
	// shows the favorites
	var showFavorites = function(){
		FBS.View.reset();
		FBS.View.renderFavorites(FBS.Model.getData("favorites"));
	}

	// @public
	// initialize the app and related modules
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