/**
 * Created by ASUS on 2015/8/31.
 */

'use strict'

define([
  'underscore',
  'controllers/verify/verifyingController',
  'controllers/verify/verifiedController'
],function(_,verifying,verified){

  var obj = {};

  obj = _.extend(obj,verifying,verified);

  return obj;

});
