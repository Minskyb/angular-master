/**
 * Created by ASUS on 2016/1/7.
 */
'use strict';

define(['underscore',
  'controllers/officialWebsite/sliderController',
  'controllers/officialWebsite/articleController',
  'controllers/officialWebsite/aboutAsController'],function(_,slider,article,aboutAs){

  var obj = {};

  obj = _.extend(obj,slider,article,aboutAs);

  return obj;

});
