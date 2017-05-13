define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){
  var storage = {
    
    get : function(key, asObject){
		var result = window.localStorage.getItem(key);
		if(result!==null){
			if(asObject){
				return JSON.parse(result);
			}
			return result;
		} else {
		    return null;    
		}
	},
    
	set : function(key, val){
		window.localStorage.setItem(key, val);
	},
	unset : function(key){
		window.localStorage.removeItem(key);
	},
	clear : function(){
		window.localStorage.clear();
	},
	
	beUrl : "/"
  };
  
  return storage;
});