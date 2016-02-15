'use strict';

define([
	'ngTranslateloader'
	],function(){

	var init = function(angularModule){

		angularModule.config(['$translateProvider',function($translateProvider) {
			
			$translateProvider.useStaticFilesLoader({

				prefix:'/scripts/config/i18n/languages/',
				suffix:'.json'
			});

			var languageKey = localStorage.getItem("language") || "zh_CN";
			$translateProvider.preferredLanguage(languageKey);
			
		}]);
	};


	return {

		initialize:init
	}



})