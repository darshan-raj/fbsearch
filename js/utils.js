// all utils
FBS.Utils = function(){
	// api to convert a string html template to dom node
	var createDomNode = function(template){
		var el = document.createElement("div");
		el.innerHTML = template;
		return el.firstChild;
	}

	// util to read a url param
	var extractParamFromUrl = function(url, name){
		var queryString = url.split("?");
		if(queryString.length>1){
			var params = queryString[1].split("&");
			for(i=0;i<params.length;i++){
				param_item = params[i].split("=");
				if(param_item[0]==name)
					return decodeURIComponent(param_item[1]);
			}
		}
	}

	// the local storage library
	var Store = function(){
		var ls = window.localStorage;

		var get = function(id){
			try {
				return JSON.parse(ls.getItem(id));
			}catch(e){
				return {};
			}
		}

		var set = function(id, value){
			try {
				ls.setItem(id, JSON.stringify(value));
			} catch(e){

			}
		}
		return {
			get : get,
			set : set
		}
	}();

	return {
		createDomNode : createDomNode,
		extractParamFromUrl : extractParamFromUrl,
		Store : Store
	}
}();