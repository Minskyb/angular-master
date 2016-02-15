'use strict';

/**
 * @ngdoc overview
 * @name spreadApp
 * @description
 * # spreadApp
 *
 * Main module of the application.
 */
define([
  'angular',
  'config/globalConfig',
  'register/controllers',
  //'register/routers',
  'register/routers',
  'register/services',
  'register/directives',
  //'config/i18n/i18n',
  //'uiBootstraptpls',
  'uiRoute',
  'bootstrap',
  'ngAnimate'
  //'ngCookies',
  //'ngMessages',
  //'ngResource',
  //'ngSanitize',
  //'ngTranslate'

  ],function(angular,globalConfig,controllers,routers,services,directives){

  var initialize = function (){

    var app = angular.module('spreadApp',['ui.router',
                                          //'ui.bootstrap',
                                          'ngAnimate',
                                          //'ngCookies',
                                          //'ngMessages',
                                          //'ngResource',
                                          //'ngSanitize',
                                          //'pascalprecht.translate'
                                           ]
    );

    /*全局变量*/
    globalConfig.initialize(app);
    /*注入控制器*/
    controllers.initialize(app) ;
    /*注入路由*/
    routers.initialize(app);
    /*服务注入*/
    services.initialize(app);
    /*指令注入*/
    directives.initialize(app);
    /*多语言注入*/
    //i18n.initialize(app);

    /*启动 angularModule*/
    angular.bootstrap(window.document, ["spreadApp"]);

  };

  return {
    initialize:initialize
  }

});

