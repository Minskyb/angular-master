/**
 * Created by ASUS on 2015/12/3.
 */
define(['jquery','datepicker','extendJquery'],function(jquery,datepicker){
  var obj = {};

  obj.queryArchiveController = ['$scope','dataService','utilService','$compile',function($scope,dataService,utilService,$compile){


    function constructor(){
      jquery(".datepicker").datepicker({
        format: 'yyyy-mm-dd',
        language:"zh_CN",
        //autoclose:"true",
        todayBtn:true,
        todayHighlight:true
        //startDate: '-3d'
      })
    }
    constructor();

    $scope.status = {
      currentView:'family',   // family or record
      linkphone:undefined
    }

    $scope.archiveTable = {
      headers:[
        {key:"uid",name:"家庭编号",sort:true},
        {key:"linkphone",name:"联系电话",sort:true},
        {key:"create_doctor_uid",name:"建档医生编号",sort:true},
        {key:"create_doctor_name",name:"建档医生",sort:true},
        {key:"create_time",name:"建档时间",sort:true},
        {key:"查看",name:"家庭成员",colType:"link"}
      ]
    };

    $scope.recordTable = {
      headers:[
        {key:"id",name:"档案编号",sort:true,colType:'plus'},
        {key:"name",name:"姓名",sort:true},
        {key:"birthday",name:"出生日期",sort:true},
        {key:"home_visit_doctor_name",name:"上门医生",sort:true},
        {key:"home_visit_time",name:"上门时间",sort:true}
      ]
    };

    $scope.subTable = {
      headers:[
        {key:"id",name:"档案编号",width:12},
        {key:"name",name:"姓名",width:4},
        //{key:"linkphone",name:"联系电话",width:8},
        {key:"sex",name:"性别",width:4},
        {key:"birthday",name:"出生日期",width:8},
        {key:"profession",name:"工作岗位",width:12},
        //{key:"create_doctor",name:"建档医生",width:4},
        //{key:"create_time",name:"建档日期",width:4},
        {key:"user_problems",name:"当前健康问题或风险",width:12},
        //{key:"medical_report_text",name:"体检记录",width:12},
        {key:"medical_report_file",name:"体检记录附件",width:12,type:"download"},
        //{key:"past_text",name:"过往病史",width:12},
        {key:"past_file",name:"过往病史附件",width:12,type:"download"},
        //{key:"family_past_text",name:"家庭病史",width:12},
        {key:"family_past_file",name:"家庭病史附件",width:12,type:"download"},
        {key:"health_goal",name:"健康目标",width:12},
        {key:"doctor_suggestions",name:"医生建议",width:12},
        {key:"home_visit_doctor_uid",name:"家访医生编号",width:4},
        {key:"home_visit_doctor_name",name:"家访医生",width:4},
        {key:"home_visit_time",name:"家访时间",width:4},
        {key:"record_personnel_uid",name:'记录人编号',width:4},
        {key:"record_personnel_name",name:"记录人",width:4}
      ],
      bodyData:[]
    }

    /*
    * 档案搜索
    * */
    $scope.searchArchive = function(){

      var param = jquery("#searchArchiveForm").serializeObject();

      dataService.getArchive($scope,param)
        .success(function(data){
          $scope.Global.loading = false;
          var filter = $scope.archiveTable.headers.toArr("key");
          var colType = $scope.archiveTable.headers.toArr("colType");
          $scope.archiveTable.bodyData = utilService.dataTableFormat(data,filter,colType);

          var subFilter = $scope.subTable.headers.toArr("key");
          $scope.subTable.bodyData = utilService.dataFormat(data,subFilter);

        })
        .error(function(){errorHandler()});
    }

    $scope.searchArchive();

    $scope.searchRecord = function(param){

      dataService.getArchive($scope,param)
        .success(function(data){
          $scope.Global.loading = false;
          var filter = $scope.recordTable.headers.toArr("key");
          var colType = $scope.recordTable.headers.toArr("colType");
          $scope.recordTable.bodyData = utilService.dataTableFormat(data,filter,colType);

          var subFilter = $scope.subTable.headers.toArr("key");
          $scope.subTable.bodyData = utilService.dataFormat(data,subFilter);

        })
        .error(function(){errorHandler()});
    }

    $scope.$on("YKB_TOGGLESUB",function(event,data){

      if(!data.isFresh)
        return ;

      var $target = jquery(data.target);
      var headers = $scope.subTable.headers;
      var row_data = $scope.subTable.bodyData[data.row_id]

      var str = "<td colspan='"+$scope.recordTable.headers.length+"' class='td-inline'><form>";
      str += utilService.getSubTableVerify(row_data,headers)+"</form></td>";


      $target.append($compile(str)($scope));
    });

    $scope.$on("YKB_CLICKEDLINK",function(event,data){
      if(!data) throw {msg:"YKB_CLICKEDLINK 事件制定不明确。"}
      if(data.col_name == '家庭成员'){
        showFamilyRecord(data);
      }
    });

    function errorHandler(){
      $scope.Global.loading = false;
      $scope.Global.messages.data = {msg:"Ajax 请求失败",type:"danger"};
    }

    function showFamilyRecord(data){
      $scope.status.currentView = 'record';
      $scope.status.linkphone = $scope.archiveTable.bodyData[data.row_id][1].v;

      var param = {
        uid:$scope.archiveTable.bodyData[data.row_id][0].v
      }
      $scope.searchRecord(param);
    }
  }];

  return obj;
});
