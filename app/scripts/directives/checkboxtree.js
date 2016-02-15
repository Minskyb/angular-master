/**
 * Created by ASUS on 2015/8/17.
 *
 * 树形结构插件
 *
 * 触发事件：editTreeClicked
 *
 */
'use strict'

define([],function(){

  var obj = {};

  function compile(element,$compile,link){
    // Normalize the link parameter
    if(angular.isFunction(link)){
      link = { post: link };
    }

    // Break the recursion loop by removing the contents
    var contents = element.contents().remove(); // 移除内容
    var compiledContents;
    return {
      pre: (link && link.pre) ? link.pre : null,
      /**
       * Compiles and re-adds the contents
       */
      post: function(scope, element){
        // Compile the contents
        if(!compiledContents){
          compiledContents = $compile(contents);// 动态编译添加元素
        }
        // Re-add the compiled contents to the element
        // 把编译后的文档重新加载进入元素中。
        compiledContents(scope, function(clone){
          element.append(clone);
        });

        // Call the post-linking function, if any
        if(link && link.post){
          link.post.apply(null, arguments);
        }
      }
    };
  }

  obj.checkboxtree =['$compile',function($compile){

    return{
      restrict:'EA',
      replace:true,
      scope:{
        data:'=',
        isCheckbox:'@'
      },
      templateUrl:'../../views/directivesTpl/checkboxtree.html',
      compile: function(element){
        return compile(element,$compile,{
          pre:function(){
            //console.log("fuck");
          },
          post:function(){
            //console.log("fuck too");
          }
        });
      },

      controller:function($scope,$element,$attrs,$transclude){

        // 是否展示 checkbox 默认 false
        $scope.isCheckbox =  !!$scope.isCheckbox ? $scope.isCheckbox:"false";

        /*
        * 节点状态切换
        * @param node 待切换节点
        * */
        $scope.toggleCheck = function(node){

          //console.log(this);
          node.isChecked = !node.isChecked;
          node.partChecked = false;

          /*有子节点，遍历子节点*/
          if(node.child){
            changeChildNode(node.child,node.isChecked);
          }
        };

        /*编辑点击按钮*/
        $scope.edit = function(data){
          $scope.$emit('editTreeClicked',{nodeId:data});
        };

        /*
        * 改变子节点状态
        * @param tree 子树
        * flage 状态
        * */
        function changeChildNode(tree,flage){
          var i = 0,len = tree.length;
          for(;i<len;i++){
            tree[i].isChecked = flage;
            if(!!tree[i].child){
              changeChildNode(tree[i].child,flage);
            }
          };
        };


        /*
        * 监听节点状态，根据子节点状态修改父节点状态
        * 弊端：节点的展开和收缩同样会触发一次此事件。
        * */
        $scope.$watch(function(){return $scope.data},function(newValue,oldValue){

          if(!newValue||newValue==oldValue)
            return;

          // 父级遍历
          var len = newValue.length;
          for(var i= 0;i<len;i++){
            if(newValue[i].child){
             var childLen = newValue[i].child.length
               ,checkedNum= 0
               ,isPartChecked = false;

              // 子级遍历
              for(var j=0;j<childLen;j++){
                if(newValue[i].child[j].isChecked)
                  checkedNum++;
                else if(!isPartChecked && newValue[i].child[j].partChecked)
                  isPartChecked = true;
                else
                  continue;
              }
              // 根据子级选中个数决定父级状态
              switch (checkedNum){
                case 0:
                  newValue[i].isChecked = false;
                  newValue[i].partChecked = isPartChecked ? true:false;
                      break;
                case childLen:
                  newValue[i].isChecked = true;
                  newValue[i].partChecked = false;
                      break;
                default :
                  newValue[i].isChecked = false;
                  newValue[i].partChecked = true;
                      break;
              }
            }
          }
        },true);
      }

    };
  }];

  return obj;

});
