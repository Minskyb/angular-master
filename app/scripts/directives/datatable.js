/**
 * Created by ASUS on 2015/8/31.
 *
 * 使用示例：<div datatable data="local.dataTable" config="config"></div>
 * 属性说明：data 表格原始数据，完整格式如下：
 * data：{
 *      headers:[{name:string,sort:boolean,colType:string,hidden:boolean},{}],  // 表格列属性，name 列头名，sort：true/false 是否允许排序，colType:text/modal/link 列属性，详情后续补充。,hidden:true/false 是否隐藏
 *      bodyData:[[{v:text,src:string},{},{}..],[]...],       // 表格数据，v：数据值,src:跳转链接
 * }
 *
 * config:{
 *     modalId:string , // 存在模态时制定模态ID。
 *     clickedRow：int ，// 控件内部反馈回来的被点击行号。
 * }
 *
 */
'use strict'

define(['jquery','underscore','extendJquery'],function(jquery,_){
  var obj = {};

  obj.datatable = ['$compile','$timeout','utilService',function($compile,$timeout,utilService){

    return {
      restrict:'EA',
      replace:true,
      scope:{
        data:'='  // 表格原始数据
        ,config:'=' // 配置信息
      },
      templateUrl:'../../views/directivesTpl/datatable.html',
      controller:function($scope,$element,$attrs,$transclude){

        /*点击排序事件*/
        $scope.sort = function(index,sort){
          if(sort){
            $scope.data.headers[index].sortState
              =  $scope.data.headers[index].sortState ? - $scope.data.headers[index].sortState:1

            switch ( $scope.data.headers[index].sortState) {
              case 1: //asc 升序
                $scope.data.bodyData = $scope.data.bodyData.sort(function(a, b) {
                  return getCompareResult(a[index].v,b[index].v);
                });
                break;
              case -1: //desc 降序
                $scope.data.bodyData =  $scope.data.bodyData.sort(function(a, b) {
                  return getCompareResult(b[index].v,a[index].v);
                });
                break;
            };

            resetHeaderSort(index);
          }
        };

        /*
        * 展示隐藏子表
        * */
        $scope.toggleSub = function(event){

          var colSpan = $scope.data.headers.length;
          var target = jquery(event.target);
          var currentRow = target.parents("tbody>tr").eq(0).data("row");
          var className = "subRow"+currentRow;
          var subData = $scope.data.subData[currentRow];
          var subHeaders = $scope.data.subDataHeaders;

          var subRow = jquery("."+className);

          /*存在子集，并且是隐藏的*/
          if(subRow.length && subRow.eq(0).is(":hidden")){
            subRow.show();
            target.removeClass("glyphicon-plus").addClass("glyphicon-minus");
          }
          /*存在子集，并且是展示的 点击事件由 - 触发*/
          else if(subRow.length && !subRow.eq(0).is(":hidden")&& !$scope.isEditClicked){
            subRow.hide();
            target.removeClass("glyphicon-minus").addClass("glyphicon-plus");
          }
          /*存在子集，并且是展示的 点击事件由 edit 触发*/
          else if(subRow.length && !subRow.eq(0).is(":hidden")&& $scope.isEditClicked){

          }
          else{

            var str = "<tr class="+className+" data-row="+currentRow+"><td colspan="+colSpan+">" +
              "<form class='form-inline row editForm'>"
            var index =0;
            var head = {};
            _.each(subData,function(v,k){
                head = subHeaders[index];

              if(v=="") v="/";  // 空字符串处理。

               switch (head.type +":"+ head.edit){
                 case 'img:undefined':
                   str +=  "<div class='margin-bottom-10px col-sm-6 col-md-4' >" +
                   "<label for="+k+">"+head.name+"：</label>"
                  str += v.length==1 ?"<a href=''title='点击查看大图'><img src="+v+" style='width:224px;height:133px;'></a>"
                     :"<a href=''title='点击查看大图' ng-click=config.imgSrc='"+v+"' data-toggle='modal' data-target=#"+$scope.config.modalId+"><img src="+v+" style='width:224px;height:133px;'></a>"
                   str +="</div>";
                       break;
                 case 'textarea:undefined':
                 case 'textarea:true':
                   str +=  "<div class='margin-bottom-10px col-sm-6 col-md-4'>" +
                   "<label for="+k+">"+head.name+"：</label>" +
                   "<textarea disabled style='width:80%'  class='form-control' placeholder="+v+" name="+k+">"+v+"</textarea>" +
                   "</div>";
                       break;
                 case 'undefined:true':
                   str +=  "<div class='margin-bottom-10px col-sm-6 col-md-4'>" +
                   "<label for="+k+">"+head.name+"：</label>" +
                   "<input disabled type='text' class='form-control'  placeholder="+v+" name="+k+" value="+v+">" +
                   "</div>";
                       break;
                 case 'text:true':
                   str +=  "<div class='margin-bottom-10px col-sm-6 col-md-4'>" +
                   "<label for="+k+">"+head.name+"：</label>" +
                   "<input disabled style='width:80%'  type='text' class='form-control'  placeholder="+v+" name="+k+" value="+v+">" +
                   "</div>";
                       break;
                 case 'select:undefined':
                 case 'select:true':
                    str += "<div class='margin-bottom-10px col-sm-6 col-md-4'>" +
                    "<label for="+k+">"+head.name+"：</label>" +
                    "<select disabled style=width:80%;width:"+head.width+"  type='text' class='form-control'  placeholder="+v+" name="+k+" value="+v+"><option value='1'>通过</option><option value='4'>未通过</option><option value='-1'>待审核</option></select>" +
                    "</div>";
                       break;
                 case 'radio:undefined':
                 case 'radio:true':
                   str +=  "<div class='margin-bottom-10px col-sm-6 col-md-4 '>" +
                   "<label for="+k+">"+head.name+"：</label>" +
                   "<input disabled type='radio'  name='action' value='1'>通过 " +
                   "<input disabled type='radio' name='action' value='2'>未通过" +
                   //  "<label><input type='radio' name='optionsRadios' id='optionsRadios3' value='option3' disabled>Option three is disabled </label>"+
                   "</div>";
                       break;
                 default :
                   str +=  "<div class='margin-bottom-10px col-sm-6 col-md-4'>" +
                   "<label for="+k+">"+head.name+"：</label>" +
                   "<label ng-if='!head.edit' name="+k+">"+v+"</label>" +
                   "</div>";
                       break;
               };

              index++;
            });

            str +=  "</form><div style='border: 1px dashed lightpink;margin: 20px;'></div>";
            str += "<form class='form-inline updateForm'>" +
            "<div class='col-md-4 col-sm-6' style='padding-top: 27px;'>" +
            "<label>审核状态：</label>" +
            "<input type='radio' name='action' value='1'>通过 "+
            "<input type='radio' name='action' value='2'>未通过 "+
            "</div>" +
            "<div class='col-md-4 col-sm-6'>" +
            "<label for='reason'>原因：</label>" +
            "<textarea style='width:80%' name='reason'  class='form-control'></textarea>"+
            "</div>" +
            "<div class='col-md-4 col-sm-6' style='padding-top: 20px;'>" +
            "<button  class='btn-primary btn' ng-click='updateEnsure($event)'>提交</button>"+
            "<button  class='btn-primary btn' ng-click='updateCancel($event)'>取消</button>"+
            "</div>" +
            "</form></td></tr>"

            // 和作用域编译后添加入DOM
            target.parents("tbody>tr").eq(0).after( $compile(str)($scope));
            // '+' 图标改为 '-'
            target.removeClass("glyphicon-plus").addClass("glyphicon-minus");

          }

          /*移除所有 disable 属性*/
          if($scope.isEditClicked){
              subRow = jquery("."+className);
              subRow.find(":disabled").attr("data-disabled","able");
              subRow.find(":disabled").removeAttr("disabled");
          }

          $scope.isEditClicked = false;
        };

        /*
        * 编辑按钮点击事件：状态切换，模拟触发 '+'subToggle() 点击事件
        * */
        $scope.editRow = function(event,col){

          // isEditClicked = true 把所有 disable 去掉。
          $scope.isEditClicked = true;

          // 当前列的状态，editSate = true 展示 确定、取消界面 editSate = false 展示编辑界面
          col.editState = true;

          var target = jquery(event.target);

          /*触发 + - 图标点击事件*/
          $timeout(function(){
            angular.element(target.parents("tbody>tr").eq(0).find(".glyphicon")).triggerHandler('click');
          },0);

        };

        /*
        * 编辑确认按钮：
        * 操作：1、保存文本到 placeholder 中，方便用户修改后点击 编辑取消 数据恢复。
        *       2、提取被修改数据。
        *       3、调用回调函数，更新后台数据。
        *       4、禁用输入框
        *       5、隐藏 确定、取消按钮 展示 编辑按钮。
        * */
        $scope.editRowEnsure = function(event,col){

          var target = jquery(event.target);
          var currentRow = target.parents("tbody>tr").eq(0).data("row");
          var uid = $scope.data.subData[currentRow].uid;
          var submit_time = $scope.data.subData[currentRow].submit_time;
          var subRow = jquery(".subRow"+currentRow);

          var param = _.extend({uid:uid,submit_time:submit_time},subRow.find("form.editForm").serializeObject());

          // 回调函数
          $scope.config.editEnsure(param);

          //把新值保存在 placeholder 中
          subRow.find("[placeholder]").each(function(){
            $(this).attr("placeholder", $(this).val());
          });

          subRow.find("form.editForm [data-disabled]").attr({disabled:"disabled"});
          subRow.find("form.editForm [data-disabled]").removeAttr("data-disabled");

          col.editState = false;
        };

        $scope.updateEnsure = function(){
          var target = jquery(event.target);
          var currentRow = target.parents("tbody>tr").eq(0).data("row");
          var subRow = jquery(".subRow"+currentRow);

          var uid = $scope.data.subData[currentRow].uid;
          var submit_time = $scope.data.subData[currentRow].submit_time;
          var param = _.extend({uid:uid,submit_time:submit_time},subRow.find("form.updateForm").serializeObject());

          if(!param.action){
            utilService.globalMessage("审核状态未选择",'warning');
            return;
          }
          if(param.action=='2' && !param.reason){
            utilService.globalMessage("请填写未通过原因~！~",'warning');
            return;
          }
          $scope.config.updateEnsure(param);
        };

        $scope.updateCancel = function(){
          var target = jquery(event.target);
          var currentRow = target.parents("tbody>tr").eq(0).data("row");
          var subRow = jquery(".subRow"+currentRow);
          subRow.find("form.updateForm input[type='radio']").removeAttr("checked");
          subRow.find("form.updateForm textarea[name='reason']").val("");
        }

        /*
        * 编辑取消按钮：
        * 操作：1、使用 placeholder 值重置输入框的 val 值。
        *       2、禁用输入框。
        *       3、隐藏 确定、取消按钮 展示 编辑按钮。
        * */
        $scope.editRowCancel = function(event,col){

          var target = jquery(event.target);
          var currentRow = target.parents("tbody>tr").eq(0).data("row");
          var subRow = jquery(".subRow"+currentRow);

          var hasPlaceholder = subRow.find("[placeholder]"),index,length = hasPlaceholder.length;
          for( index = 0;index<length;index ++){
            hasPlaceholder.eq(index).val(hasPlaceholder.eq(index).attr("placeholder"));
          };

          subRow.find("form.editForm input:checked[type='radio']").removeAttr("checked");

          subRow.find("form.editForm [data-disabled]").attr({disabled:"disabled"});
          subRow.find("form.editForm [data-disabled]").removeAttr("data-disabled");

          $scope.ensure = false;
          col.editState = false;
        };

        /*记录被点击行*/
        $scope.setRow = function(event){
          var target = jquery(event.target);
          $scope.config.clickedRow = target.parents("tbody>tr").eq(0).data("row");
        };

        /*重置排序状态*/
        function resetHeaderSort(index){
          var length =  $scope.data.headers.length;
          for(var i=0;i<length;i++){
            if(i!==index && !! $scope.data.headers[i].sort)
              $scope.data.headers[i].sortState = '';
          }
        };

        /* 排序*/
        function getCompareResult(a, b) {
          return  a==b?0:a>b?1:-1
        };

      }
    }
  }];

  return obj;
});
