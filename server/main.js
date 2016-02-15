/**
 * Created by huan.li on 2015/3/17.
 */

/*一个简易的 Web 框架*/
var express = require('express');
/*拿来做字符串拼接用*/
var path = require('path');
var http = require('http');
var httpHelper = require('./util/httpHelper')

//var vhost = 'http://120.25.66.245:80';
var vhost = 'http://192.168.20.16:80';
//var vhost = 'http://192.168.20.15:3030';
//var vhost = 'http://192.168.20.237:80';

/**/
var cookieParser = require('cookie-parser');
/**/
var bodyParser = require('body-parser');
/*获得一个对象*/
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
/*静态路径设置*/
app.use(express.static(path.join(__dirname, '../app')));

/**/
app.get("*",function(req,res){
    // 默认填充
    vhost = !!req.query.targetHost ? req.query.targetHost:vhost;

    httpHelper.query({
       url:vhost+req.url,
       res:res
    });
});

app.post("*",function(req,res){

    // 默认填充
    vhost = !!req.query.targetHost ? req.query.targetHost:vhost;

    httpHelper.request({
      url:vhost+req.url,
      type:'POST',
      data:req.body,
      res:res
    });
});

app.put("*",function(req,res){

  // 默认填充
  vhost = !!req.query.targetHost ? req.query.targetHost:vhost;

  httpHelper.request({
    url:vhost+req.url,
    type:'PUT',
    data:req.body,
    res:res
  });
});

app.delete("*",function(req,res){

  // 默认填充
  vhost = !!req.query.targetHost ? req.query.targetHost:vhost;

  httpHelper.request({
    url:vhost+req.url,
    type:'DELETE',
    data:req.body,
    res:res
  });
});

module.exports = app;
