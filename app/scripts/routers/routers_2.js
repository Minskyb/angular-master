'use strict';

define([],function(){

  return {
    route: [
      {
        title: '布局',
        abstract: true,
        route: 'system',
        url: '',
        templateUrl: 'views/app.html',
        controller: 'appController'
      },
      {
        title: '登录',
        route: 'system.login',
        url: '/login',
        templateUrl: '../../views/system/login.html',
        controller: 'loginController'
      },
      {
        title: '诊所后台',
        abstract: true,
        route: 'system.clinic',
        url: '/clinic',
        templateUrl: '../../views/system/mainLayout.html',
        controller: 'mainLayoutController',
        submenus:[
          {
            title:'医生搜索',
            nodeid:9,
            route:'system.clinic.searchDoctor',
            url:'/searchDoctor',
            templateUrl:'views/searchDoctor/searchDoctor.html',
            controller:'searchDoctorController'
          },
          {
            title:'认证申请',
            nodeid:10,
            submenus:[
              {
                title:'待审核',
                nodeid:12,
                route:'system.clinic.verifying',
                url:'/verifying',
                templateUrl:'../../views/verify/verifying.html',
                controller:'verifyingController'
              },
              {
                title:'已审核',
                nodeid:13,
                route:'system.clinic.verified',
                url:'/verified',
                templateUrl:'views/verify/verified.html',
                controller:'verifiedController'
              }
            ]
          },
          {
            title:'私家医生',
            nodeid:15,
            submenus:[
              {
                title:'待审核',
                nodeid:16,
                route:'system.clinic.waitVerify',
                url:'/waitVerify',
                templateUrl:'views/privateDoctor/waitVerify.html',
                controller:'waitVerifyController'
              },
              {
                title:'医生团队',
                nodeid:17,
                route:'system.clinic.doctorTeam',
                url:'/doctorTeam',
                templateUrl:'views/privateDoctor/doctorTeam.html',
                controller:'doctorTeamController'
              },
              {
                title:'档案管理',
                nodeid:18,
                route:'system.clinic.addArchive',
                url:'/addArchive',
                templateUrl:'../../views/privateDoctor/addArchive.html',
                controller:'addArchiveController'
              },
              {
                title:'档案查询',
                nodeid:19,
                route:'system.clinic.queryArchive',
                url:'/queryArchive',
                templateUrl:'../../views/privateDoctor/queryArchive.html',
                controller:'queryArchiveController'
              }
            ]
          },
          {
            title:'诊所',
            nodeid:20,
            route:'system.clinic.clinic',
            url:'/clinic',
            templateUrl:'views/clinic/clinic.html',
            controller:'clinicController'
          },
          {
            title:'权限管理',
            //role_id:1,
            submenus:[
              {
                title:'角色管理',
                role_id:1,
                route:'system.clinic.roleManage',
                url:'/roleManage',
                templateUrl:'views/authorityManagement/roleManage.html',
                controller:'roleManageController'
              },
              {
                title:'用户管理',
                //role_id:1,
                route:'system.clinic.userManage',
                url:'/userManage',
                templateUrl:'views/empty.html',
                controller:''
              }
            ]
          }
        ]
      }
    ]
  }
});
