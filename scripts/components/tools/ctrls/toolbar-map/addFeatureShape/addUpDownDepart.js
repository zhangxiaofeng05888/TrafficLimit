/**
 * Created by linglong on 2017/1/9.
 */
angular.module('app').controller('addUpDownDepartCtrl', ['$scope', '$ocLazyLoad', 'dsEdit',
    function ($scope, $ocLazyLoad, dsEdit) {
        var layerCtrl = fastmap.uikit.LayerController();
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var selectCtrl = fastmap.uikit.SelectController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var rdLink = layerCtrl.getLayerById('rdLink');
        var rdnode = layerCtrl.getLayerById('rdNode');
        var eventController = fastmap.uikit.EventController();

        var transform = new fastmap.mapApi.MecatorTranform();
        var highlightCtrl = FM.mapApi.render.HighlightController.getInstance();
        var symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();
        var geometryFactory = fastmap.mapApi.symbol.GeometryFactory.getInstance();
        var feedback = new fastmap.mapApi.Feedback();
        var feedbackController = fastmap.mapApi.FeedbackController.getInstance();
        var parallelTool = fastmap.mapApi.Parallel();
        var feedbackCtrl = fastmap.mapApi.FeedbackController.getInstance();

        $scope.jsonData = null;
        $scope.limitRelation = {};

        $scope.checkUpAndDown = function (linkPidArr, linksArr) {
            var linkArr = [];
            var nodePid = $scope.RdMultiDigitized.nodePid;
            var temp;
            if (nodePid == linksArr[0].sNodePid) { // 顺方向，直接concat
                temp = linksArr[0].geometry.coordinates.slice(0);
                linkArr = linkArr.concat(temp.reverse());
            } else { // 逆方向，先reverse后concat
                linkArr = linkArr.concat(linksArr[0].geometry.coordinates);
            }
            for (var i = 1; i < linkPidArr.length; i++) {
                for (var j = 1; j < linksArr.length; j++) {
                    if (linkPidArr[i] == linksArr[j].pid) {
                        if (nodePid == linksArr[j].sNodePid) { // 顺方向，直接concat
                            linkArr = linkArr.concat(linksArr[j].geometry.coordinates);
                            nodePid = linksArr[j].eNodePid;
                        } else { // 逆方向，先reverse后concat
                            temp = linksArr[j].geometry.coordinates.slice(0);
                            linkArr = linkArr.concat(temp.reverse());
                            nodePid = linksArr[j].sNodePid;
                        }
                    }
                }
            }
            return linkArr;
        };

        /**
         * 将获得的平行于中间线的平行线的坐标串转换为地理坐标;
         * @param geo
         * @param width
         * @returns {Array}
         */
        function containerToLatlng(geo, width) {
            var offsetSegments = parallelTool.offsetPointLine(geo, width);
            var arr = parallelTool.joinLineSegments(offsetSegments, width);
            var res = [];
            for (var i = 0; i < arr.length; i++) {
                res.push({
                    x: 0,
                    y: 0
                });
                var temp = map.containerPointToLatLng([arr[i].x, arr[i].y]);
                res[i].x = temp.lng;
                res[i].y = temp.lat;
            }
            return res;
        }

        function createSymbolLineObj(color, style) {
            var temp = {
                type: 'SimpleLineSymbol',
                color: color,
                width: 1,
                style: style
            };
            return temp;
        }

        /**
         * 自动追踪获得接续线;
         * @param param
         */
        function autoTrail(param) {
            $scope.RdMultiDigitized.allLinkObjs.length = 0;
            $scope.RdMultiDigitized.allLinkPids.length = 0;
            $scope.RdMultiDigitized.joinLinks.length = 0;
            dsEdit.getByCondition(param).then(function (responseData) {
                if (responseData.data) {
                    for (var i = 0; i < responseData.data.length; i++) {
                        $scope.RdMultiDigitized.allLinkObjs.push(responseData.data[i]);
                        $scope.RdMultiDigitized.allLinkPids.push(responseData.data[i].pid);
                        if (i != 0) {
                            $scope.RdMultiDigitized.joinLinks.push(responseData.data[i].pid);
                        }
                    }
                    highlightCtrl.clear();
                    highlightCtrl.highlight($scope.RdMultiDigitized);
                    tooltipsCtrl.setCurrentTooltip('自动追踪完成，可以重新选择线或直接进行上下线分离!');
                }
            });
        }

        // 启动新工具之前，清理当前的工具
        var clearMapTool = function () {
            eventController.off(eventController.eventTypes.GETLINKID);
            if (map.currentTool) {
                map.currentTool.disable();
            }
            tooltipsCtrl.disable();
        };

        function createBuffer() {
            clearMapTool();
            if (map.scrollWheelZoom._enabled) {
                map.scrollWheelZoom.disable();
            }
            var proOriginArr = [];
            var leftLineObj = {
                type: 'LineString',
                coordinates: []
            };
            var rightLineObj = {
                type: 'LineString',
                coordinates: []
            };
            var middleLineObj = {
                type: 'LineString',
                coordinates: []
            };
            var dotLineStartObj = {
                type: 'LineString',
                coordinates: []
            };
            var dotLineEndObj = {
                type: 'LineString',
                coordinates: []
            };
            var textEndObj = {
                type: 'Point',
                x: 0,
                y: 0
            };
            var textStartObj = {
                type: 'Point',
                x: 0,
                y: 0
            };

            var linkArr = $scope.checkUpAndDown($scope.RdMultiDigitized.allLinkPids, $scope.RdMultiDigitized.allLinkObjs);
            linkArr = Utils.distinctArr(linkArr);
            for (var i = 0; i < linkArr.length; i++) {
                linkArr[i] = linkArr[i].split(',');
                proOriginArr.push(map.latLngToContainerPoint([linkArr[i][1], linkArr[i][0]]));
            }
            var linkWidth = (3.3 / transform.scale(map));

            linkWidth = parseFloat(linkWidth.toFixed(2));
            selectCtrl.onSelected({
                geometry: linkArr,
                linkIds: $scope.RdMultiDigitized.allLinkPids,
                linkWidth: linkWidth,
                type: 'Buffer'
            });

            // geoJson中只支持经纬度;
            middleLineObj.coordinates = containerToLatlng(proOriginArr, 0);
            rightLineObj.coordinates = containerToLatlng(proOriginArr, parseFloat(linkWidth));
            leftLineObj.coordinates = containerToLatlng(proOriginArr, -parseFloat(linkWidth));
            dotLineStartObj.coordinates = [
                rightLineObj.coordinates[0], middleLineObj.coordinates[0],
                leftLineObj.coordinates[0]
            ];
            dotLineEndObj.coordinates = [
                rightLineObj.coordinates[rightLineObj.coordinates.length - 1],
                middleLineObj.coordinates[middleLineObj.coordinates.length - 1],
                leftLineObj.coordinates[leftLineObj.coordinates.length - 1]
            ];
            textEndObj.x = middleLineObj.coordinates[0].x;
            textEndObj.y = middleLineObj.coordinates[0].y;
            textStartObj.x = middleLineObj.coordinates[middleLineObj.coordinates.length - 1].x;
            textStartObj.y = middleLineObj.coordinates[middleLineObj.coordinates.length - 1].y;

            var symbolRight = symbolFactory.createSymbol(createSymbolLineObj('red', 'solid'));
            var symbolLeft = symbolFactory.createSymbol(createSymbolLineObj('green', 'solid'));
            var symbolMiddle = symbolFactory.createSymbol(createSymbolLineObj('blue', 'solid'));
            var symbolDotted1 = symbolFactory.createSymbol(createSymbolLineObj('blue', 'dot'));
            var symbolDotted2 = symbolFactory.createSymbol(createSymbolLineObj('blue', 'dot'));
            var symbolText = symbolFactory.createSymbol({
                type: 'TextMarkerSymbol',
                text: parseFloat((selectCtrl.selectedFeatures.linkWidth * transform.scale(map)).toFixed(2)) + 'm',
                font: '微软雅黑',
                size: 12,
                align: 'center',
                baseline: 'middle',
                direction: 'ltr',
                color: 'red'
            });

            var geometryRight = geometryFactory.toGeojson(rightLineObj);
            var geometryLeft = geometryFactory.toGeojson(leftLineObj);
            var geometryMiddle = geometryFactory.toGeojson(middleLineObj);
            var geometryDotted1 = geometryFactory.toGeojson(dotLineStartObj);
            var geometryDotted2 = geometryFactory.toGeojson(dotLineEndObj);
            var geometryText1 = geometryFactory.toGeojson(textEndObj);
            var geometryText2 = geometryFactory.toGeojson(textStartObj);

            feedback.clear();
            feedbackController.clear();
            feedback.add(geometryRight, symbolRight);
            feedback.add(geometryLeft, symbolLeft);
            feedback.add(geometryMiddle, symbolMiddle);
            feedback.add(geometryDotted1, symbolDotted1);
            feedback.add(geometryDotted2, symbolDotted2);
            feedback.add(geometryText1, symbolText);
            feedback.add(geometryText2, symbolText);
            feedbackController.add(feedback);
            feedbackController.refresh();

            shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.PATHBUFFER);
            shapeCtrl.startEditing();
            tooltipsCtrl.setDbClickChangeInnerHtml('点击空格保存画线,或者按ESC键取消!');
        }

        /**
         * 更新所选的最后的node点;
         * @param index
         */
        function setLastNode(index) {
            var tempArr = angular.copy($scope.RdMultiDigitized.allLinkObjs);
            tempArr.shift();
            if (index == undefined) {
                if (tempArr.length == 0) {
                    $scope.RdMultiDigitized.lastNode = $scope.RdMultiDigitized.nodePid;
                } else if (tempArr.length == 1) {
                    if (tempArr[0].eNodePid == $scope.RdMultiDigitized.nodePid) {
                        $scope.RdMultiDigitized.lastNode = tempArr[0].sNodePid;
                    } else {
                        $scope.RdMultiDigitized.lastNode = tempArr[0].eNodePid;
                    }
                } else if (tempArr.length > 1) {
                    var preObj = tempArr[tempArr.length - 2];
                    var lastObj = tempArr[tempArr.length - 1];
                    if (lastObj.eNodePid == preObj.eNodePid || lastObj.eNodePid == preObj.sNodePid) {
                        $scope.RdMultiDigitized.lastNode = lastObj.sNodePid;
                    }
                    if (lastObj.sNodePid == preObj.eNodePid || lastObj.sNodePid == preObj.sNodePid) {
                        $scope.RdMultiDigitized.lastNode = lastObj.eNodePid;
                    }
                }
            } else if (index == 0) {
                $scope.RdMultiDigitized.lastNode = $scope.RdMultiDigitized.nodePid;
            } else if (index == 1) {
                if (tempArr[0].eNodePid == $scope.RdMultiDigitized.nodePid) {
                    $scope.RdMultiDigitized.lastNode = tempArr[0].sNodePid;
                } else {
                    $scope.RdMultiDigitized.lastNode = tempArr[0].eNodePid;
                }
            } else if (index > 1) {
                var preObject = tempArr[tempArr.length - 2];
                var lastObject = tempArr[tempArr.length - 1];
                if (lastObject.eNodePid == preObject.eNodePid || lastObject.eNodePid == preObject.sNodePid) {
                    $scope.RdMultiDigitized.lastNode = lastObject.sNodePid;
                }
                if (lastObject.sNodePid == preObject.eNodePid || lastObject.sNodePid == preObject.sNodePid) {
                    $scope.RdMultiDigitized.lastNode = lastObject.eNodePid;
                }
            }
        }

        function updateJoinLinks() {
            setLastNode();
            clearMapTool();
            if (shapeCtrl.currentTool) {
                shapeCtrl.stopEditing();
                highlightCtrl.clear();
                feedbackCtrl.clear();
                feedbackCtrl.refresh();
                highlightCtrl.highlight($scope.RdMultiDigitized);
            }
            map.currentTool = new fastmap.uikit.SelectPath({
                map: map,
                currentEditLayer: rdLink,
                linksFlag: true,
                shapeEditor: shapeCtrl
            });
            map.currentTool.enable();
            tooltipsCtrl.setCurrentTooltip('选择需要删除或新增的线！');
            eventController.off(eventController.eventTypes.GETLINKID);
            eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                // 如果是进入线return;
                if (data.id == $scope.RdMultiDigitized.inLinkPid) {
                    return;
                }
                var repNum = $scope.RdMultiDigitized.allLinkPids.indexOf(parseInt(data.id, 10));
                if (repNum != -1) {
                    $scope.RdMultiDigitized.allLinkObjs.splice(repNum);
                    $scope.RdMultiDigitized.allLinkPids.splice(repNum);
                    $scope.RdMultiDigitized.joinLinks.splice(repNum - 1);
                    setLastNode($scope.RdMultiDigitized.joinLinks.length);
                } else {
                    var isJoin = (data.properties.enode == $scope.RdMultiDigitized.lastNode) || (data.properties.snode == $scope.RdMultiDigitized.lastNode);
                    if (isJoin) {
                        dsEdit.getByPid(parseInt(data.id, 10), 'RDLINK').then(function (newDetail) {
                            if (newDetail.error == -1) {
                                return;
                            }
                            var linkData = {
                                direct: newDetail.direct,
                                eNodePid: newDetail.eNodePid,
                                geometry: newDetail.geometry,
                                kind: newDetail.kind,
                                pid: newDetail.pid,
                                sNodePid: newDetail.sNodePid
                            };
                            $scope.RdMultiDigitized.allLinkObjs.push(linkData);
                            $scope.RdMultiDigitized.allLinkPids.push(linkData.pid);
                            $scope.RdMultiDigitized.joinLinks.push(linkData.pid);
                            if (linkData.eNodePid == $scope.RdMultiDigitized.lastNode) {
                                $scope.RdMultiDigitized.lastNode = linkData.sNodePid;
                            } else {
                                $scope.RdMultiDigitized.lastNode = linkData.eNodePid;
                            }
                            highlightCtrl.clear();
                            highlightCtrl.highlight($scope.RdMultiDigitized);
                        });
                    }
                }
                highlightCtrl.clear();
                highlightCtrl.highlight($scope.RdMultiDigitized);
            });
        }

        /**
         * 显示编辑工具按钮
         * @param data
         */
        function showTools(data) {
            map.floatMenu = new L.Control.FloatMenu('000', data.event.originalEvent, {
                items: [{
                    text: "<a class='glyphicon glyphicon-import'></a>",
                    title: '重新选择线',
                    type: 'RETRYLINK',
                    class: 'feaf',
                    callback: updateJoinLinks
                }, {
                    text: "<a class='glyphicon glyphicon-resize-full'></a>",
                    title: '上下线分离',
                    type: 'pathBuffer',
                    class: 'feaf',
                    callback: createBuffer
                }]
            });
            map.addLayer(map.floatMenu);
            map.floatMenu.setVisible(true);
        }

        $scope.addShape = function (event) {
            // 大于17级才可以选择地图上各种geometry
            if (map.getZoom() < 17) {
                swal('提示', '地图缩放等级必须大于16级才可操作', 'info');
                return;
            }
            // 开始启动工具
            $scope.$emit('Map-EnableTool', null);
            var linkDirect;
            var requestParma = {
                command: 'CREATE',
                dbId: App.Temp.dbId,
                type: 'RDLINK',
                data: {
                    linkPid: 0,
                    nodePidDir: 0,
                    maxNum: 30
                }
            };
            $scope.RdMultiDigitized = {
                geoLiveType: 'RDMULTIDIGITIZED',
                inLinkPid: 0,
                nodePid: 0,
                joinLinks: [],
                allLinkPids: [],
                allLinkObjs: [],
                lastNode: 0
            };
            shapeCtrl.setEditingType('addUpAndDown');
            tooltipsCtrl.setEditEventType('addUpAndDown');
            tooltipsCtrl.setCurrentTooltip('开始创建建上下线分离,先选择线！');
            map.currentTool = new fastmap.uikit.SelectForRestriction({
                map: map,
                currentEditLayer: rdLink,
                shapeEditor: shapeCtrl,
                operationList: ['line', 'point']
            });
            map.currentTool.enable();
            // 添加自动吸附的图层
            map.currentTool.snapHandler.addGuideLayer(rdLink);
            eventController.off(eventController.eventTypes.GETLINKID);
            eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                if (data.index == 0) {
                    $scope.RdMultiDigitized.inLinkPid = data.id;
                    requestParma.data.linkPid = data.id;
                    linkDirect = data.properties.direct;
                    if (linkDirect == 1) tooltipsCtrl.setCurrentTooltip('已经选择起始线,请选择方向点!');
                    // 如果进入线是单方向道路，自动选择进入点;
                    if (linkDirect == 2 || linkDirect == 3) {
                        var recNode = (linkDirect == 2) ? data.properties.enode : data.properties.snode;
                        $scope.RdMultiDigitized.nodePid = parseInt(recNode, 10);
                        requestParma.data.nodePidDir = parseInt(recNode, 10);
                        map.currentTool.selectedFeatures.push(parseInt(recNode, 10));
                        data.index = 1;
                        // 自动追踪;
                        autoTrail(requestParma);
                    }
                } else if (data.index == 1) {
                    $scope.RdMultiDigitized.nodePid = parseInt(data.id, 10);
                    requestParma.data.nodePidDir = parseInt(data.id, 10);
                    map.currentTool.snapHandler._guides.length = 0;
                    map.currentTool.snapHandler.addGuideLayer(rdnode);
                    // 自动追踪;
                    autoTrail(requestParma);
                }
                highlightCtrl.clear();
                highlightCtrl.highlight($scope.RdMultiDigitized);
                if (data.index >= 1 && !map.floatMenu) {
                    showTools(data);
                }
            });

            // 工具启动成功
            if (map.currentTool.enabled()) {
                $scope.$emit('Map-ToolEnabled', {
                    event: event,
                    tool: map.currentTool,
                    operationType: 'ADD',
                    geoLiveType: 'RDLINK'
                });
            }
        };
    }
]);
