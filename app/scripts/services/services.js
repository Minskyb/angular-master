/**
 * Created by ASUS on 2015/8/17.
 */
'use strict'

define([
  'underscore',
  'services/userService',
  'services/dataService',
  'services/utilService'
],function(_,userS,dataS,utilS){

  var obj = {};

  obj = _.extend(obj,userS,dataS,utilS);

  return obj;
});
