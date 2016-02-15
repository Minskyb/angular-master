'use strict';

define([
  'underscore',
  'routers/routers'
],function(_,routers){

  var setUpRouters = function(angularModule){

    angularModule.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){

      /*注入路由*/
      var bindState = function(v){
        $stateProvider
          .state(v.route,{
            abstract: v.abstract || false,
            url:v.url,
            templateUrl:v.templateUrl,
            controller:v.controller
          });
      }

      /*遍历绑定路由*/
      _.each(routers, function(val, index) {

        if(val.route)
          bindState(val);

        /*子路由*/
        if (val.menus) {

          _.each(val.menus, function(v, i) {
            if(v.route)
              bindState(v);
            else{
              _.each(v.child,function(vv,ii){
                if(vv.route){
                  bindState(vv);
                }
              });
            }
          });
        };
      });

      /*默认路由*/
      $urlRouterProvider.otherwise(routers.login.url);

    }]);

  };

  var init = function(angularModule){

    setUpRouters(angularModule);

  };

  return {

    initialize:init

  };
});
