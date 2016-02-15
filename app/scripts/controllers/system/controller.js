/**
 * Created by ASUS on 2015/8/11.
 * @name controller: login collect controller
 * @description
 * collect all login controller
 */

'use strict'

define([
   'underscore',
    'controllers/system/appController',
   'controllers/system/loginController',
  'controllers/system/mainLayoutController',
  'controllers/system/leftMenuController']
   ,function(_,app,login,mainLayout,leftMenu){

    var controllers ={};

    controllers = _.extend(controllers,app,login,mainLayout,leftMenu);
    return controllers;

});
