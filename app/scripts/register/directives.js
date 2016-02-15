/**
 * Created by ASUS on 2015/8/17.
 */

'use strict'

define([
  'underscore',
  'directives/collector'
],function(_,collector){

  var initialize = function(angularModule){

    _.each(collector,function(directive,name){
      angularModule.directive(name, directive);
    });
  };

  return {
    initialize:initialize
  };
});
