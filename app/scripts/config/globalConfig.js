'use strict'

define([],function(){

	var init = function(angularModule){

		angularModule.value('G',{});

		angularModule.run(['$location','G',function($location,Global){
			/**/
			Global.messages =  {
        data: {}
      };
		}]);

		console.log("Global config initialized !");
	};

	return {

		initialize:init

	}
});
