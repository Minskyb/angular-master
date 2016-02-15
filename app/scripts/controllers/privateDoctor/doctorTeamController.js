/**
 * Created by ASUS on 2015/11/18.
 */
'use strict'

define(['jquery','extendJquery'],function(jquery){
  var obj = {};

  obj.doctorTeamController = ['$scope','$compile','utilService','dataService',function($scope,$compile,utilService,dataService){

    $scope.status = {
      // 默认展示医生团队
      currentView: "teams",
      // 当前操作的团队名称
      currentTeam:"",
      // 当前操作的团队ID
      currentTeamId:"",
      // 当前操作的医生ID
      currentDoctorId:"",
      // 当前操作诊所ID
      currentClinicId:"",
      // 新增 or 修改
      isUpdate:false,
      // 新加医生
      newDoctor:false,
      // 默认展示头像
      defaultImg:"images/addhead.png",
      // 当前展示头像
      currentImg:"images/addhead.png",
      // 头像是否被改变
      headImgChanged:""
    }

    $scope.doctorTeamEdit = {
      "clinique_name":undefined,
      "doctor_team_name":undefined,
      "doctor_team_summary":undefined,
      "team_head_photo":undefined,
      "doctor_team_id":undefined,
      "department":undefined
    }

    $scope.changeTeamEdit = {
      // 医生即将更换到的团队ID
      doctor_team_id:null,
      // 医生即将更换到的诊所ID
      clinique_id:null
    }

    $scope.constructor = function(){
      // 监听 modal 关闭事件
      jquery('#newTeamModal').on('hidden.bs.modal', function (e) {
        // 新增 修改 model 数据重置
        resetNewTeamModel();
      })
    }
    $scope.constructor();

    $scope.teamsTable = {
      headers:[
        {key:'doctor_team_name',name:"医生团队名称", sort:true},
        {key:'clinique_id',name:"所属诊所ID",hidden:true},
        {key:'clinique_name',name:"所属诊所", sort:true},
        {key:'member_count',name:"医生数量",sort:true},
        {key:'doctor_team_summary',name:"团队介绍",width:"514px"},
        {key:'team_head_photo',name:"团队头像",hidden:true},
        {key:'headimgurl',name:"头像URL",hidden:true},
        {key:'doctor_team_id',name:"团队ID",hidden:true},
        {key:'department',name:"接诊"},
        {key:"查看",name:"医生列表",colType:"link"},
        {key:'操作',name:"修改",colType:"link"}
      ]
    };

    $scope.membersTable ={
      headers:[
        {key:'uid',name:"医生编号"},
        {key:'name',name:"姓名"},
        {key:'clinique_name',name:"所属诊所"},
        {key:'更换',name:"更换团队",colType:'link'},
        {key:'移除',name:"移除成员",colType:'link',color:'red'},
        {key:'interface',name:"接口护士",colType:'checkbox',charge:1}
      ],
      bodyData:[]
    };

    $scope.addDoctorTable ={
      headers:[
        {key:'uid',name:"医生编号"},
        {key:'team_submit_time',name:"提审时间",hidden:true},
        {key:'name',name:"姓名"},
        {key:'province',name:"所属诊所"},
        {key:'city',name:"城市"},
        {key:'添加',name:"添加",colType:'link'}
      ],
      bodyData:[]
    };

    $scope.searchTeam = function(){

      var param = jquery("#searchTeamForm").serializeObject();

      dataService.getDoctorTeamList($scope,param)
        .success(function(data){
          $scope.Global.loading = false;
          switch (data.code){
            case 10029:
              var headers = $scope.teamsTable.headers.toArr("key"),
                colType = $scope.teamsTable.headers.toArr("colType");
              $scope.teamsTable.bodyData = utilService.dataTableFormat(data.doctorteamlist,headers,colType);
              break;
            default :
              $scope.Global.messages.data ={msg:data.msg,type:'danger'};
              break;
          }
        })
        .error(function(){{errorHandler()}});
    }

    $scope.searchTeam();

    $scope.showNewTeamModal = function(){
      requestHospitalService();
      jquery("#newTeamModal").modal({keyboard:false});
    }

    /*
    * 添加标签
    * */
    $scope.addMark = function(event){
      var target = jquery(event.target);
      if(event.which === 186 || event.keyCode === 186 ){
        console.log(target.val());
      }
    }

    /*
    * 新增、修改医生团队 提交
    * */
    $scope.submit = function(){

      jquery("#newTeamModal").modal("hide");
      var param ={};

      // 基本信息
      for(var key in $scope.doctorTeamEdit){
        var value =  $scope.doctorTeamEdit[key]
        param[key] = value;
      }

      param["department"] = param["department"].replace(/；/g,"#");

      // 根据 诊所名字添加 诊所其它相关信息。
      for(var i = 0 ;i <  $scope.clinics.length; i++){
        var clinic = $scope.clinics[i];
        if(clinic["clinique_id"] == param["clinique_id"]){
          for(var key in clinic){
            param[key] = clinic[key];
          }
        }
      }

      if($scope.status.isUpdate && $scope.status.headImgChanged){
        // 更新图片
        changeHeadImg(param,updateDoctorTeamService)
      }
      else if($scope.status.isUpdate && !$scope.status.headImgChanged){
        // 更新图片
        updateDoctorTeamService(param);
      }
      else{
        // 新增图片
        upLoadHeadImg(param,addDoctorTeamService)
      }

      // 新增 修改 model 数据重置
      resetNewTeamModel();
    }

    $scope.cancel = function(){
      jquery("#newTeamModal").modal("hide");
      $scope.status.isUpdate = false;

      // 新增 修改 model 数据重置
      resetNewTeamModel();
    }

    /*
     * 监听 link 事件 跨作用域事件传递
     * */
    $scope.$on("YKB_CLICKEDLINK",function(event,data){
      if(!data) throw {msg:"YKB_CLICKEDLINK 事件制定不明确。"}

      switch (data.col_name){
        case "删除医生团队":
          $scope.confirmModal({
            title:"删除医生团队",
            content:"对应团队信息将被删除，确认删除医生团队？",
            action:function(){
              console.log($scope.currentView);
            }
          });
          break;
        case "医生列表":
          showTeams(data);
          break;
        case "移除成员":
          $scope.confirmModal({
            title:"成员移除",
            content:"确定将此医生移除此团队？",
            action:function(){
              removeMember(data);
            }
          });
          break;
        case "更换团队":
         changeDoctorTeam(data);
          break;
        case "修改":
          setDoctorTeamEdit(data);
          break;
        case "添加":
          addDoctor2Team(data);
          break;
        case "接口护士":
          setConnector(data);
          break;
        default :
          $scope.Global.messages.data ={msg:JSON.stringify(data),type:'danger'};
          break;
      }
    });

    //$scope.$on("YKB_CLICKRADIO",function(event,data){
    //  setConnector(data);
    //});

    $scope.changeHospital = function(){

      var param ={
        "clinique_id":$scope.changeTeamEdit.clinique_id
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

    function changeDoctorTeam(data){

      $scope.status.currentDoctorId = $scope.membersTable.bodyData[data.row_id][0].v;
      $scope.changeTeamEdit.doctor_team_id = $scope.status.currentTeamId;
      $scope.changeTeamEdit.clinique_id = $scope.status.currentClinicId;

      requestHospitalService();
      $scope.changeHospital();
      jquery("#changeTeamModal").modal({keyboard:false});
    }

    $scope.changeSubmit = function(){

      if($scope.changeTeamEdit.doctor_team_id == $scope.status.currentTeamId && $scope.changeTeamEdit.clinique_id == $scope.status.currentClinicId)
      {
        jquery("#changeTeamModal").modal("hide");
        return;
      }

      var param = {
        "doctor_team_id":$scope.status.currentTeamId,
        "doctor_id":$scope.status.currentDoctorId,
        "receive_doctor_team_id":$scope.changeTeamEdit.doctor_team_id
      }

      dataService.changeDoctorTeam($scope,param)
        .success(function(data){
          $scope.Global.loading = false;
          switch (data.code){
            case 10034:
              jquery("#changeTeamModal").modal("hide");
              $scope.Global.messages.data={msg:data.msg,type:"primary"};
              getTeamMemberService({"doctor_team_id":$scope.status.currentTeamId});
              break;
            default :
              jquery("#changeTeamModal").modal("hide");
              $scope.Global.messages.data={msg:data.msg,type:"danger"};
              break;
          }
        })
        .error(function(){errorHandler()})

    };

    /*
    * 图片预览
    * */
    $scope.preview = function(file){

      var prevDiv = document.getElementById('preview');
      if (file.files && file.files[0])
      {
        var reader = new FileReader();
        reader.onload = function(evt){
          prevDiv.innerHTML = '<img src="' + evt.target.result + '"/>';

          $scope.status.headImgChanged = true;
        }
        reader.readAsDataURL(file.files[0]);
      }
      else if(file.files && file.files.length == 0){
        var src = "images/addhead.png"
        if($scope.status.isUpdate){
          src = $scope.currentImg;
        }
        prevDiv.innerHTML = '<img src='+src+'/>';
      }
      //else
      //{
      //  prevDiv.innerHTML = '<div class="img" style="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src=\'' + file.value + '\'"></div>';
      //}
    }

    /*
    * 添加隐藏 未加入团队的医生。
    * */
    $scope.toggleAddDoctor = function(){
      $scope.status.newDoctor = !$scope.status.newDoctor;

      // 隐藏状态嘛事不干
      if(!$scope.status.newDoctor)
        return;

      $scope.searchDoctor();
    }

    /*
    * 搜索，未加入团队的医生
    * */
    $scope.searchDoctor = function(){
      var param = jquery("#search_doctor").serializeObject();

      // 已审核的非私家医生
      param["type"] = 1;

      dataService.getVerifiedDoctor($scope,param)
        .success(function(data){
          $scope.Global.loading = false;
          switch (data.code){
            case 10015:
              var headers = $scope.addDoctorTable.headers.toArr("key"),
                colType = $scope.addDoctorTable.headers.toArr("colType");
              $scope.addDoctorTable.bodyData = utilService.dataTableFormat(data.doctorlist,headers,colType);
              $scope.Global.messages.data ={msg:data.msg,type:"primary"}
              break;
            default :
              $scope.Global.messages.data ={msg:data.msg,type:"danger"}
              break;
          }
        })
        .error(function(){errorHandler()});

    }

    /*
    * 切换到指定 医生团队的医生列表中
    * */
    function showTeams(data){
      $scope.status.currentView = "members";
      $scope.status.currentTeam = $scope.teamsTable.bodyData[data.row_id][0].v;
      $scope.status.currentTeamId = Number($scope.teamsTable.bodyData[data.row_id][7].v);
      $scope.status.currentClinicId = Number($scope.teamsTable.bodyData[data.row_id][1].v);

      var param = {};
      param["doctor_team_id"] = $scope.status.currentTeamId;
      getTeamMemberService(param);
    }

    /*
    * 获取团队成员
    * */
    function getTeamMemberService(param){
      dataService.getTeamMember($scope,param)
        .success(function(data){
          $scope.Global.loading = false;
          if(data.code && data.code == 10041){
            var headers = $scope.membersTable.headers.toArr("key"),
              colType = $scope.membersTable.headers.toArr("colType");
            $scope.membersTable.bodyData = utilService.dataTableFormat(data.doctorlist,headers,colType);
          }
          else if(data.code && data.code != 10041){
            $scope.membersTable.bodyData= [];
            $scope.Global.messages.data={msg:data.msg,type:"danger"};
          }
          else{
            $scope.Global.messages.data={msg:JSON.stringify(data),type:"danger"};
          }
        })
        .error(function(){errorHandler()})
    }

    function removeMember(data){
      var param = {
        "doctor_team_id":$scope.status.currentTeamId,
        "doctor_id":$scope.membersTable.bodyData[data.row_id][0].v
      };

      dataService.removeMember($scope,param)
        .success(function(data){
          $scope.Global.loading = false;
          if(data.code && data.code === 10032){
            $scope.Global.messages.data ={msg:data.msg,type:"primary"};
            getTeamMemberService({"doctor_team_id":$scope.status.currentTeamId});
          }
          else if(data.code && data.code !== 10032){
            $scope.Global.messages.data ={msg:data.msg,type:"danger"};
          }
          else{
            $scope.Global.messages.data ={msg:JSON.stringify(data),type:"danger"};
          }
        })
        .error(function(){errorHandler()})
    }

    function setConnector(data){

      var checked = data.target.checked;

      var param ={
        "doctor_team_id":$scope.status.currentTeamId,
        "doctor_id":$scope.membersTable.bodyData[data.row_id][0].v,
        "action":checked ? 0 :1
      }

      dataService.setConnector($scope,param)
        .success(function(data){
          $scope.Global.loading = false;
          if(data.code && data.code === 10036){
            $scope.Global.messages.data ={msg:data.msg,type:"primary"};
          }
          else if(data.code && data.code !== 10036){
            getTeamMemberService({"doctor_team_id":$scope.status.currentTeamId});
            $scope.Global.messages.data ={msg:data.msg,type:"danger"};
          }
          else{
            getTeamMemberService({"doctor_team_id":$scope.status.currentTeamId});
            $scope.Global.messages.data ={msg:data.msg,type:"danger"};
          }
        })
        .error(function(){errorHandler()})

    }

    function setDoctorTeamEdit(data){
      $scope.status.isUpdate = true;

      $scope.doctorTeamEdit ={
        "clinique_id":Number($scope.teamsTable.bodyData[data.row_id][1].v),
        "doctor_team_name":$scope.teamsTable.bodyData[data.row_id][0].v,
        "doctor_team_summary":$scope.teamsTable.bodyData[data.row_id][4].v,
        "team_head_photo":Number($scope.teamsTable.bodyData[data.row_id][5].v),
        "doctor_team_id":Number($scope.teamsTable.bodyData[data.row_id][7].v)
      }

      $scope.doctorTeamEdit["department"] = "object" == typeof $scope.teamsTable.bodyData[data.row_id][8].v ? $scope.teamsTable.bodyData[data.row_id][8].v.join("；"):"";

      $scope.status.currentImg = $scope.teamsTable.bodyData[data.row_id][6].v

      $scope.showNewTeamModal();
    }

    function updateDoctorTeamService(param){
      $scope.status.isUpdate = false;
      dataService.updateDoctorTeam($scope,param)
        .success(function(data){
          $scope.Global.loading =false;
          switch (data.code){
            case 10039:
              resetNewTeamModel();
              $scope.Global.messages.data ={msg:data.msg,type:'primary'};
              $scope.searchTeam();
              break;
            case undefined:
              $scope.Global.messages.data ={msg:"医生团队数据更新失败",type:'danger'};
              break;
            default :
              $scope.Global.messages.data ={msg:data.msg,type:'danger'};
              break;
          }
        })
        .error(function(){ errorHandler();})
    };

    function addDoctorTeamService(param){
      dataService.addDoctorTeam($scope,param)
        .success(function(data){
          $scope.Global.loading =false;
          switch (data.code){
            case 10026:
              $scope.searchTeam();
              $scope.Global.messages.data ={msg:data.msg,type:'primary'};
              $.resetObject($scope.doctorTeamEdit);
              break;
            default :
              $scope.Global.messages.data ={msg:data.msg,type:'danger'};
              break;
          }
        })
        .error(function(){ errorHandler();})
    }

    function requestHospitalService(){

      dataService.getClinicList($scope)
        .success(function(data){
          $scope.Global.loading = false;
          switch (data.code){
            case 10021:
              $scope.clinics = utilService.dataFormat(data.cliniclist,["clinique_id","clinique_name","latitude","longitude","linkman","linkphone","clinique_name","clinique_address"]);
                console.log();
              break;
            default :
              $scope.Global.messages.data ={msg:data.msg,type:"danger"};
              break;
          }
        })
        .error(function(){errorHandler()})

    }

    function errorHandler(){
      $scope.Global.loading = false;
      $scope.Global.messages.data ={msg:"Ajax 请求失败",type:'danger'};
    }

    function upLoadHeadImg(param,callback){

      var formData = new FormData();
      formData.append("headimg",document.getElementById("headimg").files[0]);

      jquery.ajax({
        url:jquery.vhost+"/hp/Dt/uploadfiles",
        type:"post",
        data:formData,
        processData : false,
        contentType: false,
        beforeSend:function(){
          $scope.Global.loading = true;
        },
        success:function(data){
          $scope.Global.loading = false;
          switch (data.code){
            case 10044:
              param["timestamp"] = Number(data.data.timestamp);
              param["doctor_team_id"] = Number(data.data.doctor_team_id);
              callback(param);
              $scope.Global.messages.data = {msg:data.msg,type:"primary"};
              break;
            default :
              $scope.Global.messages.data = {msg:data.msg,type:"danger"};
              break;
          }
        },
        error:function(e){
          $scope.Global.loading = false;
          alert("update file error!")
        }
      });
    }

    function changeHeadImg(param,callback){

      var formData = new FormData();
      formData.append("headimg",document.getElementById("headimg").files[0]);
      formData.append("doctor_team_id",param["doctor_team_id"]);
      formData.append("team_head_photo",param["team_head_photo"])

      jquery.ajax({
        url:"http://192.168.20.16/hp/Dt/uploadfiles",
        type:"post",
        data:formData,
        processData : false,
        contentType: false,
        beforeSend:function(){
          $scope.Global.loading = true;
        },
        success:function(data){
          $scope.Global.loading = false;
          switch (data.code){
            case 10044:
              param["timestamp"] = data.data.timestamp;
              callback(param);
              $scope.Global.messages.data = {msg:data.msg,type:"primary"};
              break;
            default :
              $scope.Global.messages.data = {msg:data.msg,type:"danger"};
              break;
          }
        },
        error:function(e){
          $scope.Global.loading = false;
          alert("update file error!")
        }
      });
    }

    function addDoctor2Team(data){

      var param = {
        "doctor_team_id":$scope.status.currentTeamId,
        "doctor_id":$scope.addDoctorTable.bodyData[data.row_id][0].v,
        "team_submit_time":$scope.addDoctorTable.bodyData[data.row_id][1].v,
        "action":1,
        "team_reason":""
      }

      dataService.joinTeam($scope,param)
        .success(function(data){
          $scope.Global.loading = false;
          if (data.code && data.code === 10030){
              $scope.Global.messages.data = {msg:data.msg,type:"primary"};
              getTeamMemberService({"doctor_team_id":$scope.status.currentTeamId});
              $scope.toggleAddDoctor();
          }
          else if(data.code && data.code !== 10030){
            $scope.Global.messages.data = {msg:data.msg,type:"danger"};
          }
          else{
            $scope.Global.messages.data = {msg:JSON.stringify(data),type:"danger"};
          }
        })
        .error(function(){errorHandler()})

    }

    function resetNewTeamModel(){

      $scope.status.headImgChanged = false;
      $scope.status.currentImg = $scope.status.defaultImg;

      var prevDiv = jquery("#preview");
      prevDiv.html("");
      prevDiv.append($compile('<img ng-src="{{status.currentImg}}">')($scope));

      $.resetObject($scope.doctorTeamEdit);

    }

  }];

  return obj;
});
