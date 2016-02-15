'use strict'

define([
	'underscore',
	'controllers/controllers'
	],function(_,controllers){

	var initialize = function(angularModule){

		/*注入控制器*/
		_.each(controllers,function(controller,name){
			angularModule.controller(name,controller);
		})
	};

	return {
		initialize:initialize
	}
});