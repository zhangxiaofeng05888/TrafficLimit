/**
 * Created by liuyang on 2016/8/5.
 */
angular.module('app').controller('addRdBranchCtrl', ['$scope', '$ocLazyLoad', 'dsEdit', 'appPath', '$timeout',
    function ($scope, $ocLazyLoad, dsEdit, appPath, $timeout) {
        var layerCtrl = fastmap.uikit.LayerController();
        var featCodeCtrl = fastmap.uikit.FeatCodeController();
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var rdLink = layerCtrl.getLayerById('rdLink');
        var rdnode = layerCtrl.getLayerById('rdNode');
        var highRenderCtrl = fastmap.uikit.HighRenderController();
        var eventController = fastmap.uikit.EventController();
        var highlightCtrl = FM.mapApi.render.HighlightController.getInstance();
        $scope.branchRelation = {};


        /**
         * 添加geometry
         * @param type
         * @param num
         * @param event
         */
        $scope.addShape = function (event, geoLiveType) {
            // 大于17级才可以选择地图上各种geometry
            if (map.getZoom() < 17) {
                swal('提示', '地图缩放等级必须大于16级才可操作', 'info');
                return;
            }

            // 开始启动工具
            $scope.$emit('Map-EnableTool', null);

            featCodeCtrl.setFeatCode({});
            // 保存所有需要高亮的图层数组;
            var highLightFeatures = [];
            var linkDirect = 0;
            $scope.branchObj = {
                rowId: '0',
                pid: 0,
                geoLiveType: geoLiveType,
                inLinkPid: 0,
                nodePid: 0,
                outLinkPid: 0,
                sNodePid: 0,
                eNodePid: 0,
                vias: []
            };
            // 获取退出线并高亮;
            var getOutLink = function (dataId, data) {
                var i;
                var flag = true;
                // 方面分歧、方向看板、实景看板不能以9级及以下的link作为分歧退出线
                if ((geoLiveType == 1 || geoLiveType == 9 || geoLiveType == 6) && parseInt(data.properties.kind, 10) > 8) {
                    tooltipsCtrl.notify('不能以8级及以下的link作为分歧退出线', 'error');
                    map.currentTool.selectedFeatures.pop();
                    return;
                }
                // 高速分歧和IC分歧的进入线、退出线必须是城高或高速
                if ((geoLiveType == 0 || geoLiveType == 2) && (parseInt(data.properties.kind, 10) > 2)) {
                    tooltipsCtrl.notify('高速分歧和IC分歧的进入线、退出线必须是城高或高速', 'error');
                    map.currentTool.selectedFeatures.pop();
                    return;
                }
                // 连续分歧不能以1、2级以外路的link作为分歧进入线
                if (geoLiveType == 7 && (parseInt(data.properties.kind, 10) > 2)) {
                    tooltipsCtrl.notify('连续分歧的退出线不能为1、2级种别以外种别的道路', 'error');
                    map.currentTool.selectedFeatures.pop();
                    return;
                }
                // 实景图的进入线、经过线和退出线不能为9级路、10级路、步行街、公交车专用道、人渡、轮渡
                if (geoLiveType == 5 && ((parseInt(data.properties.kind, 10) == 9 || parseInt(data.properties.kind, 10) == 10 || parseInt(data.properties.kind, 10) == 11 || parseInt(data.properties.kind, 10) == 13) || (data.properties.form.split(';').indexOf('20') > -1 || data.properties.form.split(';').indexOf('22') > -1 || data.properties.form.split(';').indexOf('50') > -1))) {
                    tooltipsCtrl.notify('实景图的退出线不能为9级路、10级路、步行街、公交车专用道、人渡、轮渡、交叉口link', 'error');
                    map.currentTool.selectedFeatures.pop();
                    return;
                }
                // 3D分歧不能以10级路的link作为分歧进入线
                if (geoLiveType == 3 && (parseInt(data.properties.kind, 10) == 10 || parseInt(data.properties.kind, 10) == 11 || data.properties.form.split(';').indexOf('20') > -1)) {
                    tooltipsCtrl.notify('3D分歧不能以10级路、步行街和人渡的link作为分歧退出线', 'error');
                    map.currentTool.selectedFeatures.pop();
                    return;
                }
                for (i = 0; i < $scope.branchObj.vias.length; i++) {
                    if ($scope.branchObj.vias[i].linkPid == dataId) {
                        flag = false;
                        tooltipsCtrl.setCurrentTooltip('请重新选择退出线!');
                    }
                }
                if ($scope.branchObj.outLinkPid == dataId) {
                    flag = false;
                    tooltipsCtrl.setCurrentTooltip('请重新选择退出线!');
                }
                if (!flag) {
                    $scope.branchObj.outLinkPid = 0;
                    $scope.branchObj.vias = [];
                    highlightCtrl.clear();
                    highlightCtrl.highlight($scope.branchObj);
                } else {
                    var params;
                    params = {};
                    params.dbId = App.Temp.dbId;
                    params.type = 'RDLANEVIA';
                    params.data = {
                        inLinkPid: $scope.branchObj.inLinkPid,
                        nodePid: $scope.branchObj.nodePid,
                        outLinkPid: data.id,
                        type: 'RDBRANCH'
                    };
                    dsEdit.getByCondition(params).then(function (resultData) {
                        if (resultData !== -1) {
                            if (resultData.data[0].links.length > 15) {
                                tooltipsCtrl.notify('一组经过线个数不能超过15，请重新选择!', 'error');
                            }
                            if (resultData.data[0].hasOwnProperty('errInfo')) {
                                tooltipsCtrl.notify(resultData.data[0].errInfo, 'error');
                            } else {
                                $scope.branchObj.outLinkPid = dataId;
                                $scope.branchObj.vias = [];
                                for (i = 0; i < resultData.data[0].links.length; i++) {
                                    $scope.branchObj.vias.push({
                                        linkPid: resultData.data[0].links[i]
                                    });
                                }
                                // 判断是路口关系还是线线关系
                                if (parseInt(data.properties.snode, 10) == $scope.branchObj.nodePid || parseInt(data.properties.enode, 10) == $scope.branchObj.nodePid) {
                                    tooltipsCtrl.setCurrentTooltip('已选退出线，节点直接挂接，点击空格键保存!');
                                } else {
                                    tooltipsCtrl.setCurrentTooltip('已选退出线，线线连接，点击空格键保存!');
                                }
                                featCodeCtrl.setFeatCode($scope.branchObj);
                            }
                            highlightCtrl.clear();
                            highlightCtrl.highlight($scope.branchObj);
                            // 设置快捷键保存的事件类型供热键通过（shapeCtrl.editType）监听;
                            shapeCtrl.setEditingType('addBranch');
                        }
                    });
                }
                // $scope.branchObj.outLinkPid = dataId;
                if (highLightFeatures.length === 3) {
                    highLightFeatures.pop();
                }
            };
            var branchName = FM.uikit.Config.getName(geoLiveType);
            // 地图编辑相关设置;
            tooltipsCtrl.setEditEventType('rdBranch');
            tooltipsCtrl.setCurrentTooltip('正要新建' + branchName + '分歧,先选择线！');
            /* map.currentTool = new fastmap.uikit.SelectFeature({
                map: map,
                shapeEditor: shapeCtrl
            });*/
            map.currentTool = new fastmap.uikit.SelectForRestriction({
                map: map,
                createBranchFlag: true,
                currentEditLayer: rdLink,
                shapeEditor: shapeCtrl,
                operationList: ['line', 'point', 'line']
            });
            map.currentTool.enable();
            map.currentTool.snapHandler.addGuideLayer(rdLink); // 添加自动吸附的图层
            eventController.off(eventController.eventTypes.GETLINKID);
            eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                var selectData = data.properties;
                if (data.index === 0) {
                    // 高速分歧、IC分歧、实景看板的进入线必须为城高或高速
                    if ((geoLiveType == 0 || geoLiveType == 2 || geoLiveType == 6) && (parseInt(data.properties.kind, 10) > 2)) {
                        tooltipsCtrl.notify('进入线必须是城高或高速', 'error');
                        map.currentTool.selectedFeatures.pop();
                        return;
                    }
                    // 方面分歧、方向看板、实景看板不能以8级及以下的link作为分歧进入线
                    if ((geoLiveType == 1 || geoLiveType == 6 || geoLiveType == 9) && parseInt(data.properties.kind, 10) > 7) {
                        tooltipsCtrl.notify('不能以8级及以下的link作为分歧进入线', 'error');
                        map.currentTool.selectedFeatures.pop();
                        return;
                    }
                    // 3D分歧不能以9级路的link作为分歧进入线
                    if (geoLiveType == 3 && (parseInt(data.properties.kind, 10) == 9 || parseInt(data.properties.kind, 10) == 10 || parseInt(data.properties.kind, 10) == 11 || data.properties.form.split(';').indexOf('20') > -1)) {
                        tooltipsCtrl.notify('3D分歧不能以9级路、10级路、步行街和人渡的link作为分歧进入线', 'error');
                        map.currentTool.selectedFeatures.pop();
                        return;
                    }
                    // 实景图的进入线、经过线和退出线不能为9级路、10级路、步行街、公交车专用道、人渡、轮渡
                    if (geoLiveType == 5 && ((parseInt(data.properties.kind, 10) == 9 || parseInt(data.properties.kind, 10) == 10 || parseInt(data.properties.kind, 10) == 11 || parseInt(data.properties.kind, 10) == 13) || (data.properties.form.split(';').indexOf('20') > -1 || data.properties.form.split(';').indexOf('22') > -1 || data.properties.form.split(';').indexOf('50') > -1))) {
                        tooltipsCtrl.notify('实景图的进入线不能为9级路、10级路、步行街、公交车专用道、人渡、轮渡、交叉口link', 'error');
                        map.currentTool.selectedFeatures.pop();
                        return;
                    }
                    // 连续分歧不能以1、2级以外路的link作为分歧进入线
                    if (geoLiveType == 7 && (parseInt(data.properties.kind, 10) > 2)) {
                        tooltipsCtrl.notify('连续分歧的进入线不能为1、2级种别以外种别的道路', 'error');
                        map.currentTool.selectedFeatures.pop();
                        return;
                    }
                    // 清除吸附的十字
                    map.currentTool.snapHandler.snaped = false;
                    map.currentTool.clearCross();
                    map.currentTool.snapHandler._guides = [];

                    map.currentTool.snapHandler.addGuideLayer(rdnode);

                    tooltipsCtrl.setCurrentTooltip('已经选择进入线,选择进入点!');
                    $scope.branchObj.inLinkPid = selectData.id;
                    $scope.branchObj.sNodePid = selectData.snode;
                    $scope.branchObj.eNodePid = selectData.enode;
                    highlightCtrl.clear();
                    highlightCtrl.highlight($scope.branchObj);
                    linkDirect = parseInt(data.properties.direct, 10);
                    if (linkDirect == 2 || linkDirect == 3) {
                        $scope.branchObj.nodePid = linkDirect == 2 ? parseInt(data.properties.enode, 10) : parseInt(data.properties.snode, 10);
                        highlightCtrl.clear();
                        highlightCtrl.highlight($scope.branchObj);
                        map.currentTool.selectedFeatures.push($scope.branchObj.nodePid.toString());
                        tooltipsCtrl.setCurrentTooltip('已经选择进入点,选择退出线!');

                        // 清除吸附的十字
                        map.currentTool.snapHandler.snaped = false;
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];
                        map.currentTool.snapHandler.addGuideLayer(rdLink);
                    }
                } else if (data.index === 1) {
                    if (linkDirect == 2 || linkDirect == 3) {
                        getOutLink(data.id, data);
                    } else {
                        $scope.branchObj.nodePid = parseInt(data.id, 10);
                        highlightCtrl.clear();
                        highlightCtrl.highlight($scope.branchObj);
                        tooltipsCtrl.setCurrentTooltip('已经选择进入点,选择退出线!');

                        // 清除吸附的十字
                        map.currentTool.snapHandler.snaped = false;
                        map.currentTool.clearCross();
                        map.currentTool.snapHandler._guides = [];

                        map.currentTool.snapHandler.addGuideLayer(rdLink);
                    }
                } else if (data.index > 1) {
                    if (data.id == map.currentTool.selectedFeatures[0]) {
                        tooltipsCtrl.notify('进入线不能同时作为退出线', 'error');
                        map.currentTool.selectedFeatures.pop();
                        return;
                    }
                    getOutLink(parseInt(data.id, 10), data);
                }
            });

            // 启动工具成功
            if (map.currentTool.enabled()) {
                $scope.$emit('Map-ToolEnabled', {
                    event: event,
                    tool: map.currentTool,
                    operationType: 'ADD',
                    geoLiveType: geoLiveType
                });
            }
        };
    }
]);
