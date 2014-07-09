// the view
FBS.View = function(){
	var templates = {
		"searchList" : '<div class="row" data-page-id="{PAGE_ID}";>' +
							'<div class="fav"></div>' +
							'<div class="name">{NAME}</div>' +
							'<div class="category">{CATEGORY}</div>' +
						'</div>',
		"mainView" : '<div class="content-wrapper">' +
						'<div id="search-result-holder" data-mode="search"></div>' +
					 	'<div id="detail-holder"></div>' +
					 '</div>',
		"pageDetail" : '<div class="page-wrapper">' +
							'<div class="page-image-wrapper"><img id="page-image" src="{IMAGE}"/></div>' +
							'<div class="name" id="page-name">{NAME}</div>' +
							'<div class="category" id="page-category">{CATEGORY}</div>' +
							'<div id="page-about">{ABOUT}</div>' +
							'<div id="page-likes"><span class="label">Likes : </span>{LIKES}</div>' +
							'<div><span class="label">Page : </span><a id="page-link" href="{PAGE_LINK}" target="_blank">{PAGE_LINK}</a></div>' +
							'<div><span class="label">Website : </span><a id="page-website" href="{WEBSITE_LINK}" target="_blank">{WEBSITE_LINK}</a></div>' +
						'</div>',
		"loader" : '<div class="loader"></div>',
		"sessionExpiry" : '<div>The access token has expired</div>'
	}

	var searchHolder,
		pageHolder;

	// the class representing each list view item
	var SearchListItem = function(){
		this.data = null;
		this.pageId = null;
		this.holder = null;
		this.isFavorite = false;
		this.viewEl = null;
	}

	SearchListItem.prototype.render = function(){
		var domEl,
			markup = templates["searchList"];

		markup = markup.replace("{PAGE_ID}", this.pageId);
		markup = markup.replace("{NAME}", this.name);
		markup = markup.replace("{CATEGORY}", this.category);

		domEl = FBS.Utils.createDomNode(markup);
		this.holder.appendChild(domEl);
		this.viewEl = domEl;
		if(this.isFavorite){
			domEl.querySelector(".fav").classList.add("is-fav");
		}
		// attach events
		domEl.addEventListener("click", this.onItemSelect.bind(this));
		domEl.querySelector(".fav").addEventListener("click", this.favoriteHandler.bind(this));
	}

	SearchListItem.prototype.onItemSelect = function(e){
		var currentSelected;
		this.onSelect && this.onSelect.call(this, this.pageId);
		// view changes
		currentSelected = this.holder.querySelector(".selected");
		if(currentSelected){
			currentSelected.classList.remove("selected");
		}
		this.viewEl.classList.add("selected");
	}

	SearchListItem.prototype.favoriteHandler = function(e){
		var mode = this.holder.getAttribute("data-mode");
		e.stopPropagation();
		if(this.isFavorite){
			this.onUnFavorite && this.onUnFavorite.call(this, this.pageId);
			this.isFavorite = false;
			// view change
			this.viewEl.querySelector(".fav").classList.remove("is-fav");
			if(mode == "fav"){
				this.viewEl.parentNode.removeChild(this.viewEl);
			}
		} else{
			this.onFavorite && this.onFavorite.call(this, this.pageId);
			this.isFavorite = true;
			// view change
			this.viewEl.querySelector(".fav").classList.add("is-fav");
		}
	}

	// the event lib implementation
	var events = {};
	var on = function(event, callback){
		events[event] ? events[event].push(callback) : events[event] = [callback];
	}
	var trigger = function(event, params){
		if(events[event]){
			for(var i=0, len=events[event].length; i<len; i++){
				events[event][i].call(null, params);
			}
		}
	}

	// renders the list view
	var renderList = function(data){
		var searchItem;
		for(var i=0, len=data.length; i<len; i++){
			searchItem = new SearchListItem();
			searchItem.pageId = data[i].pageId;
			searchItem.name = data[i].name;
			searchItem.category = data[i].category;
			searchItem.isFavorite = data[i].isFavorite;
			searchItem.holder = searchHolder;
			searchItem.onSelect = function(pageId){
				trigger("pageSelect", pageId);
			};
			searchItem.onFavorite = function(pageId){
				trigger("favorite", pageId);
			};
			searchItem.onUnFavorite = function(pageId){
				trigger("unfavorite", pageId);
			};
			searchItem.render();
		}
	}

	// @public
	// api to render the search results
	var renderSearchResults = function(data){
		searchHolder.setAttribute("data-mode", "search");
		renderList(data);
	}

	// @public
	// api to render the favorites
	var renderFavorites = function(data){
		searchHolder.setAttribute("data-mode", "fav");
		renderList(data);
	}

	// @public
	// api to show the detail view of a page
	var renderPageDetails = function(data){
		var markup = templates["pageDetail"],
			viewEl;

		markup = markup.replace("{NAME}", data.name);
		markup = markup.replace("{IMAGE}", data.image);
		markup = markup.replace("{CATEGORY}", data.category);
		markup = markup.replace("{ABOUT}", data.about);
		markup = markup.replace("{LIKES}", data.likes);
		markup = markup.replace(/{PAGE_LINK}/g, data.link);
		markup = markup.replace(/{WEBSITE_LINK}/g, data.website);

		viewEl = FBS.Utils.createDomNode(markup);
		pageHolder.innerHTML = "";
		pageHolder.appendChild(viewEl);
	}

	// reset all the existing view elements
	var reset = function(){
		searchHolder.innerHTML = "";
		pageHolder.innerHTML = "";
	}

	// show the wait spinner
	var showLoader = function(){
		pageHolder.innerHTML = templates.loader;
	}

	var showError = function(type){
		if(type == "session-expiry"){
			pageHolder.innerHTML = templates["sessionExpiry"];
		}
	}

	// @public
	// init and bootstrap the view elements
	var init = function(config){
		var mainViewEl = FBS.Utils.createDomNode(templates.mainView);
		config.holder.appendChild(mainViewEl);
		searchHolder = mainViewEl.querySelector("#search-result-holder");
		pageHolder = mainViewEl.querySelector("#detail-holder");
	}

	return {
		init : init,
		on : on,
		renderSearchResults : renderSearchResults,
		renderPageDetails : renderPageDetails,
		renderFavorites : renderFavorites,
		reset : reset,
		showLoader : showLoader,
		showError : showError
	}

}();