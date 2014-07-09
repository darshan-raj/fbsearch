FBS.Utils = function(){
	// api to convert a string html template to dom node
	var createDomNode = function(template){
		var el = document.createElement("div");
		el.innerHTML = template;
		return el.firstChild;
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
		Store : Store
	}
}();