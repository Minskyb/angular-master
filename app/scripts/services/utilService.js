/**
 * Created by ASUS on 2015/9/6.
 */

'use strict'

define([],function(){
  var utilObj = {};

  utilObj.utilService =function(){
    return {
      /*
       * 表格数据格式化
       * @dataTable:Array 元素数据格式如下：[{key:value,key:value...},{},{}] 每个obj 代表一行数据
       * @filter:Array 过滤数组 [key1,key2,key3] 每个 key 值代表 dataTable 中 obj（每行）数据中的 key 值。
       * 返回值：[[{v:value},{v:value}..],[{},{}...],[]...] ,第二层数组代表行，第二层数据中的对象，代表每行中的列值，v 对应的值为表格数据。
       * 作用：1、过滤出 filter 中指定的数据
       *       2、如果 filter 中的 key 值不存在于 dataTable 中，则把 value=key
       *       3、最后输出的每行 中的列数据，更具 filter 中的数组值排序、
       * */
      dataTableFormat:function (dataTable,filter,colType){
        var result =[];
        var row,col,i, j,iLen,jLen;

        var splitCol = function(colType){
          // 根据 colType 决定解析数据方式
          switch (colType){
            case '2':
              break;
            default :
              col.v = "undefined" == typeof dataTable[i][filter[j]] ? filter[j] :dataTable[i][filter[j]];
              break;
          }
          return
        };

        iLen = dataTable.length;
        jLen = filter.length;
        for(i=0;i<iLen;i++){
          row = [];
          for(j=0;j<jLen;j++){
            col = {};
            "undefined" == typeof colType ?col.v = dataTable[i][filter[j]]?dataTable[i][filter[j]]:filter[j]:splitCol(colType[j]);
            row.push(col);
          }
          result.push(row);
        }

        return result;
      },

      /*
       *数据过滤
       * @data:Array 元素数据格式如下：[{},{},{}...] 每个 obj 代表一行数据
       * @filter:Array 过滤数组[]
       * 返回值和@data 格式一样，只是把原始数据过滤及排序了。
       * */
      dataFormat:function(data,filter){
      var result = [];
      var row, i,j,iLen,jLen;
      iLen = data.length;
      jLen = filter.length;
      for(i=0;i<iLen;i++){
        row = {};
        for(j=0;j<jLen;j++){
          row[filter[j]] = data[i][filter[j]] ?data[i][filter[j]]:'';
        }
        result.push(row);
      }

      return result;
    },

      /*医生认证子表拼凑
      * @param data 数据源 {key1:value1；key2:value2;....} 行数据，key-value 键值对
      * @param headers 列头信息 [{key:string,name:string2...},{},{}...] 每个 obj 代表一列，其中 key 对应 data 数据中 keyn
      * */
      getEdit:function(){
        var str = "";

        str +="<div class='col-md-4 col-sm-6'><div class='edit' style='margin-top: 20px;' ng-click='edit($event)'><button class='btn btn-primary'>编辑</button ></div>" +
        "<div class='snc' style='display: none;margin-top: 20px;' ng-click='editSNC($event)'>" +
          "<button class='btn btn-primary' type='submit' style='margin-right: 20px;' >确定</button>" +
          "<button class='btn btn-primary' type='cancel'>取消</button>" +
        "</div></div>"

        return str;
      },

      getSubTableVerify:function(data,headers){
        var str ="";
        headers.forEach(function(head){
          switch (head.type+":"+head.edit){
            case "text:true":
              str +="<div class='margin-bottom-10px col-sm-"+(head.width ? head.width : 4)+(head.offset?' col-sm-offset-'+head.offset:'')+"'><label for="+head.key+">"+head.name+"：</label>" +
              "<input class='form-control' type='text' disabled  name="+head.key+" placeholder="+data[head.key]+" value="+data[head.key]+"></div>"
              break;
            case "text:undefined":
              str +="<div class='margin-bottom-10px col-sm-"+(head.width ? head.width : 4)+(head.offset?' col-sm-offset-'+head.offset:'')+"'><label for="+head.key+">"+head.name+"：</label><label name="+head.key+">"+data[head.key]+"</label></div>"
              break;
            case "textarea:true":
            case "textarea:undefined":
              str +="<div class='margin-bottom-10px col-sm-"+(head.width ? head.width : 4)+(head.offset?' col-sm-offset-'+head.offset:'')+"'><label for="+head.key+">"+head.name+"：</label><textarea name="+head.key+" class='form-control' disabled placeholder="+data[head.key]+" >"+data[head.key]+"</textarea></div>"
              break;
            case "img:true":
            case "img:undefined":
              var src = data[head.key].length?data[head.key]:"/";
              str +="<div class='margin-bottom-10px col-sm-"+(head.width ? head.width : 4)+(head.offset?' col-sm-offset-'+head.offset:'')+"'><label for="+head.key+">"+head.name+":</label>" +
              "<a href='javascript:void(0)' title='点击查看大图' ng-click=showBigPic('"+head.name+"','"+src+"')><img src="+src+"></a></div>"
              break;
            case "hide:true":
            case "hide:undefined":
              break;
            case "download:true":
            case "download:undefined":
              str +="<div class='margin-bottom-10px col-sm-"+(head.width ? head.width : 4)+(head.offset?' col-sm-offset-'+head.offset:'')+"'><label for="+head.key+">"+head.name+"：</label>"
              for(var i = 0 ;i<data[head.key].length; i++){
                var item = data[head.key][i];
                str += "<a href='"+item.url+"' title='点击下载' style='margin-right:20px;'>"+item.f_id+"."+item.f_type+"</a>" ;
              }
              str += "</div>";

              break;
            default :
              str +="<div class='margin-bottom-10px col-sm-"+(head.width ? head.width : 4)+(head.offset?' col-sm-offset-'+head.offset:'')+"'><label for="+head.key+">"+head.name+"：</label><label name="+head.key+">"+data[head.key]+"</label></div>"
              break;
          }
        });
        return str;
      },

      getDoctorVerified:function(){
        var str="";

        str += "<div class='col-md-4 col-sm-6' style='padding-top: 27px;'>" +
        "<label>审核状态：</label>" +
        "<input type='radio' name='action' value='1'>通过 "+
        "<input type='radio' name='action' value='2'>未通过 "+
        "</div>" +
        "<div class='col-md-4 col-sm-6'>" +
        "<label for='reason'>原因：</label>" +
        "<textarea style='width:80%' name='reason'  class='form-control'></textarea>"+
        "</div>" +
        "<div class='col-md-4 col-sm-6' style='padding-top: 20px;'>" +
        "<button  class='btn-primary btn' ng-click='updateEnsure($event)' style='margin-right: 20px;'>提交</button>"+
        "<button  class='btn-primary btn' ng-click='updateCancel($event)'>清空</button>"+
        "</div>"

        return str;
      }
  }
  };

  return utilObj
});
