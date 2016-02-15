/**
 * Created by ASUS on 2016/1/7.
 */
'use strict';

define(['jquery','extendJquery'],function(jQuery){

  var obj = {};

  obj.sliderController = ['$scope','dataService',function($scope,dataService){

    $scope.status = {
      PRODUCT_IMG_MAX_COUNT:3,
      CURRENT_PRODUCT_IMG_COUNT:0
    }

    $scope.products = [];
    $scope.sliders = [];

    $scope.query = function(type){

      dataService.getImg($scope,{type:type})
        .success(function(data){
          $scope.Global.loading = false;
          if(data.code && data.code == 10061){
            if(type == 1)
              $scope.sliders = data.piclist;
            else if (type == 2){
              $scope.products = data.piclist;
              $scope.status.CURRENT_PRODUCT_IMG_COUNT = $scope.products.length;
            }

          }
          else if(data.code && data.code != 10061){
            $scope.Global.messages.data = {msg:data.msg,type:'danger'};
          }
          else{
            $scope.Global.messages.data = {msg:"返回数据错误~",type:"danger"};
          }
        })
        .error(errorHandler)
    }

    $scope.query(1);
    $scope.query(2);

    $scope.deleteSlider = function(obj){

      dataService.deleteImg($scope,{id:obj.id})
        .success(function(data){
          $scope.Global.loading = false;
          if(data.code && data.code == 10062){
            $scope.query(obj.type);
          }
          else if(data.code && data.code != 10062){
            $scope.Global.messages.data = {msg:data.msg,type:'danger'};
          }
          else{
            $scope.Global.messages.data = {msg:'返回数据错误~',type:'danger'};
          }

        })
        .error(errorHandler)
    }

    $scope.addSlider = function(event,imgType){

      if( imgType == 2 && $scope.status.CURRENT_PRODUCT_IMG_COUNT == $scope.status.PRODUCT_IMG_MAX_COUNT){
        $scope.$apply(function(){
          $scope.Global.messages.data = {msg:"图片数量已达上限，无法添加！",type:'danger'};
        });
        return ;
      }

      var formData = new FormData();
      formData.append("img",event.target.files[0]);
      formData.append("type",imgType);

      jQuery.ajax({
        url:jQuery.vhost+dataService.uploadImg(),
        type:"post",
        data:formData,
        processData : false,
        contentType: false,
        beforeSend:function(){
          $scope.$apply(function(){
            $scope.Global.loading = true;
          });
        },
        success:function(data){

          $scope.$apply(function(){
            $scope.Global.loading = false;
          });

          if(data.code && data.code==10058){
            $scope.$apply(function(){
              $scope.query(imgType);
              $scope.Global.messages.data={msg:data.msg,type:'primary'};
            });
          }
          else if(data.code && data.code !=10058){
            $scope.$apply(function(){
              $scope.Global.messages.data={msg:data.msg,type:'danger'};
            });
          }
          else {
            $scope.$apply(function(){
              $scope.Global.messages.data={msg:'返回数据错误~',type:'danger'};
            });

            return ;
          }
        },
        error:errorHandler
      })
    }

    $scope.newSort = function(obj,direciton){

      var param = {
        id:obj.id,
        type:direciton,
        img_type:obj.type
      }

      dataService.setNewSort($scope,param)
        .success(function(data){
          $scope.Global.loading = false;
          if(data.code && data.code == 10059){
            //$scope.Global.messages.data={msg:data.msg,type:'primary'};
            $scope.query(obj.type);
          }
          else if(data.code && data.code != 10059){
            $scope.Global.messages.data={msg:data.msg,type:'danger'};
          }
          else{
            $scope.Global.messages.data={msg:"返回数据错误~",type:'danger'};
          }
        })
        .error(errorHandler(e))
    }

    function errorHandler(e){
      $scope.Global.loading = false;
      $scope.Global.messages.data={msg:"数据请求失败",type:'danger'};
    }

  }];

  return obj;
});
