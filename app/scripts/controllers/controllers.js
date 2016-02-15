'use strict';

/**
 * @ngdoc function
 * @name controller:main collect controller
 * @description
 * # MainCtrl
 * Controller of the spreadApp
 */
define([
	  'underscore',
	  'controllers/system/controller',
	  'controllers/searchDoctor/searchDoctorController',
	  'controllers/authorityManagement/collector',
    'controllers/verify/collector',
    'controllers/clinic/clinicController',
    'controllers/privateDoctor/collector',
    'controllers/officialWebsite/collector'
	]
	,function(_,system,sd,am,verify,cc,pc,ow){


	var controllers = {};

	controllers = _.extend(controllers, system,sd,am,verify,cc,pc,ow);

	return controllers;
});
