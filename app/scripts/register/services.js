'use strict'

define([
	'underscore',
	'services/services'
	],function(_,services){

		var setUpService = function(angularModule){

			_.each(services,function(service,name){

				angularModule.factory(name,service);
			});
		};

		var init = function(angularModule){

      angularModule.config(function($httpProvider){
        $httpProvider.defaults.headers.post['Content-Type'] = "application/x-www-form-urlencoded;charset=UTF-8";
        //$httpProvider.defaults.headers.post['Content-Type'] = "multipart/form-data";
      });

			setUpService(angularModule);
		};

		return {

			initialize:init
		}
});
