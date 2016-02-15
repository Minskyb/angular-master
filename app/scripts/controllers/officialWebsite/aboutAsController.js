/**
 * Created by ASUS on 2016/1/11.
 */
'use strict';
define(['jquery','editor','editor_lists','editor_colors','editor_font_size'],function(jquery){

  var obj = {};

  obj.aboutAsController = ['$scope','dataService',function($scope,dataService){

/*    jquery('#editor').editable({
      inlineMode: false,
      alwaysBlank: true
      //imageUploadURL:'http://i.froala.com/upload'， // 图片上传接口地址
      //imageDeleteURL:null // 删除图片接口地址
    });*/

    $scope.status = {
      ABOUTAS_IMG_MAX_COUNT:4,
      CURRENT_ABOUTAS_IMG_COUNT:0
    }

    $scope.aboutUs = [];

    $scope.query = function(type){

      dataService.getImg($scope,{type:type})
        .success(function(data){
          $scope.Global.loading = false;
          if(data.code && data.code == 10061){

              $scope.aboutUs = data.piclist;
              $scope.status.CURRENT_ABOUTAS_IMG_COUNT = $scope.aboutUs.length;
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

    $scope.query(3);

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

      if( imgType == 3 && $scope.status.CURRENT_ABOUTAS_IMG_COUNT == $scope.status.ABOUTAS_IMG_MAX_COUNT){
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


    $scope.clearText = function(){

      jquery("#editor").empty();
    }

    $scope.uploadText = function(){

      var text = jquery("#editor").text();
      dataService.aboutAsTextUpload($scope,{"about_us":text})
        .success(function(data){
          $scope.Global.loading = false;
          if(data.code && data.code == 10066){
            $scope.Global.messages.data = {msg:data.msg,type:"primary"};
          }
          else if(data.code && data.code != 10066){
            $scope.Global.messages.data = {msg:data.msg,type:"danger"};
          }
          else {
            $scope.Global.messages.data = {msg:'请求返回数据错误',type:"danger"};
          }
        })
        .error(errorHandler)
    }
  }];
  return obj;
});
