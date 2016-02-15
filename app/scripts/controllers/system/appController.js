'use strict'

define([
  'underscore',
  'routers/routers',
  'jquery'
],function(_,routers,jquery){

	var controllerObj = {};

	controllerObj.appController = ['$scope','G',function($scope,G){

      $scope.Global ={
        currentMenu:localStorage.getItem("currentMenu") || '医生搜索',
        currentSubMenu:localStorage.getItem("currentSubMenu") || '',
        loading: false,
        messages: {
          data:{},
          config: {
            showTime: 500,
            delayTime: 2000,
            hideTime: 500
          }
        },
        confirmModal: {
          title: "",
          content: "",
          action: function () {
          }
        }
      };

      $scope.$watch(function(){return G.messages.data},function(newV,oldV){
        if(!!newV.msg && newV !== oldV){
          $scope.Global.messages.data = newV;
          G.messages.data = {};
        }
      },true);

      $scope.confirmModal = function(option){
        _.extend($scope.Global.confirmModal,option);
        jquery("#confirmModal").modal({keyboard:false});
      }

    $scope.hideConfirmModal = function(){
      $("#confirmModal").modal('hide');
    }

	}];

	return controllerObj;

});
