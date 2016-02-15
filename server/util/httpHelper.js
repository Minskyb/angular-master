/**
 * Created by ASUS on 2015/8/14.
 */
var http = require('http');
var urlUtil = require('url');

exports.request = request;
exports.query = query;

/*
* function request for post put delete request
* obj{
*    url:'',
*   type:'',
*   data:'',
*   res:''
* }
* */
 function request(obj){

  var urlParsed = urlUtil.parse(obj.url);
  var options = {
    hostname:urlParsed.hostname,
    port:urlParsed.port,
    path:urlParsed.path,
    method:obj.type,
    headers: {
      //'Content-Type': 'application/json;charset=utf-8'
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }

  };

  var req = http.request(options,function(res){
    var chunks = [],
      size = 0;
    res.on('data',function(data){
      chunks.push(data);
      size += data.length;
    });
    res.on('end',function(){

      var buf = Buffer.concat(chunks, size);

      //try{
      //  var result = JSON.parse(buf.toString());
      //}
      //catch(e) {
      //  obj.res.send({'state':-1,'msg':'数据解析错误:'+ e.message});
      //  console.log(new Date().toLocaleString()+"\n"+JSON.stringify(options)+'\n数据解析错误:'+ e.message+"\n"+buf.toString()+"\n");
      //}
      //if(result){
      //  obj.res.send({'state':1,'data':JSON.parse(buf.toString())});
      //}

      obj.res.send(buf.toString());
    });
  }).on('error',function(e){
    obj.res.send({'state':-1,'msg':e.message});
  });
  //req.write(JSON.stringify(obj.data));// 发送 json 字符串格式数据
  req.write(format(obj.data));     // 发送 key=value$key=value 格式数据
  req.end();
};

/*;
 * query function for get request
 * obj{
 *    url:'',
 *   response:''
 * }
 * */
function query(obj){

    http.get(obj.url,function(res){
        var chunks = [],
            size = 0;
        res.on('data',function(data){
            chunks.push(data);
            size += data.length;
        });
        res.on('end',function(){
            var buf = Buffer.concat(chunks, size);

          //  try{
          //    var result = JSON.parse(buf.toString());
          //  }
          //  catch(e) {
          //    obj.res.send({'state':-1,'msg':'数据解析错误'+e});
          //    console.log(new Date().toLocaleString()+"\n"+'\n数据解析错误:'+ e.message+"\n"+buf.toString()+"\n");
          //  }
          //if(result){
          //  obj.res.send({'state':1,'data':JSON.parse(buf.toString())});
          //}

          obj.res.send(buf.toString());
        });
    }).on('error',function(err){
        obj.res.send({'state':-1,'msg':err.message});
    });
};

/*
* 格式化数据，
* @param obj json 对象
* return key=value$key=value 字符串
* */
function format(obj){
  var back = "";
  for(var key in obj){
    back += "&"+key;
    back +="="+obj[key];
  }
  return back.substr(1);
};
