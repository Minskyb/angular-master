/**
 * Created by ASUS on 2015/8/17.
 */
'use strict'

define([
  'underscore',
  'directives/checkboxtree',
  'directives/message',
  'directives/simpleTable'
],function(_,ct,mes,st){

  var obj = {};

  obj = _.extend(obj,ct,mes,st);

  return obj;
});
