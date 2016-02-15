'use strict'

define([
	'underscore',
	'controllers/authorityManagement/roleManageController'
	],function(_,rm){

	var obj = {};

	obj = _.extend(obj,rm);

	return obj;

});
