/**
 * Created by ASUS on 2015/9/2.
 */
'use strict'

define([],function(){
  var obj = {};

  obj.otherService = ['$http',function($http){
    return {
      /*获取未审核医生*/
     getVerifyingDoctor:function($scope,param){

       $scope.Global.loading = true;
       var url = typeof param=='undefined'?"/hp/Authdoctor?"+param:"/hp/Authdoctor";
       return $http.get(url);
     },
      /*获取已审核医生*/
    getVerifiedDoctor:function($scope,param){

      $scope.Global.loading = true;
      return $http.post("/hp/Authdoctor/reviewed_doctors",param)
    },
      /*审核医生*/
    verifyAuthDoctor:function($scope,param){

        $scope.Global.loading = true;
        return $http.post("/hp/Authdoctor/verify",param);
      },
      /*编辑医生*/
    editAuthDoctor:function($scope,param){

        $scope.Global.loading = true;
        return $http.post("/hp/Authdoctor/change_doctor_info",param);
      }
    };
  }];

  return obj;
});
