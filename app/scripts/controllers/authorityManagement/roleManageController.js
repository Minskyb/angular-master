'use strict'

define(['routers/routers_2','util/treeHelper','jquery'],function(router,treeHelper,jquery){

	var obj = {};

	obj.roleManageController = ['$scope',function($scope){

    console.log("hello world");

		$scope.tree = [
      {
        nodeId:1,
        role_id:1,
        nodeName:'菜单权限',
        child:[
          {
            role_id:1,
            nodeId: 2,
            nodeName: '医生搜索'
          },
          {
            nodeId: 3,
            nodeName: '认证申请',
            role_id:1,
            child: [
              {
                nodeId: 4,
                role_id:1,
                nodeName: '待审核'
              },
              {
                nodeId: 5,
                role_id:1,
                nodeName: '已审核'
              }
            ]
          }
        ]
      }
    ];

    var src =  [
      {
        nodeId:1,
        nodeName:'菜单权限',
        child:[
          {
            nodeId: 2,
            nodeName: '医生搜索'
          },
          {
            nodeId: 3,
            nodeName: '认证申请',
            child: [
              {
                nodeId: 4,
                nodeName: '待审核'
              },
              {
                nodeId: 5,
                nodeName: '已审核'
              }
            ]
          },
          {
            nodeId: 6,
            nodeName: '医生统计',
            child: [
              {
                nodeId: 7,
                nodeName: '实时在线',
                child: [
                  {
                    nodeId: 8,
                    nodeName: '非常完美'
                  }
                ]
              },
              {
                nodeId: 9,
                nodeName: '新增医生'
              },
              {
                nodeId: 10,
                nodeName: '收入统计'
              }
            ]
          }
        ]
      }
    ];

    $scope.tree2 = [];

    $scope.getChecked = function(){

      var helpter = new treeHelper($scope.tree2);
      var checked = helpter.getChecked("nodeId","child",true);
      console.log(JSON.stringify(checked));
    };

    $scope.checkboxTree = false;

    $scope.$on('editTreeClicked', function (e,data) {
      console.log("editTreeClicked 事件处理器");
      $scope.checkboxTree = true;
      var arr  = jquery.extend(true,{},{origin:src},{origin:$scope.tree}).origin;
      check(arr);
      $scope.tree2 = arr;
    })

    function check(data){
      data.forEach(function(item,index,arr){
        if(!!item.role_id) {
          item.isChecked = true;
        }
        if(!!item['child'] && item['child'].length){
          check(item['child']);
        }
      })
    }
	}];

	return obj;
});
