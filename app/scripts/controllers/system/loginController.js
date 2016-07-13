/**
 * Created by ASUS on 2015/8/11.
 */
'use strict'
define(['MD5'],function(MD5){
  var controllerObj = {};

  controllerObj.loginController = ['$scope','$state','userService',function($scope,$state,userService){
  	console.log("in loginController");

	$scope.loginState = {
	  username:localStorage.getItem("username")|| '',
	  password:localStorage.getItem("password")|| '',
	  loginFailed:false,
	  rememberMe: !!localStorage.getItem("rememberMe")|| false,
    errorMsg:'',
    clickedOne:false
	};


    //登录处理
	$scope.loginSubmit = function(){

    $scope.loginState.clickedOne = true;

		// 如果用户点击了保存密码，则保存账户密码 否在清空历史记录。
		if($scope.loginState.rememberMe === true){

			localStorage.setItem("username",$scope.loginState.username);
			localStorage.setItem("password",$scope.loginState.password);
			localStorage.setItem("rememberMe",$scope.loginState.rememberMe);
		}
		else{
			localStorage.removeItem("username");
			localStorage.removeItem("password");
			localStorage.removeItem("rememberMe");
		}

    //console.log(MD5("hello world"));

    /*
     * 登录
     * */
    userService.login({'username':$scope.loginState.username,'password':$scope.loginState.password})
      .success(function(data){
       $scope.loginState.clickedOne = false;
        // 登录成功
          switch (data.code){
            //case 10000:
            //case 10001:
            //case 10003:
            //  $scope.loginState.loginFailed = true;
            //  $scope.loginState.errorMsg = data.msg;
            //      break;
            case 10002:
              $scope.Global.currentMenu = '医生搜索';
              $scope.Global.currentSubMenu ="";
              $scope.Global.menus =data.menus;
              $scope.Global.userinfo =data.userinfo;
              sessionStorage.setItem('Global.menus',JSON.stringify($scope.Global.menus));
              sessionStorage.setItem('Global.userinfo',JSON.stringify($scope.Global.userinfo));

              var route = data.menus[0].submenus ? data.menus[0].submenus[0].key : data.menus[0].key ;
              $state.go("system.clinic."+route);
                  break;
            default :
              $scope.loginState.loginFailed = true;
              $scope.loginState.errorMsg = "登录失败："+data.msg;
              break;

          }
      })
      .error(function(e){
        $scope.loginState.clickedOne = false;
        $scope.loginState.loginFailed = true;
        $scope.loginState.errorMsg = e;
      });

    /*
    * 模拟登录
    * */
    // if($scope.loginState.username =="demo" && $scope.loginState.password =="demo" ){
    //  $scope.Global.currentMenu = '医生搜索';
    //  $scope.Global.currentSubMenu ="";
    //  $state.go("system.clinic.searchDoctor");
    // }
    // else{
    //  $scope.loginState.loginFailed = true;
    // }

    //监听键盘点击事件
    $scope.keyUp = function($event){
      console.log("$event");
      var keyCode = window.event ? $event.keyCode : $event.which;
      if(keyCode == 13){
        $scope.loginSubmit();
      }
    }
	};

  }];
  return controllerObj;
})
