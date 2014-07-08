FBS.View = function(){
	var templates = {
		"searchList" : '<div class="row" data-page-id="{PAGE_ID}";>' +
							'<div class="fav"></div>' +
							'<div class="name">{NAME}</div>' +
							'<div class="category">{CATEGORY}</div>' +
						'</div>',
		"mainView" : '<div class="content-wrapper">' +
						'<div id="search-result-holder"></div>' +
					 	'<div id="detail-holder"></div>' +
					 '</div>',
		"pageDetail" : '<div class="page-wrapper">' +
							'<div id="page-name">{NAME}</div>' +
							'<img id="page-image" src="{IMAGE}"/>' +
							'<div id="page-category">{CATEGORY}</div>' +
							'<div id="page-about">{ABOUT}</div>' +
							'<div id="page-likes">{LIKES}</div>' +
							'<a id="page-link">{PAGE_LINK}</a>' +
							'<a id="page-website">{WEBSITE_LINK}</a>' +
						'</div>'
	}

	var searchHolder,
		pageHolder;

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
		this.onSelect && this.onSelect.call(this, this.pageId);
	}

	SearchListItem.prototype.favoriteHandler = function(e){
		e.stopPropagation();
		if(this.isFavorite){
			this.onUnFavorite && this.onUnFavorite.call(this, this.pageId);
			this.isFavorite = false;
			// view change
			this.viewEl.querySelector(".fav").classList.remove("is-fav");
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

	var renderSearchResults = function(data){
		var searchItem;
		searchHolder.innerHTML = "";
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

	var renderPageDetails = function(data){
		var markup = templates["pageDetail"],
			viewEl;

		markup = markup.replace("{NAME}", data.name);
		markup = markup.replace("{IMAGE}", data.image);
		markup = markup.replace("{CATEGORY}", data.category);
		markup = markup.replace("{ABOUT}", data.about);
		markup = markup.replace("{LIKES}", data.likes);
		markup = markup.replace("{PAGE_LINK}", data.link);
		markup = markup.replace("{WEBSITE_LINK}", data.website);

		viewEl = FBS.Utils.createDomNode(markup);
		pageHolder.innerHTML = "";
		pageHolder.appendChild(viewEl);
	}

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
		renderPageDetails : renderPageDetails
	}

}();