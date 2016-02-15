/**
 * Created by ASUS on 2015/9/11.
 */
'use strict'

define([],function(){

  var treeHelper = function(data){
    this.data = data;
  };

  /*
  * 返回被选中项
  * @param key 返回关键字，subName 子树 bl 是否编辑被选中父节点后的子节点
  * */
  treeHelper.prototype.getChecked = function(key,subName,bl){
    var arr=[];

    if(!arguments.length) key='nodeId',subName='child';

    var checkChild = function(data){
     data.forEach(function(item,index,array){
       if (item.isChecked) arr.push(item[key]);

       if(!!item[subName] && item[subName].length){
         if(item.partChecked) checkChild(item[subName]);
         if(item.isChecked && !!bl) checkChild(item[subName]);
       }
      });
    };

    checkChild(this.data);

    return arr
  };

  return treeHelper;
});
