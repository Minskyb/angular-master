
'use strict';

require.config({
	baseUrl:'scripts',
	/*paths 的作用是把后期需要用到的外部 js 代码的地址重命名一次，即用一个简短名代替以前又长又难记的名字*/
	paths:{
		'jquery':'../bower_components/jquery/dist/jquery.min',
		'angular':'../bower_components/angular/angular.min',/*数据绑定*/
		'ngAnimate':'../bower_components/angular-animate/angular-animate',
		'bootstrap':'../bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.min',/*样式*/
    'datepicker':'../bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.min',/*样式*/
		'ngResource':'../bower_components/angular-resource/angular-resource',/*http 请求*/
		'uiRoute':'../bower_components/angular-ui-router/release/angular-ui-router',/*继承路由*/
		'underscore':'../bower_components/underscore/underscore',
		'highcharts':'../bower_components/highcharts/highcharts.src',
		'MD5':'util/MD5',
    'extendJquery':'util/extendJquery',
    'editor':'util/froala_editor.min',
    'editor_tables':'util/editor_plugins/tables.min',
    'editor_lists':'util/editor_plugins/lists.min',
    'editor_colors':'util/editor_plugins/colors.min',
    'editor_media_manager':'util/editor_plugins/media_manager.min',
    'editor_font_family':'util/editor_plugins/font_family.min',
    'editor_font_size':'util/editor_plugins/font_size.min',
    'editor_block_styles':'util/editor_plugins/block_styles.min',
    'editor_video':'util/editor_plugins/video.min'
	},
	/*指明外部 js 之间的依赖关系*/
	shim: {
		'angular': {
			exports: 'angular'
		},
		'bootstrap':{
			deps:['jquery'],
			exports:'bootstrap'
		},
		'ngAnimate': {
			deps: ['angular'],
			exports: 'ngAnimate'
		},
		'ngMessages':{
			deps:['angular'],
			exports:'ngMessages'
		},
		'ngResource': {
			deps: ['angular'],
			exports: 'ngResource'
		},
		'ngCookies': {
			deps: ['angular'],
			exports: 'ngCookies'
		},
		'ngSanitize': {
			deps: ['angular'],
			exports: 'ngSanitize'
		},
		'uiRoute': {
			deps: ['angular'],
			exports: 'uiRoute'
		},
		// 'ngTouch':{
		// 	deps:['ngTouch'],
		// 	exports:'ngTouch'
		// },
		'underscore': {
			exports: 'underscore'
		},
		'ngTranslate':{
			deps:['angular'],
			exports:'ngTranslate'
		},
		'ngTranslateloader':{
			deps:['ngTranslate'],
			exports:'ngTranslateloader'
		},
		'highcharts':{
			deps:['jquery'],
			exports:'highcharts'
		},
    'extendJquery':{
      deps:['jquery'],
      exports:'extendJquery'
    },
    'editor':{
      deps:['jquery',''],
      exports:'editor'
    },
    'editor_tables':{deps:['jquery','editor']},
    'editor_lists':{deps:['jquery','editor']},
    'editor_colors':{deps:['jquery','editor']},
    'editor_media_manager':{deps:['jquery','editor']},
    'editor_font_family':{deps:['jquery','editor']},
    'editor_font_size':{deps:['jquery','editor']},
    'editor_block_styles':{deps:['jquery','editor']},
    'editor_video':{deps:['jquery','editor']}
	}
});

require(['app'],function(app){
	app.initialize();
	console.log('angular app started !');
});
