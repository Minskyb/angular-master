/**
 * Created by ASUS on 2015/8/12.
 */
'use strict'

define([
  'routers/routers',
  'jquery',
  'extendJquery'
],function(routers,jquery){
  var controllerObj = {};

  controllerObj.leftMenuController = ['$scope','$state',function($scope,$state){

    // 本地完整路由结构
    $scope.menus = routers.clinic.menus;

    // 获得用户权限，刷新时从本地获取权限
    $scope.Global.menus = $scope.Global.menus ? $scope.Global.menus: JSON.parse(sessionStorage.getItem("Global.menus"));

    if(!$scope.Global.menus){
      $state.go("system.login");
      $scope.Global.messages.data = {msg:'身份信息失效，请重新登录',type:'danger'};
      return;
    }

    var obj = array2Object($scope.Global.menus,"key");

    // 合并用户权限，是否存在 role_id 决定了用户是否拥有此节点权限。
    obj = jquery.extend(true,$scope.menus,obj);

    $scope.menus = object2Array(obj,"sort");

    authorityJudge();

    //getAllAuthority($scope.menus);
    console.log('all...');

    /*
    * 鼠标点击菜单事件
    * */
    $scope.changeMenu = function(menu,subMenu){

      //如果点击的是 有子集父菜单
      if(menu.submenus && menu.submenus.length>0 && !!!subMenu){

        menu.showSubMenu = !menu.showSubMenu;
      }
      //如果点击的是无子集 父菜单
      else if(!!!menu.submenus||menu.submenus.length==0){

        $scope.Global.currentMenu = menu.title;
        $scope.Global.currentSubMenu = '';

        // 本地存储当前状态，以防止刷新后进入初始状态
        localStorage.setItem("currentMenu",$scope.Global.currentMenu);
        localStorage.setItem("currentSubMenu",$scope.Global.currentSubMenu);

      }
      else if(!!subMenu){

        $scope.Global.currentMenu = menu.title;
        $scope.Global.currentSubMenu = subMenu.title;

        // 本地存储当前状态，以防止刷新后进入初始状态
        localStorage.setItem("currentMenu",$scope.Global.currentMenu);
        localStorage.setItem("currentSubMenu",$scope.Global.currentSubMenu);
      }
    };

    /*
     * 测试时获取所有权限
     * */
    function getAllAuthority(menus){
      for(var i in menus){
        menus[i].role_id = 1;
        if(menus[i].submenus)  getAllAuthority(menus[i].submenus);
      }
    };

    function array2Object(arr,key){

      var result = {};
      var key = "undefined" == typeof key ? "key":key;

      for(var i = 0 ; i < arr.length; i++){
        var item = arr[i];
        result[item[key]] = $.extend(true,{},arr[i]);

        if(item.submenus && !!item.submenus.length){
          result[item[key]]["child"] =  array2Object(item.submenus,key);
        }
      }
      return result;
    };

    function object2Array(source,sort){
      var result = [];
      for(var key in source){
        if(source[key].child ){
          result.push($.extend(true,{},source[key],{"child": object2Array(source[key].child,sort)}));
        }
        else{
          result.push($.extend(true,{},source[key]));
        }
      }
      return result;
    };

    function authorityJudge(){

      var arr = window.location.hash.slice(2).split('/').join('.');
      var reqRoute = 'system.' + arr;

      for(var m = 0; m<$scope.menus.length; m++){

        var item = $scope.menus[m]
        if(!item.role_id) continue;
        if( reqRoute == item.route){
          return;
        }
        if(item.child){
          for(var n = 0; n <item.length; n++){
            var child = item[n];
            if(child.role_id && reqRoute == child.route){
              return;
            }
          }
        }
      }

      for(var i = 0;i< $scope.menus.length; i++){

        var item = $scope.menus[i]
        if(!item.role_id) continue;
        if(item.route){
          $state.go(item.route);
          $scope.Global.messages.date = {msg:'你无权访问，已为你跳转新页面！',type:'danger'};
          return;
        }
        else if(item.child && item.child[0].route){
          $state.go(item.child[0].route);
          $scope.Global.messages.date = {msg:'你无权访问，已为你跳转新页面！',type:'danger'};
          return;
        }
      }
    }

  }];
  return controllerObj;
});
