/**
 * Created by ASUS on 2015/9/15.
 */
'use strict'

define(['jquery'],function(jquery){
  var obj ={};

  obj.verifiedController = ['dataService','$scope','utilService','$compile',function(dataService,$scope,utilService,$compile){

    $scope.dataTable = {
      headers:[
        {key:'uid',name:"医生编号", sort:true,colType:'plus'},
        {key:'name',name:"医生名称", sort:true},
        {key:'province',name:"省份",sort:true},
        {key:'hospital',name:"医院",sort:true},
        {key:'state',name:"认证类型",sort:true},
        {key:'submit_time',name:"提审时间", sort:true},
        {key:'finish_time', name:"完成时间",sort:true}
      ]
    };

    $scope.subTable ={
      headers:[
        {key:'uid',name:"医生编号"},
        {key:'name',name:"医生姓名",width:8},
        {key:'province',name:"省份"},
        {key:'city',name:"城市"},
        {key:'district',name:"区"},
        {key:'hospital',name:"医院"},
        {key:'department',name:"科室"},
        {key:'professional_title',name:"职称"},
        {key:'submit_time',name:"提审日期",width:12},
        {key:'finish_time',name:"完成日期",width:12},
        //{key:'state',name:"认证类型"},
        {key:'good_at_and_clinic',name:"擅长",width:12},
        {key:'picture1',name:"医生资格证",type:"img"},
        {key:'picture2',name:"医生工作证",type:"img"},
        {key:'picture3',name:"医生正面照",type:"img"}
      ]
    };

    /*医生查询*/
    $scope.query = function(){
      var param = jquery("#search_form").serializeObject();

      dataService.getVerifiedDoctor($scope,param).success(function(data){
        //if(data.state == 1){
        //  data = data.data;
          $scope.Global.loading = false;
          switch(data.code){
            case 10015:
              var headers = $scope.dataTable.headers.toArr("key"),
                colType = $scope.dataTable.headers.toArr("colType"),
                subHeaders = $scope.subTable.headers.toArr("key");
              $scope.dataTable.bodyData = utilService.dataTableFormat(data.doctorlist,headers,colType);
              $scope.subTable.bodyData = utilService.dataFormat(data.doctorlist,subHeaders);
              break;
            case 10014:
              $scope.dataTable.bodyData = [];
              $scope.dataTable.subData = [];
              $scope.Global.messages.data={msg:data.msg,type:'primary'};
              break;
            default :
              $scope.Global.messages.data={msg:data.msg,type:'primary'};
              break;
          };
        //}else{
        //  $scope.Global.loading = false;
        //  utilService.globalMessage(JSON.stringify(data.msg),'danger');
        //}
      }).error(function (e) {
        $scope.Global.loading = false;
        //$scope.Global.messages.data={msg:'代理服务器未启动或网络异常...',type:'danger'};
        $scope.Global.messages.data={msg: e,type:'danger'};
      });
    };

    $scope.query();

    /*监听 toggleSub 事件*/
    $scope.$on("YKB_TOGGLESUB",function(event,data){
      if(data.isFresh){
        var target = jquery(data.target);
        var row_data = $scope.subTable.bodyData[data.row_id];
        var headers = $scope.subTable.headers;

        var str = "<td colspan='7' class='td-inline'><form>"
        str += utilService.getSubTableVerify(row_data,headers);
        str +="</form></td>"

        target.append($compile(str)($scope));
      }
    });


    $scope.showBigPic = function(picName,src){
      $scope.bigPic = {
        src:src
      };
      //模拟点击
      jquery("#showBigPic").click();
    };

  }];

  return obj;
});
