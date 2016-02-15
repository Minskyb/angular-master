/**
 * Created by ASUS on 2015/9/7.
 */
(function($){

  Array.prototype.toArr = function(key){
    var result = [],self = this,length=self.length;
    for (var i=0;i<length;i++){
      result.push(self[i][key]);
    }
    return result;
  };

  /*jquery extend*/
  $.fn.extend({
    // 把 form 序列化为 key-value 集合，也就是整合到一个对象中，而不是如 serializeArray 那样一个 key-value 为一个对象。
    serializeObject:function(){
      var srcArr = this.serializeArray(),i, result = {};
      if(!srcArr.length) return;
      for( i in srcArr){
        result[srcArr[i].name] = srcArr[i].value;
      }
      return result;
    }
  });

  $.extend({
    //vhost:"http://120.25.66.245",
    //vhost:"http://192.168.20.16",
    vhost:"http://192.168.20.237",
    // 把 key-value 数据对象集，转换为 key=value& 字符串；
    JsonToFormData:function(JSONData){

      var arr = [];

      for(var key in JSONData){
        arr.push(key+"="+encodeURIComponent(JSONData[key]));
      }

      return arr.join("&");
    },
    resetObject:function(obj){
      for(var key in obj){
        obj[key] = undefined;
      }
    }
  });
})(jQuery)
