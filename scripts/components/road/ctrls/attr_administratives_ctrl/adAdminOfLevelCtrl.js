/**
 * Created by liuzhaoxia on 2016/4/21.
 */
var adAdminZone = angular.module('app');
adAdminZone.controller('adAdminLevelController', ['$scope', 'dsEdit', function ($scope, dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var outputCtrl = fastmap.uikit.OutPutController({});
    $scope.selectId = null;
    // 获取层级划分方法
    var param = {
        type: 'ADADMINGROUP',
        dbId: App.Temp.dbId,
        data: {
            dbId: App.Temp.dbId
        }
    };
    var newZNodes = {};

    dsEdit.getByCondition({
        type: 'ADADMINGROUP',
        dbId: App.Temp.dbId,
        data: {
            subTaskId: App.Temp.subTaskId
        }
    }).then(function (data) {
        if (data) {
            $scope.initF(data.data);// 绘制层级
        }
    });

    $scope.initF = function (data) {
        newZNodes = $.extend({}, data);
        var log;
        var className = 'dark';
        // 拖动前执行方法
        function beforeDrag(treeId, treeNodes) {
            for (var i = 0, l = treeNodes.length; i < l; i++) {
                if (treeNodes[i].drag === false) {
                    return false;
                }
            }
            return true;
        }

        // 拖拽之前执行
        function beforeDrop(treeId, treeNodes, targetNode, moveType) {
            return targetNode ? targetNode.drop !== false : true;
        }
        // 修改名称之前执行
        function beforeEditName(treeId, treeNode) {
            className = (className === 'dark' ? '' : 'dark');
            var zTree = $.fn.zTree.getZTreeObj('treeDemo');
            zTree.selectNode(treeNode);
        }

        // 删除之前执行
        function beforeRemove(treeId, treeNode) {
            className = (className === 'dark' ? '' : 'dark');
            var zTree = $.fn.zTree.getZTreeObj('treeDemo');
            zTree.selectNode(treeNode);
            return confirm('确认删除 节点 -- ' + treeNode.name + ' 吗？');
        }
        // 判断类型
        function isArray(object) {
            return object && typeof object === 'object' &&
                Array == object.constructor;
        }
        var selectRegion = objCtrl.data;// 代表点数据
        /**
         *
         * @param itemNodes 复制的数据
         * @param treenode 拖拽的节点
         * @param targetNode 目标节点（父节点）
         * @param status 添加删除拖拽
         * @param ind
         */
        function upStatus(itemNodes, treenode, targetNode, status, ind) {
            var nodeName = '无';
            if (selectRegion.names && selectRegion.names.length > 0) {
                nodeName = selectRegion.names[0].name;
            }
            if (ind == 1 || ind == 3) { // 1查找要删除的节点或者3移动时查找子节点
                for (var j in itemNodes) {
                    if (status == 'drop' && targetNode != null) {
                        if (ind == 1) {
                            if ((isArray(targetNode) == true ? targetNode[0].regionId : targetNode.regionId) == itemNodes[j].regionId) {
                                if (itemNodes[j].group == null) { // 父节点
                                    itemNodes[j].group = {};
                                    itemNodes[j].group.groupId = 0;
                                    itemNodes[j].group.objType = 'insert';
                                }
                                treenode.part.groupId = itemNodes[j].group.groupId;
                                itemNodes[j].children.push(treenode);
                                break;
                            }
                        }
                    } else if (treenode.regionId == itemNodes[j].regionId) {
                        if (status == 'delete') {
                            itemNodes[j].part.objType = status;// 自身
                            if (itemNodes[j].group == null) {
                                itemNodes[j].group = {};
                            }
                            itemNodes[j].group.objType = status;

                            if (itemNodes[j].children.length > 0) {
                                upStatus(itemNodes[j].children, treenode, null, status, 2);
                            }
                            break;
                        } else if (status == 'insert') {
                            if (itemNodes[j].group == null) { // 父节点
                                itemNodes[j].group = {};
                                itemNodes[j].group.groupId = 0;
                                itemNodes[j].group.objType = status;
                            }
                            var chil = {
                                regionId: selectRegion.pid,
                                name: nodeName,
                                group: null,
                                part: {
                                    groupId: itemNodes[j].group.groupId,
                                    rowId: null,
                                    objType: status,
                                    regionIdDown: selectRegion.pid
                                },
                                children: []
                            };
                            itemNodes[j].children.push(chil);
                            break;
                        }
                    }
                    if (itemNodes[j].children.length > 0) {
                        for (var i in itemNodes[j].children) {
                            if (status == 'delete') {
                                if (treenode.regionId == itemNodes[j].children[i].regionId) {
                                    itemNodes[j].children[i].part.objType = status;// 自身
                                    if (itemNodes[j].children[i].group == null) {
                                        // itemNodes[j].children[i].group = {};
                                    } else {
                                        itemNodes[j].children[i].group.objType = status;
                                    }

                                    if (itemNodes[j].children[i].children.length > 0) {
                                        upStatus(itemNodes[j].children[i].children, treenode, null, status, 2);
                                    }
                                    break;
                                } else if (i == itemNodes[j].children.length - 1) {
                                    if (itemNodes[j].children.length > 0) {
                                        upStatus(itemNodes[j].children, treenode, null, status, 1);
                                    }
                                }
                            } else if (status == 'insert') {
                                if (treenode.regionId == itemNodes[j].children[i].regionId) {
                                    if (itemNodes[j].children[i].group == null) { // 父节点
                                        itemNodes[j].children[i].group = {};
                                        itemNodes[j].children[i].group.groupId = 0;
                                        itemNodes[j].children[i].group.objType = status;
                                    }
                                    chil = {
                                        regionId: selectRegion.pid,
                                        name: nodeName,
                                        group: null,
                                        part: {
                                            groupId: itemNodes[j].children[i].group.groupId,
                                            rowId: null,
                                            objType: status,
                                            regionIdDown: selectRegion.pid
                                        },
                                        children: []
                                    };
                                    itemNodes[j].children[i].children.push(chil);
                                    break;
                                } else if (i == itemNodes[j].children.length - 1) {
                                    if (itemNodes[j].children.length > 0) {
                                        upStatus(itemNodes[j].children, treenode, null, status, 1);
                                    }
                                }
                            } else if (status == 'drop') {
                                if (ind == 1 && targetNode != null) { // 寻找父节点数据，并保存拖拽节点数据
                                    if (targetNode.regionId == itemNodes[j].children[i].regionId) {
                                        if (itemNodes[j].children[i].group == null) { // 父节点
                                            itemNodes[j].children[i].group = {};
                                            itemNodes[j].children[i].group.groupId = 0;
                                            itemNodes[j].children[i].group.objType = 'insert';
                                        }
                                        treenode.part.groupId = itemNodes[j].children[i].group.groupId;
                                        itemNodes[j].children[i].children.push(treenode);
                                        break;
                                    } else if (i == itemNodes[j].children.length - 1) {
                                        if (itemNodes[j].children.length > 0) {
                                            upStatus(itemNodes[j].children, treenode, targetNode, status, 1);
                                        }
                                    }
                                } else if (ind == 3 && treenode != null) {
                                    if (((isArray(treenode) == true ? treenode[0].regionId : treenode.regionId) == itemNodes[j].children[i].regionId) && itemNodes[j].children[i].part.objType != 'delete') {
                                        if (itemNodes[j].children[i].part.objType == undefined) {
                                            itemNodes[j].children[i].part.objType = 'update';// 更新为修改
                                        }
                                        treenode = itemNodes[j].children[i];// 拖拽节点存储到treenode里面，去找父节点
                                        itemNodes[j].children.splice(i, 1);// 清除原数据里面的拖拽节点的数据
                                        upStatus(newZNodes, treenode, targetNode, status, 1);
                                    } else if (i == itemNodes[j].children.length - 1) {
                                        if (itemNodes[j].children.length > 0) {
                                            upStatus(itemNodes[j].children, treenode, targetNode, status, 3);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } else if (ind == 2) { // 查找要删除的子节点
                for (var m = 0; m < itemNodes.length; m++) {
                    itemNodes[m].part.objType = status;
                    if (itemNodes[m].group == null) {  // 没有group 表示 代表点没有父
                        // itemNodes[m].group = {};  // 不需要赋值
                    } else {
                        itemNodes[m].group.objType = status;
                    }
                    if (itemNodes[m].part.objType == undefined) {
                        itemNodes[m].part.objType = status;// 更新为修改
                    }
                    if (m == itemNodes.length - 1) {
                        if (itemNodes[m].children.length > 0) {
                            upStatus(itemNodes[m].children, treenode, null, status, 2);
                        }
                    }
                }
            }
        }
        // 删除
        function onRemove(e, treeId, treeNode) {
            upStatus(newZNodes, treeNode, null, 'delete', 1);
            $scope.saveTree();
        }


        // 用于捕获节点编辑名称结束（Input 失去焦点 或 按下 Enter 键）之后，更新节点名称数据之前的事件回调函数，并且根据返回值确定是否允许更改名称的操作
        function beforeRename(treeId, treeNode, newName, isCancel) {
            className = (className === 'dark' ? '' : 'dark');
            if (newName.length == 0) {
                alert('节点名称不能为空.');
                var zTree = $.fn.zTree.getZTreeObj('treeDemo');
                setTimeout(function () {
                    zTree.editName(treeNode);
                }, 10);
                return false;
            }
            return true;
        }

        // 用于捕获节点编辑名称结束之后的事件回调函数。
        function onRename(e, treeId, treeNode, isCancel) {
            // Todo
        }
        // 拖拽后调用方法
        function zTreeOnDrop(event, treeId, treeNodes, targetNode, moveType) {
            // alert(treeNodes[0].regionId);
            upStatus(newZNodes, treeNodes, targetNode, 'drop', 3);
            $scope.saveTree();
        }
        function removeHoverDom(treeId, treeNode) {
            $('#addBtn_' + treeNode.tId).unbind().remove();
        }

        // 添加数据
        function addHoverDom(treeId, treeNode) {
            var sObj = $('#' + treeNode.tId + '_span');
            if (treeNode.editNameFlag || $('#addBtn_' + treeNode.tId).length > 0) return;
            var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
                + "' title='add node' onfocus='this.blur();'></span>";
            sObj.after(addStr);
            var btn = $('#addBtn_' + treeNode.tId);
            if (btn) {
                btn.bind('click', function () {
                    var zTree = $.fn.zTree.getZTreeObj('treeDemo');
                    if (selectRegion != null) {
                        var nodeName = '无';
                        if (selectRegion.names && selectRegion.names.length > 0) {
                            for (var i = 0; i < selectRegion.names.length; i++) {
                                // 左侧行政区划树中始终添加标准化中文名称
                                if (selectRegion.names[i].langCode == 'CHI' && selectRegion.names[i].nameClass == 1) {
                                    nodeName = selectRegion.names[i].name;
                                }
                            }
                            // nodeName = selectRegion.names[0].name;
                        }
                        // 加个方法判断是否重复的regionid，不重复才可以添加
                        var chil = {
                            regionId: selectRegion.pid,
                            name: nodeName,
                            group: null,
                            part: {
                                groupId: (treeNode.group != null ? treeNode.group.groupId : 0),
                                rowId: null,
                                objType: status
                            },
                            children: []
                        };

                        var treeObj = $.fn.zTree.getZTreeObj('treeDemo');
                        var node = treeObj.getNodesByParam('regionId', selectRegion.pid, null);
                        if (node.length === 0) {
                            zTree.addNodes(treeNode, chil);
                            upStatus(newZNodes, treeNode, null, 'insert', 1);
                            $scope.saveTree();
                        } else {
                            swal('提示', '此编号已经存在!', 'info');
                        }
                    }
                    return false;
                });
            }
        }

        // ztree 方法定义
        var setting = {
            view: {
                addHoverDom: addHoverDom,
                removeHoverDom: removeHoverDom,
                selectedMulti: true
            },
            edit: {
                enable: true,
                editNameSelectAll: true,
                showRemoveBtn: true, // true 时都可以显示删除按钮
                showRenameBtn: false
            },
            data: {
                simpleData: {
                    enable: true,
                    idKey: 'regionId',
                    pIdKey: 'part'
                }
            },
            callback: {
                beforeEditName: beforeEditName,
                beforeRemove: beforeRemove,
                beforeRename: beforeRename,
                onRemove: onRemove,
                onRename: onRename,
                beforeDrag: beforeDrag, // 拖动方法
                beforeDrop: true,
                onDrop: zTreeOnDrop
            }
        };
        // 初始化ztree
        $.fn.zTree.init($('#treeDemo'), setting, data);
        var treeObj = $.fn.zTree.getZTreeObj('treeDemo');
        treeObj.expandAll(true);
        var node = treeObj.getNodesByParam('regionId', selectRegion.pid, null);
        treeObj.selectNode(node[0]);
        var newCount = 1;

        function showRemoveBtn(treeId, treeNode) {
            return !treeNode.isFirstNode;
        }

        function showRenameBtn(treeId, treeNode) {
            return !treeNode.isLastNode;
        }

        var bool = true;
        // 判断regionIds是否重复
        function isRepeatss(regionIds, itemNodes) {
            for (var j in itemNodes) {
                if (itemNodes[j].children.length > 0) {
                    for (var i in itemNodes[j].children) {
                        if (regionIds == itemNodes[j].children[i].regionId) {
                            bool = false;
                            break;
                        } else if (i == itemNodes[j].children.length - 1) {
                            if (itemNodes[j].children[i].children.length > 0) {
                                isRepeatss(regionIds, itemNodes[j].children);
                            }
                        }
                    }
                }
            }
            return bool;
        }
    };

    /*
     保存tree 数组
     */
    $scope.saveTree = function () {
        param = {
            command: 'UPDATE',
            type: 'ADADMINGROUP',
            dbId: App.Temp.dbId,
            data: {
                groupTree: newZNodes[0]
            },
            rowId: objCtrl.data.rowId
        };
        // var zNodes=[];
        // 保存调用方法
        dsEdit.save(param, function (data) {
            // 数据解析后有值的输出到output输出窗口

        });
    };
}]);
