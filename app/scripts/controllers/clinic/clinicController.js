/**
 * Created by ASUS on 2015/11/13.
 */
'use strict';

define(['jquery','extendJquery'],function(jquery){
  var obj = {};

  obj.clinicController = ['$scope','$compile','utilService','dataService',function($scope,$compile,utilService,dataService){

    $scope.status = {
      // 更新状态或者新增状态
      isUpdate:false
    };
    $scope.edit = {
      "clinique_id":"",
      clinique_name:"",
      clinique_address:"",
      linkman:"",
      linkphone:"",
      describle:""
    }

    $scope.search = function(){

    }

    $scope.clinicTable = {
      headers:[
        {key:"clinique_name",name:"诊所名称",sort:true,colType:"plus"},
        {key:"doctorteamnum",name:"医生团队数量",sort:true},
        {key:"doctornum",name:"医生数量",sort:true},
        {key:"clinique_address",name:"地址",sort:true},
        {key:"修改",name:"操作",colType:"link"}
      ]
    }

    $scope.subTable ={
      headers:[
        {key:"clinique_id",name:"诊所ID",type:"hide"},
        {key:"clinique_name",name:"诊所名称"},
        {key:"doctorteamnum",name:"医生团队数量"},
        {key:"doctornum",name:"医生数量"},
        {key:"clinique_address",name:"地址"},
        {key:"linkman",name:"联系人"},
        {key:"linkphone",name:"联系电话"},
        {key:"describle",name:"描述"}
      ],
      bodyData:[]
    };

    $scope.search = function(){
      var param = $("#clinicSearchForm").serialize();
      dataService.getClinicList($scope,param)
        .success(function(data){
          $scope.Global.loading = false;
            switch (data.code){
              case 10021:
                var header = $scope.clinicTable.headers.toArr("key");
                var colType = $scope.clinicTable.headers.toArr("colType");
                var subHeader = $scope.subTable.headers.toArr("key");

                $scope.clinicTable.bodyData = utilService.dataTableFormat(data.cliniclist,header,colType);
                $scope.subTable.bodyData = utilService.dataFormat(data.cliniclist,subHeader);
                break;
              default :

                break;
            }
        })
        .error(function(){errorHandler()});

    }

    $scope.search();

    $scope.submit = function(){
      jquery("#newClinicModal").modal('hide');
      var param = jquery("#addClinicForm").serialize();
      //var param = new FormData(document.getElementById("addClinicForm"));
      if($scope.status.isUpdate){
        dataService.updateClinic($scope,param)
          .success(function(data){
            $scope.Global.loading = false;
            $scope.status.isUpdate = false;
            switch (data.code){
              case 10022:
                $scope.Global.messages.data = {msg:data.msg,type:'primary'};
                $scope.search();
                break;
              default:
                $scope.Global.messages.data = {msg:data.msg,type:'danger'};
                break;
            }
          })
          .error(function(){$scope.status.isUpdate = false;errorHandler()});
      }else{
        dataService.addClinic($scope,param)
          .success(function(data){
            $scope.Global.loading = false;
            switch (data.code){
              case 10018:
                $scope.Global.messages.data = {msg:data.msg,type:'primary'};
                $scope.search();
                break;
              default:
                $scope.Global.messages.data = {msg:data.msg,type:'danger'};
                break;
            }
          })
          .error(function(){errorHandler()});
      }


    }
    $scope.add = function(){
      $scope.status.isUpdate = false;
      resetEditForm();
      $("#newClinicModal").modal({keyBord:false});
    }

    $scope.cancel = function(){
      jquery("#newClinicModal").modal('hide');
    }

    $scope.$on("YKB_CLICKEDLINK",function(event,data){
      switch (data.col_name){
        case "操作":
          showUpdateForm(data);
          break;
        default :
          break;
      }
    });

    $scope.$on("YKB_TOGGLESUB",function(event,data){
      if(data.isFresh){
        var target = jquery(data.target);
        var row_data = $scope.subTable.bodyData[data.row_id];
        var headers = $scope.subTable.headers;

        var str = "<td colspan='"+$scope.clinicTable.headers.length+"' class='td-inline'><form>";
        str += utilService.getSubTableVerify(row_data,headers)+"</form></td>";

        target.append($compile(str)($scope));
      }
    });

    function errorHandler(){
      $scope.Global.loading = false;
      $scope.Global.messages.data ={msg:e,type:'danger'};
    }

    function showUpdateForm(data){

      for(var key in $scope.subTable.bodyData[data.row_id]){
        $scope.edit[key] = $scope.subTable.bodyData[data.row_id][key];
      }

      $scope.status.isUpdate = true;
      jquery("#newClinicModal").modal({keyBord:false});
    }

    function resetEditForm(){
      for(var key in $scope.edit ){
        $scope.edit[key] = "";
      }
    }

  }];

  return obj;
});
