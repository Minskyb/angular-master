'use strict';

define([
	'routers/routers_2'
	],function(routers){

	var setUpRouters = function(angularModule){

		angularModule.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){

		/*
		* 路由注入
		* */
			var bindState = function(v){
				$stateProvider
				 	.state(v.route,{
				 		abstract: v.abstract || false,
				 		url:v.url,
				 		templateUrl:v.templateUrl,
				 		controller:v.controller
				 	});
			};

      /*
      * 遍历
      * @param 待遍历的数组
      * */
      function Ergodic(arr){
        var index ;
        for ( index in arr){
          if(arr[index].route) bindState(arr[index]);
          if(arr[index].submenus) Ergodic(arr[index].submenus);
        }
      }

      Ergodic(routers.route);

			/*默认路由*/
			$urlRouterProvider.otherwise(routers.route[1].url);

		}]);

	};

	var init = function(angularModule){

		setUpRouters(angularModule);

	};

	return {

		initialize:init

	};
});
