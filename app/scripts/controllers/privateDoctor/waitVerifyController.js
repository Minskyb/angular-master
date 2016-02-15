/**
 * Created by ASUS on 2015/8/31.
 */
'use strict';

define(['jquery','extendJquery'],function(jquery){
  var obj = {};

  obj.waitVerifyController = ['$scope','dataService','utilService','$compile',function($scope,dataService,utilService,$compile){

    $scope.dataTable = {
      headers:[
        {key:'uid',name:"医生编号",sort:true,colType:'plus'},
        {key:'name',name:"医生名称", sort:true},
        {key:'phone_number',name:'手机号码',sort:false},
        {key:'submit_time',name:"提审时间", sort:true},
        //{key:'查看',name:"医生详情",sort:false,colType:'custom_plus'},
        {key:'通过',name:'通过',sort:false,colType:'link'},
        {key:'拒绝',name:'拒绝',sort:false,colType:'link',color:'red'},
      ],
      bodyData:[]
    };

    $scope.subTable ={
      headers:[
        {key:'uid',name:"医生编号"},
        {key:'name',name:"医生姓名"},
        {key:'province',name:"省份"},
        {key:'city',name:"城市"},
        {key:'district',name:"区"},
        {key:'hospital',name:"医院",type:"text"},
        {key:'department',name:"科室"},
        {key:'professional_title',name:"职称"},
        {key:'good_at_and_clinic',name:"擅长"},
        {key:'team_submit_time',name:"提审日期"},
        {key:'state',name:"认证类型"},
        {key:'picture1',name:"医生资格证",type:"img"},
        {key:'picture2',name:"医生工作证",type:"img"},
        {key:'picture3',name:"医生正面照",type:"img"}
      ],
      bodyData:[]
    };

    $scope.status ={
      // 当前操作数据行
      currentHandleRowNumber:""
    }

    $scope.throughForm = {
      "clinique_id":undefined,
      "doctor_team_id":undefined
    }

    $scope.refuseFrom = {
      "refuseReason":undefined
    }

    $scope.constructor = function(){
      // 监听 modal 关闭事件
      jquery('#newTeamModal').on('hidden.bs.modal', function (e) {
        // 新增 修改 model 数据重置
        $.resetObject($scope.throughForm);
      })
    }
    $scope.constructor();

    /*医生查询*/
    $scope.query = function(){

      var param = jquery("#search_form").serializeObject();
      param["type"] ="private";

      dataService.getVerifyingDoctor($scope,param)
        .success(function(data){
          $scope.Global.loading = false;
          switch(data.code){
            case 10004:
              var headers = $scope.dataTable.headers.toArr("key"),
                colType = $scope.dataTable.headers.toArr("colType"),
                subHeaders =  $scope.subTable.headers.toArr("key");
              $scope.dataTable.bodyData = utilService.dataTableFormat(data.doctorlist,headers,colType);
              $scope.subTable.bodyData = utilService.dataFormat(data.doctorlist,subHeaders);
              break;
            case 10005:
              $scope.dataTable.bodyData = [];
              $scope.subTable.bodyData = [];
              $scope.Global.messages.data ={msg:data.msg,type:'primary'};
              break;
            default :
              $scope.Global.messages.data ={msg:data.msg,type:'danger'};
              break;
          }
        })
        .error(function(){errorHandler()});
    };
    $scope.query();

    /*监听 toggleSub 事件 跨作用域事件传递
     *操作 1、获取当前行对应的子行数据
     *     2、根据子行数据及列头生成相应表单，并绑定到当前作用域（$scope）上
     * */
    $scope.$on("YKB_TOGGLESUB",function(event,data){
      if(data.isFresh){
        var target = jquery(data.target);
        var row_data = $scope.subTable.bodyData[data.row_id];
        var headers = $scope.subTable.headers;

        var str = "<td colspan='"+$scope.dataTable.headers.length+"' class='td-inline'><form>";
        str += utilService.getSubTableVerify(row_data,headers)+"</form></td>";

        target.append($compile(str)($scope));
      }
    });

    /*
     * 监听 link 事件 跨作用域事件传递
     * */
    $scope.$on("YKB_CLICKEDLINK",function(event,data){
      if(!data) throw {msg:"YKB_CLICKEDLINK 事件制定不明确。"}

      switch (data.col_name){
        case "通过":
          $scope.status.currentHandleRowNumber = data.row_id;
          showAgreeModal(data);
          break;
        case "拒绝":
          $scope.status.currentHandleRowNumber = data.row_id;
          $('#degreeModal').modal({keyboard: false})
          break;
        default :
          break;
      }
    });

    /*监听‘图片’点击事件
     *操作 1、展示大图
     * */
    $scope.showBigPic = function(picName,src){
      $scope.bigPic = {
        src:src
      };
      $('#bigPicModal').modal({keyboard: false})
    };

    /*医生通过*/
    $scope.throughVerify = function(){
      var param = {
        "doctor_id":$scope.subTable.bodyData[$scope.status.currentHandleRowNumber].uid,
        "team_submit_time": $scope.subTable.bodyData[$scope.status.currentHandleRowNumber].team_submit_time,
        "action": 1,
        "team_reason":""
      };

      for(var key in $scope.throughForm){
        if("undefined" == typeof $scope.throughForm[key]){
          alert("必须选择嘻嘻嘻，嘻嘻嘻");
          return;
        }
        else{
          param[key] = $scope.throughForm[key];
        }
      }

      dataService.joinTeam($scope,param)
        .success(function(data){
          $scope.Global.loading = false;
          if(data.code && data.code === 10030){
            $scope.Global.messages.data = {msg:data.msg,type:'primary'};
            $scope.query();
          }
          else if(data.code && data.code !== 10030){
            $scope.Global.messages.data = {msg:data.msg,type:'danger'};
          }
          else{
            $scope.Global.messages.data = {msg:JSON.stringify(data),type:'danger'};
          }
        })
        .error(function(e){
          errorHandler()
        })

      $("#agreeModal").modal("hide");
    };

    /*医生拒绝*/
    $scope.refuseVerify = function(event){

      var param = {
        "doctor_id":$scope.subTable.bodyData[$scope.status.currentHandleRowNumber].uid,
        "team_submit_time": $scope.subTable.bodyData[$scope.status.currentHandleRowNumber].team_submit_time,
        "action": 2,
        "team_reason":$scope.refuseFrom.refuseReason
      }

      dataService.joinTeam($scope,param)
        .success(function(data){
          $scope.Global.loading = false;
          if( data.code && data.code === 10007){
            $scope.Global.messages.data = {msg:data.msg,type:'primary'};
            $scope.query();
          }
          else if(data.code && data.code !== 10007){
            $scope.Global.messages.data = {msg:data.msg,type:'danger'};
          }
          else{
            $scope.Global.messages.data = {msg:JSON.stringify(data),type:'danger'};
          }
        })
        .error(function(e){
          errorHandler();
        });
      $("#degreeModal").modal("hide");
    }

    /*根据诊所ID 获取团队*/
    $scope.changeHospital = function(){

      var param ={
        "clinique_id":$scope.throughForm.clinique_id
      }

      dataService.getDoctorTeamList($scope,param)
        .success(function(data){
          $scope.Global.loading = false;
          switch (data.code){
            case 10029:
              $scope.teams = utilService.dataFormat(data.doctorteamlist,["doctor_team_id","doctor_team_name"]);
              console.log();
              break;
            default :
              $scope.Global.messages.data ={msg:data.msg,type:"danger"};
              break;
          }
        })
        .error(function(){errorHandler()})

      var param = jquery("#changeTeamForm").serialize();
      console.log(param);
    };

    function showAgreeModal(){

      requestHospitalService();
      $('#agreeModal').modal({keyboard: false});
    }

    function requestHospitalService(){

      dataService.getClinicList($scope)
        .success(function(data){
          $scope.Global.loading = false;
          if(data.code && data.code === 10021){
            $scope.clinics = utilService.dataFormat(data.cliniclist,["clinique_id","clinique_name","latitude","longitude","linkman","linkphone","clinique_name","clinique_address"]);
          }
          else if(data.code && data.code !== 10021){
            $scope.Global.messages.data = {msg:data.msg,type:"danger"};
          }
          else{
            $scope.Global.messages.data = {msg:JSON.stringify(data),type:"danger"};
          }
        })
        .error(function(){errorHandler();})
    }

    function errorHandler(){
      $scope.Global.loading = false;
      $scope.Global.messages.data ={msg:e,type:'danger'};
    }
  }];

  return obj;

});
