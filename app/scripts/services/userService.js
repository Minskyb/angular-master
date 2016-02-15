'use strict'


define(['jquery','extendJquery'],function($){

	var serviceObj = {};

	//后台接口管理
	serviceObj.userService = ['$http',function($http){

		return {

      login:function(userInfo){

        var userInfo = $.JsonToFormData(userInfo);

        return $http.post("/hp/Login",userInfo);
      }
		}
	}];

	return serviceObj;

});
