/**
 * Created by ASUS on 2016/1/11.
 */
'use strict';

define(['jquery','editor','editor_lists','editor_colors','editor_font_size'],function(jquery){

  var obj = {};

  obj.articleController = ['$scope','dataService',function($scope,dataService){



    jquery('#editor').editable({
      inlineMode: false,
      alwaysBlank: true
      //imageUploadURL:'http://i.froala.com/upload'， // 图片上传接口地址
      //imageDeleteURL:null // 删除图片接口地址
    });

    $scope.blur = function(obj){

      if(jquery(obj).val()){
        jquery("#content").hide();
      }
      else{
        jquery("#content").show();
      }

    }


    $scope.status = {
      category_id:undefined,
      category_title:'',
      category_link:''
    };

    $scope.categories = [
      {
        id:1,
        name:'公司新闻'
      },
      {
        id:2,
        name:'行业新闻'
      },
      {
        id:3,
        name:'专业常识'
      }
    ];

    $scope.chooseCategory = function(){

      console.log( $scope.status.category_id);
    }

    $scope.uploadNews = function(){

      var param = {
        title:$scope.status.category_title,
        category:$scope.status.category_id,
        url:$scope.status.category_link,
        content:jquery("#editor").find(".froala-element").html()
      }

      jquery.ajax({
        url:jquery.vhost +"/hp/Home/News",
        contentType:'text/plain',
        data:param,
        success:function(data){
          $scope.$apply(function(){
            $scope.Global.loading = false ;
          });
          if(data.code && data.code == 10067){
            $scope.$apply(function(){
              $scope.Global.messages.data = {msg:data.msg,type:"primary"};
            });
          }
          else if (data.code && data.code != 10067){
            $scope.$apply(function(){
              $scope.Global.messages.data = {msg:data.msg,type:"primary"};
            });
          }
          else {
            $scope.$apply(function(){
              $scope.Global.messages.data = {msg:"请求返回结果错误",type:"danger"};
            });
          }
        },
        error:function(e){
          $scope.$apply(function(){
            $scope.Global.messages.data = {msg:"Ajax 请求失败",type:"danger"};
          });
        }
      });

      //dataService.uploadNews($scope,param)
      //  .success(function(data){
      //    $scope.Global.loading = false ;
      //    if(data.code && data.code == 10067){
      //      $scope.Global.messages.data = {msg:data.msg,type:"primary"};
      //    }
      //    else if (data.code && data.code != 10067){
      //      $scope.Global.messages.data = {msg:data.msg,type:"primary"};
      //    }
      //    else {
      //      $scope.Global.messages.data = {msg:"请求返回结果错误",type:"danger"};
      //    }
      //  })
      //  .error(errorHandler)
    }

    function errorHandler(e){
      $scope.Global.loading = false;
      $scope.Global.messages.data ={msg:"Ajax 请求失败",type:'danger'};
    }

  }];

  return obj;
});
