/**
 * Created by ASUS on 2015/8/31.
 */
'use strict';

define(['jquery','extendJquery'],function(jquery){
  var obj = {};

  obj.verifyingController = ['$scope','dataService','utilService','$compile',function($scope,dataService,utilService,$compile){

    $scope.dataTable = {
      headers:[
        {key:'uid',name:"医生编号", sort:true,colType:'plus'},
        {key:'name',name:"医生名称", sort:true},
        {key:'province',name:"省份",sort:true},
        {key:'hospital',name:"医院",sort:true},
        {key:'state',name:"认证类型",sort:true},
        {key:'submit_time',name:"提审时间", sort:true}
      ],
      bodyData:[]
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
      ],
      bodyData:[]
    };

    /*医生查询*/
    $scope.query = function(){
      var param = jquery("#search_form").serializeObject();

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
                $scope.Global.messages.data ={msg:data.msg,type:'primary'};
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

        var str = "<td colspan='7' class='td-inline'><fieldset form='editForm'><legend>详细信息：</legend><form>";
        str += utilService.getSubTableVerify(row_data,headers);
        //str += utilService.getEdit();
        str +="</form></fieldset><fieldset><legend>认证审核：</legend><form>";
        str +=utilService.getDoctorVerified();
        str +="</form></fieldset></td>";

        target.append($compile(str)($scope));
      }
    });

    /*监听‘编辑’点击事件
    * 操作 1、隐藏‘编辑’按钮，放出 ‘确定、取消’按钮
    *      2、取消所有 disable 属性
    * */
    $scope.edit = function(event){

      var self = jquery(event.currentTarget);

      self.slideUp(function(){
        jquery(this).next(".snc").slideDown();
      });
      self.parents("form").find(":disabled").removeAttr("disabled");
    };

    /*监听 ‘确定、取消’点击事件
    *操作 1、根据事件原始触发对象调用不同处理函数
    * */
    $scope.editSNC = function(event){

      var self = jquery(event.currentTarget);

      jquery(event.target).attr("type")=='submit'?editEnSure(event):editHide(self,'cancel');

    };

    /*监听‘审核提交’点击事件
    *操作 1、
    * */
    $scope.updateEnsure = function(event){
      var param = getParam(event);
      if(typeof param.action == "undefined") $scope.Global.messages.data ={msg:"审核状态未选择",type:"warning"};
      else if(!!param.action && param.action ==2 && !param.reason.length)  $scope.Global.messages.data ={msg:"请填写未通过原因",type:"warning"};
      else dataService.verifyAuthDoctor($scope,param)
            .success(function(data){
              $scope.Global.loading = false;
                switch (data.code){
                  case 10006:
                  case 10007:
                    $scope.Global.messages.data ={msg:data.msg,type:'primary'};
                    $scope.query();
                    break;
                  default :
                    $scope.Global.messages.data ={msg:data.msg,type:'info'};
                    break;
                }
            })
            .error(function(){errorHandler()});
    };

    /*监听‘审核清空’点击事件
    * 操作 1、清空审核状态及原因
    * */
    $scope.updateCancel = function(event){
      var parentForm =jquery(event.target).parents("form");
      parentForm.find("input[type='radio']").removeAttr("checked");
      parentForm.find("textarea[name='reason']").val("");
    };

    /*监听‘图片’点击事件
    *操作 1、展示大图
    * */
    $scope.showBigPic = function(picName,src){
      $scope.bigPic = {
        src:src
      };
      //模拟点击
      jquery("#showBigPic").click();
    };

    function editEnSure(event){
      var param = getParam(event);

      dataService.editAuthDoctor($scope,param)
        .success(function(data){
          $scope.Global.loading = false;
            switch (data.code) {
              case 10009:
                $scope.Global.messages.data ={msg:'修改成功',type:'success'};
                editHide(self,'submit');
                break;
              default :
                $scope.Global.messages.data ={msg:'修改失败:'+data.msg,type:'danger'};
                break;
            }
        })
        .error(function(){errorHandler()});
    }

    function editHide(self,type){
      self.parents("form").find("[placeholder]").each(function(){
        type=='submit'?jquery(this).attr("placeholder",jquery(this).val()):jquery(this).val(jquery(this).attr("placeholder"));
      }).attr("disabled","");

      self.slideUp(function(){
        jquery(this).prev(".edit").slideDown()
      });
    }

    function getParam(event){
      var target = jquery(event.target);

      var currentRow = target.parents("tbody>tr").eq(0).prev("tr").data("row");
      var uid = $scope.subTable.bodyData[currentRow].uid;
      var submit_time = $scope.subTable.bodyData[currentRow].submit_time;

      return  jquery.extend({},target.parents("form").serializeObject(),{uid:uid},{submit_time:submit_time});
    }

    function errorHandler(){
      $scope.Global.loading = false;
      $scope.Global.messages.data ={msg:"代理服务器未启动或网络异常...",type:'danger'};
    }

  }];

  return obj;

});
