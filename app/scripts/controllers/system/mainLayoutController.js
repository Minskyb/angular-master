'use strict'

define([],function(){

	var controllerObj = {} ;

	controllerObj.mainLayoutController = ['$scope','$state',function($scope,$state){

    $scope.Global.userinfo =  $scope.Global.userinfo ? $scope.Global.userinfo:JSON.parse(sessionStorage.getItem("Global.userinfo"));

    $scope.backToLogin = function(){
      $state.go("system.login");
    };

    $scope.showMessage = function(){
      $scope.Global.messages.data ={msg:"无新的消息",type:"primary"};
    }

	}];

	return controllerObj;
});
