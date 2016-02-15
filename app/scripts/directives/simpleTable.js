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

  obj.simpleTable = ['$compile','$timeout','utilService',function($compile,$timeout,utilService){

    return {
      restrict:'EA',
      replace:true,
      scope:{
        data:'='  // 表格原始数据
      },
      templateUrl:'../../views/directivesTpl/simpleTable.html',
      controller:function($scope,$element,$attrs,$transclude){

        /*点击排序事件*/
        $scope.sort = function(index,sort){
          // 支持排序且有数据
          if(sort && !!$scope.data.bodyData){
            $scope.data.headers[index].sortState
              =  $scope.data.headers[index].sortState ? - $scope.data.headers[index].sortState:1

            switch ( $scope.data.headers[index].sortState) {
              case 1: //asc 升序
                $scope.data.bodyData = $scope.data.bodyData.sort(function(a, b) {
                  return _getCompareResult(a[index].v,b[index].v);
                });
                break;
              case -1: //desc 降序
                $scope.data.bodyData =  $scope.data.bodyData.sort(function(a, b) {
                  return _getCompareResult(b[index].v,a[index].v);
                });
                break;
            };
            _resetHeaderSort(index);
          }
        };


        /*行点击事件*/
        $scope.clickedRow  = function(row_id){
          $scope.$emit("YKB_ROWCLICKED",{row_id:row_id});
        }

        $scope.clickedLink = function(event,col_id){
          $scope.$emit("YKB_CLICKEDLINK",{
            row_id:_getRowId(event),
            col_id:col_id,
            col_name:$scope.data.headers[col_id].name,
            target:event.target
          });
        };

        /*编辑按钮点击事件：*/
        $scope.editRow = function(event,col_id,col){
          //编辑状态切换
          col.editState = true;
          //jquery(event.target.parentNode.parentNode).data("row");
          $scope.$emit("YKB_EDITROW",{
            state:0
            ,row_id:_getRowId(event)
            ,col_id:col_id
            ,col_name:$scope.data.headers[col_id].name
          });
        };

        /*编辑确认按钮： */
        $scope.editRowEnsure = function(event,col_id,col){
          //编辑状态切换
          col.editState = false;

          var row_id = _getRowId(event);
          var subRow = jquery(".subRow_"+row_id)

          $scope.$emit("YKB_EDITROW",{
            state:1
            ,row_id:_getRowId(event)
            ,col_id:col_id
            ,col_name:$scope.data.headers[col_id].name
          });
        };

        /*编辑取消按钮：*/
        $scope.editRowCancel = function(event,col_id,col){
          //编辑状态切换
          col.editState = false;
          $scope.$emit("YKB_EDITROW",{
            state:-1
            ,row_id:_getRowId(event)
            ,col_id:col_id
            ,col_name:$scope.data.headers[col_id].name
          });
        };

        /* 派发 toggleSub 事件*/
        $scope.toggleSub = function(event,col_id,col,isCustom){
          //console.log(event.target);
          col.minusState = typeof col.minusState == 'undefined'?true:!col.minusState;

          var row_id = _getRowId(event),$target = jquery(event.target),isFresh = false,isShow =true;
          var subRow = jquery(".subRow_"+row_id)

          if(subRow.length && subRow.eq(0).is(":hidden")){
            subRow.show();
            isShow=true;
            if(!isCustom)
              $target.removeClass("glyphicon-plus").addClass("glyphicon-minus");
          }
          else if(subRow.length && !subRow.eq(0).is(":hidden")){
            subRow.hide();
            isShow=false;
            if(!isCustom)
              $target.removeClass("glyphicon-minus").addClass("glyphicon-plus");
          }
          else{
            $target.parents('tr#row_'+row_id).after("<tr class=subRow_"+row_id+"></tr>");
            isFresh = true;
          }

          $scope.$emit("YKB_TOGGLESUB",{
            isFresh:isFresh
            ,isShow:isShow
            ,row_id:_getRowId(event)
            ,col_id:col_id
            ,col_name:$scope.data.headers[col_id].name
            ,target:".subRow_"+row_id
          });
          isFresh = false;
        };


        /*重置排序状态*/
        function _resetHeaderSort(index){
          var length =  $scope.data.headers.length;
          for(var i=0;i<length;i++){
            if(i!==index && !! $scope.data.headers[i].sort)
              $scope.data.headers[i].sortState = '';
          }
        };


        /* 排序*/
        function _getCompareResult(a, b) {
          return  a==b?0:a>b?1:-1
        };

        /*返回当前行*/
        function _getRowId(event){
          return jquery(event.target).parents("tbody>tr").eq(0).data("row");
        }

      }
    }
  }];

  return obj;
});
