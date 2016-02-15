/**
 * Created by ASUS on 2015/9/6.
 *
 * message 数据格式：{
 *        data：{msg:msg info ,type:string}  // type = primary info danger success warning
 *        config:{
 *           showTime: Nms,
 *           delayTime:Nms,
 *           hideTime:Nms
 *        }
 * }
 *
 *
 */

'use strict'

define(['jquery'],function(jquery){
  var obj = {};
  obj.message =function(){
    return {
      restrict:'EA'
      ,scope:{
        message:'='
      }
      ,controller:function($scope,$element,G){

        $scope.$watch(function () {
          return $scope.message.data;
        },function(newV,oldV){
          if(!!newV.msg && newV!==oldV){

            var str = "<div class='alert ykb-message bg-"+$scope.message.data.type+"' title="+$scope.message.data.msg+">"+
              "<button type='button' class='close' data-dismiss='alert' aria-label='Close'>" +
              "<span aria-hidden='true'>&times;</span></button>" +
              $scope.message.data.msg+"</div>"

            $scope.message.data={};

            jquery($element).append(str)
            .find(".alert").show($scope.message.config.showTime)
            .delay($scope.message.config.delayTime)
            .hide($scope.message.config.hideTime,function(){
              jquery(this).remove();
            });
          }
        },true)

      }
    };
  };

  return obj;
});
