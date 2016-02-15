/**
 * Created by ASUS on 2015/11/18.
 */
'use strict';

define([
  'underscore',
  'controllers/privateDoctor/waitVerifyController',
  'controllers/privateDoctor/doctorTeamController',
  'controllers/privateDoctor/addArchiveController',
  'controllers/privateDoctor/queryArchiveController'
],function(_,wv,dc,ac,qa){

  var obj = {};

  obj = _.extend(obj,wv,dc,ac,qa);

  return obj;

});
