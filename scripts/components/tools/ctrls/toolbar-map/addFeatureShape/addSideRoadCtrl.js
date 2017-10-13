/**
 * Created by linglong;
 * Email: linglong@navinfo.com;
 * Date 2016/11/28;
 * Time 16:41
 */
angular.module('app').controller('addSideRoadCtrl', ['$scope', '$ocLazyLoad', 'dsEdit',
    function ($scope, $ocLazyLoad, dsEdit) {
        // 引用对象初始化;
        var layerCtrl = fastmap.uikit.LayerController();
        var selectCtrl = fastmap.uikit.SelectController();
        var eventController = fastmap.uikit.EventController();
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var transform = new fastmap.mapApi.MecatorTranform();
        var highlightCtrl = FM.mapApi.render.HighlightController.getInstance();
        var symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();
        var geometryFactory = fastmap.mapApi.symbol.GeometryFactory.getInstance();
        var feedback = new fastmap.mapApi.Feedback();
        var feedbackController = fastmap.mapApi.FeedbackController.getInstance();
        var parallelTool = fastmap.mapApi.Parallel();
        // 获取图层瓦片数据;
        var rdLink = layerCtrl.getLayerById('rdLink');
        var rdNode = layerCtrl.getLayerById('rdNode');

        /**
         * 更新所选的最后的node点;
         * @param index
         */
        function setLastNode(index) {
            var tempArr = angular.copy($scope.sideRoadData.links);
            tempArr.shift();
            if (index == undefined) {
                if (tempArr.length == 0) {
                    $scope.sideRoadData.lastNode = $scope.sideRoadData.inNodePid;
                } else if (tempArr.length == 1) {
                    if (tempArr[0].eNodePid == $scope.sideRoadData.inNodePid) {
                        $scope.sideRoadData.lastNode = tempArr[0].sNodePid;
                    } else {
                        $scope.sideRoadData.lastNode = tempArr[0].eNodePid;
                    }
                } else if (tempArr.length > 1) {
                    if ((tempArr[tempArr.length - 1].eNodePid == tempArr[tempArr.length - 2].eNodePid)) {
                        $scope.sideRoadData.lastNode = tempArr[tempArr.length - 1].sNodePid;
                    }
                    if ((tempArr[tempArr.length - 1].eNodePid == tempArr[tempArr.length - 2].sNodePid)) {
                        $scope.sideRoadData.lastNode = tempArr[tempArr.length - 1].sNodePid;
                    }
                    if ((tempArr[tempArr.length - 1].sNodePid == tempArr[tempArr.length - 2].eNodePid)) {
                        $scope.sideRoadData.lastNode = tempArr[tempArr.length - 1].eNodePid;
                    }
                    if ((tempArr[tempArr.length - 1].sNodePid == tempArr[tempArr.length - 2].sNodePid)) {
                        $scope.sideRoadData.lastNode = tempArr[tempArr.length - 1].eNodePid;
                    }
                }
            } else if (index == 0) {
                $scope.sideRoadData.lastNode = $scope.sideRoadData.inNodePid;
            } else if (index == 1) {
                if (tempArr[0].eNodePid == $scope.sideRoadData.inNodePid) {
                    $scope.sideRoadData.lastNode = tempArr[0].sNodePid;
                } else {
                    $scope.sideRoadData.lastNode = tempArr[0].eNodePid;
                }
            } else if (index > 1) {
                if ((tempArr[index].eNodePid == tempArr[index - 1].eNodePid)) {
                    $scope.sideRoadData.lastNode = tempArr[index - 1].eNodePid;
                }
                if ((tempArr[index].eNodePid == tempArr[index - 1].sNodePid)) {
                    $scope.sideRoadData.lastNode = tempArr[index - 1].sNodePid;
                }
                if ((tempArr[index].sNodePid == tempArr[index - 1].eNodePid)) {
                    $scope.sideRoadData.lastNode = tempArr[index - 1].eNodePid;
                }
                if ((tempArr[index].sNodePid == tempArr[index - 1].sNodePid)) {
                    $scope.sideRoadData.lastNode = $scope.sideRoadData.links[index - 1].sNodePid;
                }
            }
        }

        /**
         * link的node点排序;
         * @param linkPidArr
         * @param linksArr
         * @returns {Array}
         */
        function checkUpAndDown(linkPidArr, linksArr) {
            var linkArr = [];
            var nodePid = $scope.sideRoadData.inNodePid;
            if (nodePid == linksArr[0].sNodePid) { // 顺方向，直接concat
                var temp = linksArr[0].geometry.coordinates.slice(0);
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
                            var tempArr;
                            tempArr = linksArr[j].geometry.coordinates.slice(0);
                            linkArr = linkArr.concat(tempArr.reverse());
                            nodePid = linksArr[j].sNodePid;
                        }
                    }
                }
            }
            return linkArr;
        }

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
                res.push({ x: 0, y: 0 });
                var temp = map.containerPointToLatLng([arr[i].x, arr[i].y]);
                res[i].x = temp.lng;
                res[i].y = temp.lat;
            }
            return res;
        }

        function createSymbolLineObj(color, style) {
            return {
                type: 'SimpleLineSymbol',
                color: color,
                width: 1,
                style: style
            };
        }

        /**
         * 自动追踪方法;
         */
        function autoTrail() {
            var param = {
                command: 'CREATE',
                dbId: App.Temp.dbId,
                type: 'RDLINK',
                data: { linkPid: $scope.sideRoadData.inLinkPid, nodePidDir: $scope.sideRoadData.inNodePid, maxNum: 30 }
            };
            $scope.sideRoadData.links.length = 0;
            $scope.sideRoadData.linkPids.length = 0;
            $scope.sideRoadData.joinLinkPids.length = 0;
            dsEdit.getByCondition(param).then(function (dataResult) {
                var tempLinks = dataResult.data;
                for (var i = 0; i < tempLinks.length; i++) {
                    $scope.sideRoadData.links.push(tempLinks[i]);
                    $scope.sideRoadData.linkPids.push(tempLinks[i].pid);
                    if (i != 0) {
                        $scope.sideRoadData.joinLinkPids.push(tempLinks[i].pid);
                    }
                }
                highlightCtrl.clear();
                highlightCtrl.highlight($scope.sideRoadData);
                tooltipsCtrl.setCurrentTooltip('自动追踪完成，可以重新选择线或直接制作辅路!');
            });
        }

        /**
         * 修改接续线;
         */
        function updateJoinLinks() {
            setLastNode();
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
                if (data.id == $scope.sideRoadData.inLinkPid) { return; }
                var repNum = $scope.sideRoadData.linkPids.indexOf(parseInt(data.id, 10));
                if (repNum != -1) {
                    setLastNode(repNum - 1);
                    $scope.sideRoadData.links.splice(repNum);
                    $scope.sideRoadData.linkPids.splice(repNum);
                    $scope.sideRoadData.joinLinkPids.splice(repNum - 1);
                } else {
                    var isJoin = (data.properties.enode == $scope.sideRoadData.lastNode)
                        || (data.properties.snode == $scope.sideRoadData.lastNode);
                    if (isJoin) {
                        dsEdit.getByPid(parseInt(data.id, 10), 'RDLINK').then(function (newDetail) {
                            if (newDetail.error == -1) { return; }
                            var linkData = {
                                direct: newDetail.direct,
                                eNodePid: newDetail.eNodePid,
                                geometry: newDetail.geometry,
                                kind: newDetail.kind,
                                pid: newDetail.pid,
                                sNodePid: newDetail.sNodePid
                            };
                            $scope.sideRoadData.links.push(linkData);
                            $scope.sideRoadData.linkPids.push(linkData.pid);
                            $scope.sideRoadData.joinLinkPids.push(linkData.pid);
                            if (linkData.eNodePid == $scope.sideRoadData.lastNode) {
                                $scope.sideRoadData.lastNode = linkData.sNodePid;
                            } else {
                                $scope.sideRoadData.lastNode = linkData.eNodePid;
                            }
                            highlightCtrl.clear();
                            highlightCtrl.highlight($scope.sideRoadData);
                        });
                    }
                }
                highlightCtrl.clear();
                highlightCtrl.highlight($scope.sideRoadData);
            });
        }

        /**
         * 创建辅路;
         */
        function createBuffer() {
            if (map.scrollWheelZoom._enabled) {
                map.scrollWheelZoom.disable();
            }
            var sNodePid;
            var proOriginArr = [];
            var leftLineObj = { type: 'LineString', coordinates: [] };
            var rightLineObj = { type: 'LineString', coordinates: [] };
            var middleLineObj = { type: 'LineString', coordinates: [] };
            var dotLineStartObj = { type: 'LineString', coordinates: [] };
            var dotLineEndObj = { type: 'LineString', coordinates: [] };
            var textEndObj = { type: 'Point', x: 0, y: 0 };
            var textStartObj = { type: 'Point', x: 0, y: 0 };
            // 制作的辅路不能是闭合的环,即进入线与最后一个接续线不能连接;
            var isCircle = false;
            if (isCircle) { return; }
            var linkArr = checkUpAndDown($scope.sideRoadData.linkPids, $scope.sideRoadData.links);
            linkArr = Utils.distinctArr(linkArr);
            for (var i = 0; i < linkArr.length; i++) {
                linkArr[i] = linkArr[i].split(',');
                proOriginArr.push(map.latLngToContainerPoint([linkArr[i][1], linkArr[i][0]]));
            }
            var linkWidth = parseFloat((9 / transform.scale(map)).toFixed(2));
            if ($scope.sideRoadData.inLinkObj.snode == $scope.sideRoadData.inNodePid) {
                sNodePid = $scope.sideRoadData.inLinkObj.enode;
            } else {
                sNodePid = $scope.sideRoadData.inLinkObj.snode;
            }
            selectCtrl.onSelected({
                geometry: linkArr,
                linkIds: $scope.sideRoadData.linkPids,
                linkWidth: linkWidth,
                sNodePid: sNodePid,
                type: 'sideBuffer',
                sideType: 1
            });
            // geoJson中只支持经纬度;
            middleLineObj.coordinates = containerToLatlng(proOriginArr, 0);
            rightLineObj.coordinates = containerToLatlng(proOriginArr, parseFloat(linkWidth));
            leftLineObj.coordinates = containerToLatlng(proOriginArr, -parseFloat(linkWidth));

            dotLineStartObj.coordinates = [rightLineObj.coordinates[0], middleLineObj.coordinates[0], leftLineObj.coordinates[0]];
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

            shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.PATHSIDE);
            shapeCtrl.startEditing();
            if (map.scrollWheelZoom._enabled) {
                map.scrollWheelZoom.disable();
            }
            tooltipsCtrl.setDbClickChangeInnerHtml('点击空格保存画线,或者按ESC键取消!');
        }

        /**
         * 显示编辑工具按钮
         * @param data
         */
        function showTools(data) {
            map.floatMenu = new L.Control.FloatMenu('000', data.event.originalEvent, {
                items: [{
                    text: "<a class='glyphicon glyphicon-import'></a>",
                    title: '修改接续线',
                    type: 'MODIFYSIDEROADLINKS',
                    class: 'feaf',
                    callback: updateJoinLinks
                }, {
                    text: "<a class='glyphicon glyphicon-resize-full'></a>",
                    title: '制作辅路',
                    type: 'SIDEROADBUFFER',
                    class: 'feaf',
                    callback: createBuffer
                }]
            });
            map.addLayer(map.floatMenu);
            map.floatMenu.setVisible(true);
        }

        /**
         * 制作辅路
         */
        $scope.addSideRoad = function (event) {
            if (map.getZoom() < 17) {
                swal('提示', '地图缩放等级必须大于16级才可操作', 'info');
                return;
            }
            // 开始启动工具
            $scope.$emit('Map-EnableTool', null);

            // 初始化辅路数据;
            $scope.sideRoadData = {
                geoLiveType: 'RDSIDEROAD',
                inLinkPid: 0,
                inNodePid: 0,
                joinLinkPids: [],
                inLinkObj: 0,
                lastNode: 0,
                links: [],
                linkPids: []
            };
            tooltipsCtrl.setEditEventType('addSideRoad');
            tooltipsCtrl.setCurrentTooltip('正要新建辅路,先选择线！');
            // 配置具体的操作工具;
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
                if (data.index === 0) {
                    $scope.sideRoadData.inLinkObj = data.properties;
                    $scope.sideRoadData.inLinkPid = data.id;
                    if (data.properties.direct == 1) {
                        tooltipsCtrl.setCurrentTooltip('已经选择起始线,请选择方向点!');
                    } else {
                        // 单方向自动选点;
                        if (data.properties.direct == 2) {
                            $scope.sideRoadData.inNodePid = parseInt(data.properties.enode, 10);
                        } else {
                            $scope.sideRoadData.inNodePid = parseInt(data.properties.snode, 10);
                        }
                        map.currentTool.selectedFeatures.push($scope.sideRoadData.inNodePid.toString());
                        data.index = 1;
                        autoTrail();
                    }
                } else {
                    // 如果选错或者和上一次相同就不在发请求；
                    var isRepeat = data.id == $scope.sideRoadData.inNodePid;
                    var wrongNode1 = $scope.sideRoadData.inLinkObj.direct == 2 &&
                                    data.id == $scope.sideRoadData.inLinkObj.snode;
                    var wrongNode2 = $scope.sideRoadData.inLinkObj.direct == 3 &&
                                    data.id == $scope.sideRoadData.inLinkObj.enode;
                    if (isRepeat || wrongNode1 || wrongNode2) { return; }
                    $scope.sideRoadData.inNodePid = parseInt(data.id, 10);
                    map.currentTool.snapHandler._guides.length = 0;
                    map.currentTool.snapHandler.addGuideLayer(rdNode);
                    $scope.sideRoadData.inNodePid = parseInt(data.id, 10);
                    autoTrail();
                }
                highlightCtrl.clear();
                highlightCtrl.highlight($scope.sideRoadData);
                // 弹出编辑按钮;
                if (data.index >= 1 && !map.floatMenu) {
                    showTools(data);
                }
            });

            // 选择工具启动
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
