/**
 * Created by ASUS on 2015/11/27.
 */
'use strict'

define(['jquery','extendJquery'],function(jquery){
  var obj = {};


  obj.addArchiveController = ['$scope','utilService','$compile','dataService',function($scope,utilService,$compile,dataService){

    $scope.status = {
      //familyId:undefined
    }

    $scope.archiveEditForm = {
      familyId:undefined,
      name:undefined,
      sex:undefined,
      address:undefined,
      birthday:undefined,
      linkphone:undefined,
      profession:undefined,
      "create_doctor":undefined,
      "create_time":undefined,
      "user_problems":undefined,
      "medical_report_text":undefined,
      "medical_report_file":undefined,
      "past_text":undefined,
      "past_file":undefined,
      "family_past_text":undefined,
      "family_past_file":undefined,
      "health_goal":undefined,
      "doctor_suggestions":undefined,
      "home_visit_doctor":undefined,
      "home_visit_time":undefined,
      "record_personnel":undefined
    }

    $scope.newArchiveSubmit = function(){

      var param = getSubmitParam();

      //console.log( $scope.archiveEditForm);
      dataService.addArchive($scope,param)
        .success(function(data){
          $scope.Global.loading = false;
          if(data.code && data.code === 10048){
            $scope.resetFormStatus();
            $scope.Global.messages.data = {msg:data.msg,type:"primary"};
          }
          else if(data.code && data.code !== 10048){
            $scope.Global.messages.data = {msg:data.msg,type:"warning"};
          }
          else{
            $scope.Global.messages.data = {msg:JSON.stringify(data),type:"danger"};
          }
        })
        .error(function(e){errorHandler(e)})
    }

    $scope.judgePhone = function(){

      if(!$scope.archiveEditForm.linkphone || $scope.archiveEditForm.linkphone.length!=11)
        return;
      var param = {
        linkphone:$scope.archiveEditForm.linkphone
      }
      dataService.verifyphone($scope,param)
        .success(function(data){
          if(data.family_id){
            $scope.archiveEditForm.familyId = data.family_id;
          }
        })
        .error(function(e){errorHandler(e)})
    }

    $scope.uploadFamilyFile = function(target){

      if(!$scope.archiveEditForm.linkphone){
        $scope.$apply(function(){
          $scope.Global.messages.data = {msg:"请先填入手机号码!",type:"danger"};
        });
        jquery("#linklinkphone")[0].focus();
        return;
      }

      switch (target.id){
        case "medical_report_file":
          uploadFamilyFileService(target.id,1);
            break;
        case "past_file":
          uploadFamilyFileService(target.id,2);
            break;
        case"family_past_file":
          uploadFamilyFileService(target.id,3);
            break;
        default :
          $scope.Global.messages.data = {msg:"为找到对应的处理函数",type:"danger"};
            break;
      }
      jquery(target).val("");
    }

    function uploadFamilyFileService(id,type){

      var formData = new FormData();
      var files = document.getElementById(id).files;

      if(!files || !files.length) return ;

      for(var i = 0 ;i < files.length;i++){
        formData.append("family_file[]",files[i]);
      }
      formData.append("type",type);
      formData.append("family_id",$scope.archiveEditForm.familyId);

      jquery.ajax({
        url:jquery.vhost+"/hp/Health/uploadfamilyfile",
        type:"post",
        data:formData,
        processData : false,
        contentType: false,
        beforeSend:function(){
          $scope.$apply(function(){
            $scope.Global.loading = true;
          });
        },
        success:function(data){
          if(data.family_id){
            var target = jquery("#"+id);
            for(var i = 0 ;i < data.file_id.length; i++){
              var html = "<span class='family-file' data-file='"+data.file_id[i]+"' data-file-size='"+data.file_size[i]+"'>" +
                "<label class='family-file-name'>"+data.file_id[i]+"</label>" +
                "<div class='family-file-mark'><button class='btn btn-danger delete' ng-click='deleteFamilyFile($event)'>&times;&times;</button></div>"+
                "</span>";

              target.before(jquery($compile(html)($scope)));
            }
            $scope.$apply(function(){
              $scope.Global.loading = false;
              $scope.Global.messages.data = {msg:data.msg,type:"primary"};
            });
          }
          else{
            $scope.$apply(function(){
              $scope.Global.loading = false;
              $scope.Global.messages.data={msg:data.msg,type:"danger"};
            })
          }
        },
        error:function(e){
          $scope.Global.loading = false;
          alert("upload file error!"+JSON.stringify(e));
        }
      });
    }

    $scope.deleteFamilyFile = function(event){

      var jqueryFile = jquery(event.target).parents(".family-file");

      var param = {
        "family_id":$scope.archiveEditForm.familyId,
        "file_id":jqueryFile.attr("data-file")
      }

      dataService.deleteArchiveFile($scope,param)
        .success(function(data){

          $scope.Global.loading = false;
          if(data.code && data.code === 10052){

            $scope.Global.messages.data = {msg:data.msg,type:"primary"};
            jqueryFile.remove();
          }
          else if(data.code && data.code !== 10052){

            $scope.Global.messages.data = {msg:data.msg,type:"warning"};
          }
          else{

            $scope.Global.messages.data = {msg:JSON.stringify(data),type:"danger"};
          }
        })
        .error(function(e){errorHandler(e)})
    }

   /* $scope.$on("YKB_CLICKEDLINK",function(event,data){
      $scope.Global.messages.data={msg:JSON.stringify(data),type:"warning"};
    });*/

  /* $scope.$on("YKB_TOGGLESUB",function(event,data){
      if(data.isFresh){
        var target = jquery(data.target);
        var row_data = $scope.subTable.bodyData[data.row_id];
        var headers = $scope.subTable.headers;

        var str = "<td colspan='"+$scope.archivesTable.headers.length+"' class='td-inline'><form>";
        str += utilService.getSubTableVerify(row_data,headers)+"</form></td>";

        target.append($compile(str)($scope));
      }
    });*/

    function errorHandler(e){
      $scope.Global.loading = false;
      $scope.Global.messages.data ={msg:e,type:'danger'};
    }

    function getSubmitParam(){

      var param = jquery("#archiveForm").serializeObject();
      var medicalReportFile = [],pastFile = [],familyPastFile = [];
      var medicalReportFileSize = [],pastFileSize = [],familyPastFileSize = [];
      jquery("#medical_report_file").prevAll(".family-file").each(function(index){
        medicalReportFile.push(jquery(this).attr("data-file"));
        medicalReportFileSize.push(jquery(this).attr("data-file-size"));
      });
      param["medical_report_file"] = medicalReportFile.toString();
      param["medical_report_file_size"] = medicalReportFileSize.toString();

      jquery("#past_file").prevAll(".family-file").each(function(index){
        pastFile.push(jquery(this).attr("data-file"));
        pastFileSize.push(jquery(this).attr("data-file-size"));
      });
      param["past_file"] = pastFile.toString();
      param["past_file_size"] = pastFileSize.toString();

      jquery("#family_past_file").prevAll(".family-file").each(function(index){
        familyPastFile.push(jquery(this).attr("data-file"));
        familyPastFileSize.push(jquery(this).attr("data-file-size"));
      });
      param["family_past_file"] = familyPastFile.toString();
      param["family_past_file_size"] = familyPastFileSize.toString();

      param["family_id"] = $scope.archiveEditForm.familyId;
      return param;
    }

    $scope.resetFormStatus = function(){
      jquery.resetObject($scope.archiveEditForm);

      jquery("#medical_report_file").prevAll().remove();
      jquery("#past_file").prevAll().remove();
      jquery("#family_past_file").prevAll().remove();
    }


  }];


  return obj;
});
