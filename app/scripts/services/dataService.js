/**
 * Created by ASUS on 2015/9/2.
 */
'use strict'

define(['jquery','extendJquery'],function($){
  var obj = {};

  obj.dataService = ['$http',function($http){
    return {
      /*=============================================================================
       *                  认证申请
       * =============================================================================*/

      /*获取已审核医生*/
      getVerifiedDoctor:function($scope,param){

      var param = $.JsonToFormData(param);

      $scope.Global.loading = true;
      return $http.post("/hp/Authdoctor/reviewed_doctors",param)
    },
       /*获取未审核医生*/
     getVerifyingDoctor:function($scope,param){

       var param = $.JsonToFormData(param);
       $scope.Global.loading = true;
       return $http.get("/hp/Authdoctor?"+param);
     },
      /*审核医生*/
    verifyAuthDoctor:function($scope,param){

       var param = $.JsonToFormData(param);
        $scope.Global.loading = true;
        return $http.post("/hp/Authdoctor/verify",param);
      },
      /*编辑医生*/
    editAuthDoctor:function($scope,param){

        var param = $.JsonToFormData(param);

        $scope.Global.loading = true;
        return $http.post("/hp/Authdoctor/change_doctor_info",param);
      },

      /*=============================================================================
      *                  诊所
      * =============================================================================*/
      // 诊所查询
      getClinicList:function($scope,param){

        $scope.Global.loading = true;
        return $http.get("/hp/Clinic/cliniclist?"+param);
      },
      // 诊所添加
      addClinic:function($scope,param){

        $scope.Global.loading = true;
        return $http.post("/hp/Clinic/addclinic",param);
      },
      // 更新诊所
      updateClinic:function($scope,param){
        $scope.Global.loading = true;
        return $http.post("hp/Clinic/updateclinic",param);
      },


      /*=============================================================================
       *                  私家医生
       * =============================================================================*/

      getDoctorTeamList:function($scope,param){

        param = $.JsonToFormData(param);
        $scope.Global.loading = true;
        return $http.get("/hp/Dt/doctorteamlist?"+param);
      },
      addDoctorTeam:function($scope,param){

        param = $.JsonToFormData(param);
        $scope.Global.loading = true;
        return $http.post("/hp/Dt/adddoctorteam",param);
      },
      updateDoctorTeam:function($scope,param){

        param = $.JsonToFormData(param);
        $scope.Global.loading = true;
        return $http.post("/hp/Dt/updatedoctorteam",param);
      },
      getTeamMember:function($scope,param){

        param = $.JsonToFormData(param);
        $scope.Global.loading = true;
        return $http.get("/hp/Dt/doctorofteamlist?"+param);
      },
      removeMember:function($scope,param){

        param = $.JsonToFormData(param);
        $scope.Global.loading = true;
        return $http.post("/hp/Dt/outteam",param);
      },
      setConnector:function($scope,param){

        param = $.JsonToFormData(param);
        $scope.Global.loading = true;
        return $http.post("/hp/Dt/setinterfacepeople",param);
      },
      changeDoctorTeam:function($scope,param){

        param = $.JsonToFormData(param);
        $scope.Global.loading = true;
        return $http.post("/hp/Dt/switchteam",param);
      },
      joinTeam:function($scope,param){

        param = $.JsonToFormData(param);
        $scope.Global.loading = true;
        return $http.post("/hp/Dt/joininteam",param);
      },

      /*=============================================================================
       *                  私家医生-档案管理
       * =============================================================================*/
      verifyphone:function($scope,param){

        param = $.JsonToFormData(param);
        return $http.post("/hp/Health/verifyphone",param);
      },
      addArchive:function($scope,param){

        param = $.JsonToFormData(param);
        $scope.Global.loading = true;
        return $http.post("/hp/Health",param);
      },
      getArchive:function($scope,param){

        param = $.JsonToFormData(param);
        $scope.Global.loading = true;
        return $http.post("/hp/Health/familylist",param);
      },
      deleteArchiveFile:function($scope,param){

        param = $.JsonToFormData(param);
        $scope.Global.loading = true;
        return $http.post("/hp/Health/delfamilyfile",param);
      }

      /*=============================================================================
       *                  官网-
       * =============================================================================*/
      ,
      uploadImg:function($scope,param){

        //param = $.JsonToFormData(param);
        //$scope.Global.loading = true;
        //return $http.post("/hp/Home/Index/upload",param);

        return "/hp/Home/Index/upload";
      },
      setNewSort:function($scope,param){

        param = $.JsonToFormData(param);
        $scope.Global.loading = true;
        return $http.post("/hp/Home/index/changeorder",param);
      },
      deleteImg:function($scope,param){

        param = $.JsonToFormData(param);
        $scope.Global.loading = true;
        return $http.post("/hp/Home/index/delimg",param);
      },
      getImg:function($scope,param){

        param = $.JsonToFormData(param);
        $scope.Global.loading = true;
        return $http.post("/hp/Home/index/piclist",param);
      },
      aboutAsTextUpload:function($scope,param){

        param = $.JsonToFormData(param);
        $scope.Global.loading = true;
        return $http.post("/hp/Home/Aboutus",param);
      },
      uploadNews:function($scope,param){

        param = $.JsonToFormData(param);
        $scope.Global.loading = true;
        return $http.post("/hp/Home/News",param,{'Content-Type':'text/plain'});
      }

      };
  }];

  return obj;
});
