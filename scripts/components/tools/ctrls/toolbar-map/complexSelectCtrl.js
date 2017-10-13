/**
 * Created by wuzhen on 2016/11/22.
 */
angular.module('app').controller('complexSelectCtrl', ['$scope', '$ocLazyLoad', 'dsEdit',
    function ($scope, $ocLazyLoad, dsEdit) {
        var layerCtrl = fastmap.uikit.LayerController();
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var rdLink = layerCtrl.getLayerById('rdLink');
        var rdNode = layerCtrl.getLayerById('rdNode');
        var workPoint = layerCtrl.getLayerById('workPoint');
        var eventController = fastmap.uikit.EventController();
        var highlightCtrl = FM.mapApi.render.HighlightController.getInstance();
        var objCtrl = fastmap.uikit.ObjectEditController();
        // var compare = new fastmap.dataApi.geoDataModelComparison();
        var editControlFactory = fastmap.uikit.editControl.EditControlFactory.getInstance();

        // 高亮点或者线
        var highLightObj = function (arr, type) {
            highlightCtrl.clear();
            if (arr.length > 0) {
                if (type === 'line') {
                    var rdLinkArr = {
                        rowId: '0',
                        pid: 0,
                        geoLiveType: 'RDLINKARR',
                        RDLINK: arr
                    };
                    highlightCtrl.highlight(rdLinkArr);
                } else if (type === 'point') {
                    var rdNodeArr = {
                        rowId: '0',
                        pid: 0,
                        geoLiveType: 'RDNODEARR',
                        RDNODE: arr
                    };
                    highlightCtrl.highlight(rdNodeArr);
                }
            }
        };
        // 字符数组转为数字数组
        var strToInt = function (arr) {
            if (arr.length === 0) {
                return arr;
            }
            var returnArr = [];
            for (var i = 0; i < arr.length; i++) {
                returnArr.push(parseInt(arr[i], 10));
            }
            return returnArr;
        };

        $scope.selectShape = function (e, type) {
            if (map.getZoom() < 17) {
                swal('提示', '地图缩放等级必须大于16级才可操作', 'info');
                return;
            }
            // 开始启动工具
            $scope.$emit('Map-EnableTool', null);

            var finalLinkPids = [];
            if (type === 'RDLINK') {
                tooltipsCtrl.setCurrentTooltip('请框选rdLInk！');
                map.currentTool = new fastmap.uikit.SelectForRectang({
                    map: map,
                    shapeEditor: shapeCtrl,
                    LayersList: [rdLink]
                });
                map.currentTool.enable();
                eventController.off(eventController.eventTypes.GETRECTDATA);
                eventController.on(eventController.eventTypes.GETRECTDATA, function (event) {
                    var data = event.data;
                    var linkPids = [];
                    for (var i = 0, len = data.length; i < len; i++) {
                        linkPids.push(data[i].data.properties.id);
                    }
                    linkPids = Utils.distinctArr(linkPids);
                    finalLinkPids = $scope.diffData(finalLinkPids, linkPids);
                    finalLinkPids = strToInt(finalLinkPids);

                    // highLightObj(finalLinkPids, 'line');

                    if (finalLinkPids.length === 0) {
                        tooltipsCtrl.setCurrentTooltip('没有框选到符合条件的数据！', 'warn');
                        highlightCtrl.clear();
                        return;
                    }
                    tooltipsCtrl.setCurrentTooltip('框选到' + finalLinkPids.length + '条符合条件的数据！', 'succ');
                    var featureArr = {
                        features: []
                    };
                    for (var j = 0; j < finalLinkPids.length; j++) {
                        featureArr.features.push({
                            id: finalLinkPids[j],
                            geoLiveType: 'RDLINK'
                        });
                    }
                    $scope.$emit('BatchEdit', featureArr);
                    // dsEdit.getByPids(finalLinkPids, 'RDLINK').then(function (res) {
                    //     $scope.$emit('BatchEdit', res);
                    //     // objCtrl.datas = res;
                    //     // objCtrl.setCurrentObject(type, res);
                    //     //
                    //     // var ctrl = appPath.road + 'ctrls/attr_link_ctrl/rdLinkCtrl';
                    //     // var tpl = appPath.root + appPath.road + 'tpls/attr_link_tpl/rdLinkTpl.html';
                    //     //
                    //     //
                    //     // $scope.$emit('transitCtrlAndTpl', {
                    //     //     loadType: 'attrTplContainer',
                    //     //     propertyCtrl: ctrl,
                    //     //     propertyHtml: tpl
                    //     // });
                    // });
                });
            } else if (type === 'RDNODE') {
                tooltipsCtrl.setCurrentTooltip('请框选rdNode！');
                map.currentTool = new fastmap.uikit.SelectForRectang({
                    map: map,
                    shapeEditor: shapeCtrl,
                    LayersList: [rdNode]
                });
                map.currentTool.enable();
                eventController.off(eventController.eventTypes.GETRECTDATA);
                eventController.on(eventController.eventTypes.GETRECTDATA, function (event) {
                    var data = event.data;
                    var linkPids = [];
                    for (var i = 0, len = data.length; i < len; i++) {
                        linkPids.push(data[i].data.properties.id);
                    }
                    linkPids = Utils.distinctArr(linkPids);
                    finalLinkPids = $scope.diffData(finalLinkPids, linkPids);
                    finalLinkPids = strToInt(finalLinkPids);


                    // highLightObj(finalLinkPids, 'point');

                    if (finalLinkPids.length === 0) {
                        tooltipsCtrl.setCurrentTooltip('没有框选到符合条件的数据！', '');
                        highlightCtrl.clear();
                        return;
                    }
                    tooltipsCtrl.setCurrentTooltip('框选到' + finalLinkPids.length + '条符合条件的数据！', 'succ');

                    var featureArr = {
                        features: []
                    };
                    for (var j = 0; j < finalLinkPids.length; j++) {
                        featureArr.features.push({
                            id: finalLinkPids[j],
                            geoLiveType: 'RDNODE'
                        });
                    }
                    $scope.$emit('BatchEdit', featureArr);
                    // dsEdit.getByPids(finalLinkPids, 'RDNODE').then(function (res) {
                    //     console.info(res);
                    //     $scope.$emit('BatchEdit', res);
                    // });
                });
            } else if (type === 'TRACK_RDLINK') { // 追踪选rdlink
                tooltipsCtrl.setCurrentTooltip('请先选择进入线！');
                map.currentTool = new fastmap.uikit.SelectForRestriction({
                    map: map,
                    currentEditLayer: rdLink,
                    shapeEditor: shapeCtrl,
                    operationList: ['line', 'point']
                });
                map.currentTool.enable();
                map.currentTool.snapHandler.addGuideLayer(rdLink); // 添加自动吸附的图层
                var linkId,
                    nodeId;
                eventController.off(eventController.eventTypes.GETLINKID);
                eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                    var direct;
                    // 清除吸附的十字
                    map.currentTool.snapHandler.snaped = false;
                    map.currentTool.clearCross();
                    map.currentTool.snapHandler._guides = [];
                    if (data.index === 0) {
                        direct = data.properties.direct;
                        linkId = data.id;

                        highLightObj([linkId], 'line');

                        if (direct === '3') { //  3逆方向
                            nodeId = data.properties.snode;
                            map.currentTool.selectedFeatures.push(nodeId);
                        } else if (direct === '2') { // 2顺方向
                            nodeId = data.properties.enode;
                            map.currentTool.selectedFeatures.push(nodeId);
                        } else {
                            tooltipsCtrl.setCurrentTooltip('请选择进入点！');
                            map.currentTool.snapHandler.addGuideLayer(rdNode);
                            return;
                        }
                    } else if (data.index === 1) {
                        nodeId = data.id;
                        map.currentTool.selectedFeatures.push(nodeId);
                    }
                    if (linkId && nodeId && data.index <= 1) {
                        var param = {
                            command: 'CREATE',
                            dbId: App.Temp.dbId,
                            type: 'RDLINK',
                            data: {
                                linkPid: linkId,
                                nodePidDir: nodeId,
                                loadChild: 1 // 表示查询关联的子表信息
                            }
                        };
                        dsEdit.getByCondition(param).then(function (res) {
                            if (res.errcode === 0) {
                                var lines = [];
                                var featureArr = {
                                    features: []
                                };
                                for (var i = 0; i < res.data.length; i++) {
                                    lines.push(res.data[i].pid);
                                    featureArr.features.push({
                                        id: res.data[i].pid,
                                        geoLiveType: 'RDLINK'
                                    });
                                }
                                // highLightObj(lines, 'line');
                                $scope.$emit('BatchEdit', featureArr);
                                // $scope.$emit('BatchEdit', res);
                            }
                        });
                    }
                });
            } else if (type === 'TIPS') {
                var currentTool = editControlFactory.batchModifyControl(map, { originObject: { geoLiveType: 'BATCHMODIFYTIPS' } });
                currentTool.run();
                eventController.off(L.Mixin.EventTypes.OBJECTSELECTED);
                eventController.on(L.Mixin.EventTypes.OBJECTSELECTED, function (data) {
                    $scope.$emit('BatchEditTips', data.features);
                });
            }
            // 工具启动成功
            if (map.currentTool && map.currentTool.enabled()) {
                $scope.$emit('Map-ToolEnabled', {
                    event: e,
                    tool: map.currentTool,
                    operationType: 'EDIT'
                });
            }
        };
        $scope.diffData = function (src, desc) {
            if (src.length === 0) {
                return desc;
            } else if (desc.length === 0) {
                return src;
            }
            var srcObj = $scope.arrToObject(src);
            var descObj = $scope.arrToObject(desc);
            for (var item in descObj) {
                if (srcObj[item]) {
                    delete srcObj[item];
                } else {
                    srcObj[item] = true;
                }
            }
            return Object.keys(srcObj);
        };

        /**
         * 将数组去重后转为对象
         * @param arr
         * @returns {{}}
         */
        $scope.arrToObject = function (arr) {
            var obj = {};
            for (var i = 0, len = arr.length; i < len; i++) {
                obj[arr[i]] = true;
            }
            return obj;
        };
    }
]);
