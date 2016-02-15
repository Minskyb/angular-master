/**
 * Created by ASUS on 2015/8/31.
 */
'use strict'

define(['jquery','extendJquery'],function(jquery){
  var obj = {};

  obj.verifyingController = ['$scope','otherService','utilService',function($scope,otherService,utilService){

    $scope.local={
      clinics:[], // 所有诊所数据源
      currentClinic:'',// 当前所选诊所
      dataTable:{},// 表格数据源
      doctorDetail:[] // 指定医生详情
    };

    $scope.local.dataTable = {
      headers:[
        {key:'uid',name:"医生编号", sort:true},
        {key:'name',name:"医生名称", sort:true},
        {key:'province',name:"省份",sort:true},
        {key:'hospital',name:"医院",sort:true},
        {key:'state',name:"认证类型",sort:true},
        {key:'submit_time',name:"提审时间", sort:true},
        {key:'编辑', name:"操作",colType:"editHandler"}
      ],
      subDataHeaders:[
        {key:'uid',name:"医生编号"},
        {key:'name',name:"医生姓名"},
        {key:'province',name:"省份"},
        {key:'city',name:"城市"},
        {key:'district',name:"区"},
        {key:'hospital',name:"医院",edit:true,type:"text"},
        {key:'department',name:"科室"},
        {key:'professional_title',name:"职称"},
        {key:'good_at_and_clinic',name:"擅长"},
        {key:'submit_time',name:"提审日期"},
        {key:'state',name:"认证类型"},
        {key:'picture1',name:"医生资格证",type:"img"},
        {key:'picture2',name:"医生工作证",type:"img"},
        {key:'picture3',name:"医生正面照",type:"img"},
        {key:'picture4',name:"医生正面照",type:"img"},
        {key:'picture5',name:"医生正面照",type:"img"}
      ]
    };

    /*医生查询*/
    $scope.query = function(){
      var param = jquery("#search_form").serializeObject();

      otherService.getVerifyingDoctor($scope,param).success(function(data){
        if(data.state == 1){
          data = data.data;
          $scope.Global.loading = false;
          switch(data.code){
            case 10004:
              $scope.local.dataTable.bodyData = utilService.dataTableFormat(data.doctorlist,$scope.local.dataTable.headers.toArr("key"));
              $scope.local.dataTable.subData = utilService.dataFormat(data.doctorlist,$scope.local.dataTable.subDataHeaders.toArr("key"));
              break;
            case 10005:
              $scope.local.dataTable.bodyData = [];
              $scope.local.dataTable.subData = [];
              utilService.globalMessage(data.msg,'primary');
              break;
            default :
              utilService.globalMessage(data.msg,'primary');
              break;
          };
        }else{
          $scope.Global.loading = false;
          utilService.globalMessage(JSON.stringify(data.msg),'danger');
        }
      }).error(function (e) {
        $scope.Global.loading = false;
        utilService.globalMessage(JSON.stringify(e),'danger');
      });
    };

    $scope.query();

    $scope.config ={
      modalId:'bigPicModal'
      ,editEnsure:function(param){

        otherService.editAuthDoctor($scope,param)
          .success(function(data){

            $scope.Global.loading = false;

            if(data.state == 1) {
              data = data.data;
              switch (data.code) {
                case 10009:
                  utilService.globalMessage("修改成功",'success');
                  break;
                default :
                  utilService.globalMessage("修改失败:" + data.msg,'danger');
                  break;
              };
            }
            else{
              utilService.globalMessage("操作失败：与服务器连接超时",'danger');
            }

          })
          .error(function(e){
            $scope.Global.loading = false;
            utilService.globalMessage("操作失败："+JSON.stringify(e),'danger');
          });
      }
      ,updateEnsure: function (param) {
        console.log(JSON.stringify(param));
        otherService.verifyAuthDoctor($scope,param)
          .success(function(data){

            $scope.Global.loading = false;
            if(data.state == 1){
              data = data.data;
              switch (data.code){
                case 10006:
                case 10007:
                  utilService.globalMessage(data.msg,'primary');
                  $scope.query();
                  break;
                default :
                  utilService.globalMessage(data.msg,'info');
                  break;
              }
            }
            else{
              utilService.globalMessage("操作失败:"+data.msg,'danger');
            }
          })
          .error(function(e){
            $scope.Global.loading = false;
            utilService.globalMessage("操作失败："+JSON.stringify(e),'danger');
          });
      }
    };

  }];

  return obj;

});
