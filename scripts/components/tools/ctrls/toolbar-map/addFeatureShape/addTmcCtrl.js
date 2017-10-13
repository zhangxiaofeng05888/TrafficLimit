/**
 * Created by wangmingdong;
 */
angular.module('app').controller('addTmcCtrl', ['$scope', '$ocLazyLoad', 'dsEdit', 'appPath', '$timeout', 'hotkeys', 'dsMeta',
    function ($scope, $ocLazyLoad, dsEdit, appPath, $timeout, hotkeys, dsMeta) {
        // 引用对象初始化;
        var layerCtrl = fastmap.uikit.LayerController();
        var editLayer = layerCtrl.getLayerById('edit');
        var selectCtrl = fastmap.uikit.SelectController();
        var objCtrl = fastmap.uikit.ObjectEditController();
        var eventController = fastmap.uikit.EventController();
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var featCodeCtrl = fastmap.uikit.FeatCodeController();
        var tmcLayer = layerCtrl.getLayerById('tmcData');
        var prj = new fastmap.mapApi.MecatorTranform();
        var highlightCtrl = FM.mapApi.render.HighlightController.getInstance();
        var feedback = new fastmap.mapApi.Feedback();
        var feedbackController = fastmap.mapApi.FeedbackController.getInstance();
        var geometryFactory = fastmap.mapApi.symbol.GeometryFactory.getInstance();
        var symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();
        var parallelTool = fastmap.mapApi.Parallel();
        highlightCtrl.clear();
        // 获取图层瓦片数据;
        var rdLink = layerCtrl.getLayerById('rdLink');
        var rdNode = layerCtrl.getLayerById('rdNode');

        $scope.resetToolAndMap = function () {
            editLayer.drawGeometry = null;
            shapeCtrl.stopEditing();
            editLayer.bringToBack();
            $(editLayer.options._div).unbind();
            shapeCtrl.shapeEditorResult.setFinalGeometry(null);
            shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
            editLayer.clear();
        };

        // 显示tmc图层
        $scope.showTmcScene = function () {
            /* for (var layer in layerCtrl.layers) {
                if (layerCtrl.layers[layer].options.id === 'tmcData') {
                    if (!layerCtrl.layers[layer].options.visible) {
                        layerCtrl.layers[layer].options.visible = true;
                    } else {
                        return;
                    }
                } else if (layerCtrl.layers[layer].options.id === 'rdNode') {
                    layerCtrl.layers[layer].options.visible = true;
                } else if (layerCtrl.layers[layer].options.id === 'rdLink') {
                    layerCtrl.layers[layer].options.visible = true;
                } else if (layerCtrl.layers[layer].options.id === 'editLayers') {
                    layerCtrl.layers[layer].options.visible = true;
                } else if (layerCtrl.layers[layer].options.id === 'edit') {
                    layerCtrl.layers[layer].options.visible = true;
                } else if (layerCtrl.layers[layer].options.id === 'mousemovelightlayer') {
                    layerCtrl.layers[layer].options.visible = true;
                } else if (layerCtrl.layers[layer].options.id === 'feedback') {
                    layerCtrl.layers[layer].options.visible = true;
                } else {
                    layerCtrl.layers[layer].options.isUpDirect = false;
                    layerCtrl.layers[layer].options.visible = false;
                }
            }
            eventController.fire(eventController.eventTypes.LAYERONSWITCH, {
                layerArr: layerCtrl.layers
            });*/
            // 打开TMC场景;
            eventController.fire(eventController.eventTypes.CHANGESCENE, {
                data: 'TMC场景'
            });
        };
        // 刷新高亮方法
        $scope.refreshHighLight = function () {
            highlightCtrl.clear();
            highlightCtrl.highlight({
                rowId: parseInt($scope.tmcRelation.inLinkPid, 10),
                pid: parseInt($scope.tmcRelation.inLinkPid, 10),
                geoLiveType: 'RDLINKBYPID'
            });
            if ($scope.tmcRelation.linkPids && $scope.tmcRelation.linkPids.length) {
                for (var i = 0; i < $scope.tmcRelation.linkPids.length; i++) {
                    highlightCtrl.highlight({
                        rowId: parseInt($scope.tmcRelation.linkPids[i].pid, 10),
                        pid: parseInt($scope.tmcRelation.linkPids[i].pid, 10),
                        geoLiveType: 'RDLINKBYPID'
                    });
                }
            }
            if ($scope.tmcRelation.nodePid) {
                highlightCtrl.highlight({
                    rowId: parseInt($scope.tmcRelation.nodePid, 10),
                    pid: parseInt($scope.tmcRelation.nodePid, 10),
                    geoLiveType: 'RDNODE'
                });
            }
            // 高亮第一个tmcPoint和最后一个tmcPoint
            if ($scope.tmcRelation.pointPids && $scope.tmcRelation.pointPids.length) {
                for (var j = 0; j < $scope.tmcRelation.pointPids.length; j++) {
                    if (j === 0 || j === $scope.tmcRelation.pointPids.length - 1) {
                        highlightCtrl.highlight({
                            rowId: parseInt($scope.tmcRelation.pointPids[j].id, 10),
                            pid: parseInt($scope.tmcRelation.pointPids[j].id, 10),
                            geoLiveType: 'TMCPOINT'
                        });
                    }
                }
            }
            // 高亮款选的tmcPoint
            if ($scope.selectTmcPoints && $scope.selectTmcPoints.length) {
                for (var q = 0; q < $scope.selectTmcPoints.length; q++) {
                    highlightCtrl.highlight({
                        rowId: parseInt($scope.selectTmcPoints[q], 10),
                        pid: parseInt($scope.selectTmcPoints[q], 10),
                        geoLiveType: 'TMCPOINT'
                    });
                }
            }
        };
        // 高亮接续线方法;
        $scope.hightlightViasLink = function () {
            if ($scope.tmcRelation.linkPids && $scope.tmcRelation.linkPids.length) {
                for (var i = 0; i < $scope.tmcRelation.linkPids.length; i++) {
                    highlightCtrl.highlight({
                        rowId: parseInt($scope.tmcRelation.linkPids.pid, 10),
                        pid: parseInt($scope.tmcRelation.linkPids.pid, 10),
                        geoLiveType: 'LCLINK'
                    });
                }
            }
        };

        function createBuffer() {
            // 取出linkPid数组
            $scope.tmcRelation.pids = [];

            var geoms = [];
            for (var j = 0; j < $scope.tmcRelation.linkPids.length; j++) {
                $scope.tmcRelation.pids.push($scope.tmcRelation.linkPids[j].pid);
                geoms.push([$scope.tmcRelation.linkPids[j].geometry.coordinates[0], $scope.tmcRelation.linkPids[j].geometry.coordinates[$scope.tmcRelation.linkPids[j].geometry.coordinates.length - 1]]);
            }
            selectCtrl.onSelected({
                geometry: geoms,
                linkWidth: 9 / prj.scale(map),
                type: 'linkArrowGuide',
                showSide: $scope.tmcRelation.arrowLocation ? 1 : 0
            });
            if ($scope.tmcRelation.arrowLocation) {
                $scope.tmcRelation.direct = 1;
            } else {
                $scope.tmcRelation.direct = 2;
            }
            layerCtrl.pushLayerFront('edit');
            var sObj = shapeCtrl.shapeEditorResult;
            editLayer.drawGeometry = selectCtrl.selectedFeatures;
            editLayer.draw(selectCtrl.selectedFeatures, editLayer);
            sObj.setOriginalGeometry(selectCtrl.selectedFeatures);
            sObj.setFinalGeometry(selectCtrl.selectedFeatures);
        }
        $scope.checkUpAndDown = function (linkPidArr, linksArr) {
            var linkArrResult = [];
            var linkArr = linksArr;
            var nodePid = linksArr[0].sNodePid;
            if (linksArr[0].eNodePid == linksArr[1].sNodePid) {
                linkArr = linkArr.concat(linksArr[0].geometry.coordinates);
            }
            if (linksArr[0].sNodePid == linksArr[1].eNodePid) {
                linkArr = linkArr.concat(linksArr[0].geometry.coordinates);
            }
            if (linksArr[0].eNodePid == linksArr[1].eNodePid) {
                var etemp = linksArr[0].geometry.coordinates.slice(0);
                linkArr = linkArr.concat(etemp.reverse());
            }
            if (linksArr[0].sNodePid == linksArr[1].sNodePid) {
                var stemp = linksArr[0].geometry.coordinates.slice(0);
                linkArr = linkArr.concat(stemp.reverse());
            }

            for (var i = 0; i < linkPidArr.length; i++) {
                for (var j = 0; j < linksArr.length; j++) {
                    if (linkPidArr[i] == linksArr[j].linkPid) {
                        var temp = [];
                        if (nodePid == linksArr[j].sNodePid) { // 顺方向，直接concat
                            temp = linksArr[j].geometry.coordinates;
                            nodePid = linksArr[j].eNodePid;
                        } else { // 逆方向，先reverse后concat
                            var tempArr;
                            tempArr = linksArr[j].geometry.coordinates.slice(0);
                            temp = tempArr.reverse();
                            nodePid = linksArr[j].sNodePid;
                        }
                        linkArrResult.push(temp);
                    }
                }
            }
            return linkArrResult;
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
                res.push({ x: 0, y: 0 });
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
        function createSymbolTriangle(width, height, sunken) {
            var temp = {
                type: 'TriangleMarkerSymbol',
                width: width,
                height: height,
                sunken: sunken,
                outLine: {
                    color: 'red',
                    width: 3
                }
            };
            return temp;
        }
        // 创建buffer
        function createTmcBuffer() {
            feedback.clear();
            feedbackController.clear();
            $scope.tmcRelation.pids = [];
            // $scope.tmcRelation.linkPids = [];
            var proOriginArr = [];
            var leftLineObj = { type: 'LineString', coordinates: [] };
            var rightLineObj = { type: 'LineString', coordinates: [] };
            var geoms = [];
            for (var j = 0; j < $scope.tmcRelation.linkPids.length; j++) {
                $scope.tmcRelation.pids.push($scope.tmcRelation.linkPids[j].pid);
                geoms.push($scope.tmcRelation.linkPids[j].geometry.coordinates[0]);
                geoms.push($scope.tmcRelation.linkPids[j].geometry.coordinates[$scope.tmcRelation.linkPids[j].geometry.coordinates.length - 1]);
            }
            for (var i = 0; i < geoms.length; i++) {
                proOriginArr.push(map.latLngToContainerPoint([geoms[i][1], geoms[i][0]]));
            }
            selectCtrl.onSelected({
                geometry: geoms,
                linkWidth: 9 / prj.scale(map),
                type: 'linkArrowGuide',
                showSide: $scope.tmcRelation.arrowLocation ? 1 : 0
            });
            var symbolRight = symbolFactory.createSymbol(createSymbolLineObj('red', 'solid'));
            var symbolLeft = symbolFactory.createSymbol(createSymbolLineObj('red', 'solid'));
            var symbolData = {
                type: 'CenterMarkerLineSymbol',
                marker: createSymbolTriangle(10, 11, 10),
                direction: $scope.tmcRelation.arrowLocation ? 's2e' : 'e2s'
            };
            for (var k = 0; k < proOriginArr.length - 1; k++) {
                var tempArray = [proOriginArr[k], proOriginArr[k + 1]];
                rightLineObj.coordinates = containerToLatlng(tempArray, parseFloat(9 / prj.scale(map)));
                leftLineObj.coordinates = containerToLatlng(tempArray, -parseFloat(9 / prj.scale(map)));
                var symbolTriangle = symbolFactory.createSymbol(symbolData);
                // true为右侧，false为左侧
                if ($scope.tmcRelation.arrowLocation) {
                    var geometryRight = geometryFactory.toGeojson(rightLineObj);
                    feedback.add(geometryRight, symbolRight);
                    feedback.add(geometryRight, symbolTriangle);
                } else {
                    var geometryLeft = geometryFactory.toGeojson(leftLineObj);
                    feedback.add(geometryLeft, symbolLeft);
                    feedback.add(geometryLeft, symbolTriangle);
                }
                feedbackController.add(feedback);
                feedbackController.refresh();
                k++;
                $scope.refreshHighLight();
            }
        }
        // 创建buffer(完整弧线)
        function createAllTmcBuffer() {
            feedback.clear();
            feedbackController.clear();
            $scope.tmcRelation.pids = [];
            var proOriginArr = [];
            var leftLineObj = { type: 'LineString', coordinates: [] };
            var rightLineObj = { type: 'LineString', coordinates: [] };
            var i;
            var j;
            for (j = 0; j < $scope.tmcRelation.linkPids.length; j++) {
                $scope.tmcRelation.pids.push($scope.tmcRelation.linkPids[j].linkPid);
            }
            var linkArr = $scope.checkUpAndDown($scope.tmcRelation.pids, $scope.tmcRelation.linkPids);
            for (i = 0; i < linkArr.length; i++) {
                var temp = [];
                for (j = 0; j < linkArr[i].length; j++) {
                    temp.push(map.latLngToContainerPoint([linkArr[i][j][1], linkArr[i][j][0]]));
                }
                proOriginArr.push(temp);
            }
            var symbolRight = symbolFactory.createSymbol(createSymbolLineObj('red', 'solid'));
            var symbolLeft = symbolFactory.createSymbol(createSymbolLineObj('red', 'solid'));
            var symbolData = {
                type: 'CenterMarkerLineSymbol',
                marker: createSymbolTriangle(10, 11, 10),
                direction: $scope.tmcRelation.arrowLocation ? 's2e' : 'e2s'
            };
            var symbolTriangle = symbolFactory.createSymbol(symbolData);
            for (var k = 0; k < proOriginArr.length; k++) {
                rightLineObj.coordinates = containerToLatlng(proOriginArr[k], parseFloat(9 / prj.scale(map)));
                leftLineObj.coordinates = containerToLatlng(proOriginArr[k], -parseFloat(9 / prj.scale(map)));
                // true为右侧，false为左侧
                if ($scope.tmcRelation.arrowLocation) {
                    var geometryRight = geometryFactory.toGeojson(rightLineObj);
                    feedback.add(geometryRight, symbolRight);
                    feedback.add(geometryRight, symbolTriangle);
                } else {
                    var geometryLeft = geometryFactory.toGeojson(leftLineObj);
                    feedback.add(geometryLeft, symbolLeft);
                    feedback.add(geometryLeft, symbolTriangle);
                }
                feedbackController.add(feedback);
                feedbackController.refresh();
            }
            $scope.refreshHighLight();
        }

        $scope.setLastNode = function (index) {
            if (index == undefined) {
                if ($scope.tmcRelation.linkPids.length > 1) {
                    if (($scope.tmcRelation.linkPids[$scope.tmcRelation.linkPids.length - 1].eNodePid == $scope.tmcRelation.linkPids[$scope.tmcRelation.linkPids.length - 2].eNodePid)) {
                        $scope.tmcRelation.lastNode = $scope.tmcRelation.linkPids[$scope.tmcRelation.linkPids.length - 1].sNodePid;
                    }
                    if (($scope.tmcRelation.linkPids[$scope.tmcRelation.linkPids.length - 1].eNodePid == $scope.tmcRelation.linkPids[$scope.tmcRelation.linkPids.length - 2].sNodePid)) {
                        $scope.tmcRelation.lastNode = $scope.tmcRelation.linkPids[$scope.tmcRelation.linkPids.length - 1].sNodePid;
                    }
                    if (($scope.tmcRelation.linkPids[$scope.tmcRelation.linkPids.length - 1].sNodePid == $scope.tmcRelation.linkPids[$scope.tmcRelation.linkPids.length - 2].eNodePid)) {
                        $scope.tmcRelation.lastNode = $scope.tmcRelation.linkPids[$scope.tmcRelation.linkPids.length - 1].eNodePid;
                    }
                    if (($scope.tmcRelation.linkPids[$scope.tmcRelation.linkPids.length - 1].sNodePid == $scope.tmcRelation.linkPids[$scope.tmcRelation.linkPids.length - 2].sNodePid)) {
                        $scope.tmcRelation.lastNode = $scope.tmcRelation.linkPids[$scope.tmcRelation.linkPids.length - 1].eNodePid;
                    }
                }
            } else if (index == 0) {
                $scope.tmcRelation.lastNode = $scope.tmcRelation.nodePid;
            } else if (index == 1) {
                $scope.tmcRelation.lastNode = $scope.tmcRelation.linkPids[0].eNodePid == $scope.tmcRelation.nodePid ? $scope.tmcRelation.linkPids[0].eNodePid : $scope.tmcRelation.linkPids[0].sNodePid;
            } else if (index > 1) {
                if (($scope.tmcRelation.linkPids[index].eNodePid == $scope.tmcRelation.linkPids[index - 1].eNodePid)) {
                    $scope.tmcRelation.lastNode = $scope.tmcRelation.linkPids[index - 1].eNodePid;
                }
                if (($scope.tmcRelation.linkPids[index].eNodePid == $scope.tmcRelation.linkPids[index - 1].sNodePid)) {
                    $scope.tmcRelation.lastNode = $scope.tmcRelation.linkPids[index - 1].sNodePid;
                }
                if (($scope.tmcRelation.linkPids[index].sNodePid == $scope.tmcRelation.linkPids[index - 1].eNodePid)) {
                    $scope.tmcRelation.lastNode = $scope.tmcRelation.linkPids[index - 1].eNodePid;
                }
                if (($scope.tmcRelation.linkPids[index].sNodePid == $scope.tmcRelation.linkPids[index - 1].sNodePid)) {
                    $scope.tmcRelation.lastNode = $scope.tmcRelation.linkPids[index - 1].sNodePid;
                }
            }
        };
        // 格式化geometry
        function formatGeometry(geo) {
            var geometry = {
                coordinates: [
                    [geo.coordinates[0].x, geo.coordinates[0].y],
                    [geo.coordinates[1].x, geo.coordinates[1].y]
                ],
                type: 'LineString'
            };
            return geometry;
        }
        // 格式化link对象
        function formatLinkObject(link) {
            var newObj = {};
            newObj.direct = link.properties.direct;
            newObj.eNodePid = parseInt(link.properties.enode, 10);
            newObj.kind = link.properties.kind;
            newObj.length = link.properties.length;
            newObj.pid = parseInt(link.properties.id, 10);
            newObj.sNodePid = parseInt(link.properties.snode, 10);
            return newObj;
        }

        // 格式化第一次选择tmcPoint
        function formatTmcPoint(point) {
            var newObj = point;
            newObj.locoffNeg = point.locoffNeg;
            newObj.locoffPos = point.locoffPos;
            newObj.loctableId = point.loctableId;
            return newObj;
        }

        // 统计所有起点和终点的id
        function getAllNodes() {
            $scope.tmcRelation.nodePids = [];
            for (var i = 0; i < $scope.tmcRelation.linkPids.length; i++) {
                $scope.tmcRelation.nodePids.push(parseInt($scope.tmcRelation.linkPids[i].sNodePid, 10));
                $scope.tmcRelation.nodePids.push(parseInt($scope.tmcRelation.linkPids[i].eNodePid, 10));
            }
            // $scope.tmcRelation.nodePids = Utils.distinctArr($scope.tmcRelation.nodePids);
        }
        // 根据linkId查询详情
        function getLinkByPid(link) {
            dsEdit.getByPid(link.pid, 'RDLINK').then(function (newDetail) {
                if (newDetail.error == -1) {
                    return;
                }
                if (newDetail.tmclocations.length > 1) {
                    tooltipsCtrl.notify('当前link无法再创建TMCLocation，请重新选择！', 'error');
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
                $scope.tmcRelation.pids.push(parseInt(linkData.pid, 10));
                $scope.tmcRelation.linkPids.push(linkData);
                // $scope.hightlightViasLink();
                $scope.refreshHighLight();
                createBuffer();
                // createAllTmcBuffer();
                getAllNodes();
            });
        }
        // 选择接续线（支持修改退出线和接续线）;
        $scope.selectOutOrSeriesLinks = function (dataresult) {
            tooltipsCtrl.setCurrentTooltip('修改接续线或选择TMCPoint,点击 a 切换方向');
            // $scope.linkNodes = Utils.distinctArr($scope.linkNodes);
            // 判断选的线的合法性;
            if (dataresult.pid == $scope.tmcRelation.inLinkPid) {
                tooltipsCtrl.setCurrentTooltipText('所选线不能与进入线重复!');
                return;
            }
            /* -----------------------------------如果增加的是接续线（支持修改）;-----------------------------------*/
            /* 判断接续线是否能与进入线重合，原则上不能重合*/
            if (dataresult.pid == $scope.tmcRelation.inLinkPid) {
                tooltipsCtrl.setCurrentTooltipText('接续线不能与进入线重合!');
                return;
            }
            var linkInJoinLinksIndex = -1;
            for (var i = 0; i < $scope.tmcRelation.linkPids.length; i++) {
                if (dataresult.pid === $scope.tmcRelation.linkPids[i].pid) {
                    linkInJoinLinksIndex = i;
                }
            }
            /* 如果没有接续线接续线直接跟退出线挂接;*/
            if (linkInJoinLinksIndex === -1) {
                $scope.setLastNode();
                // $scope.hightlightViasLink();
                if (dataresult.eNodePid == $scope.tmcRelation.lastNode && $scope.tmcRelation.nodePids.indexOf(dataresult.sNodePid) == -1 && dataresult.direct == 3) {
                    getLinkByPid(dataresult);
                } else if (dataresult.sNodePid == $scope.tmcRelation.lastNode && $scope.tmcRelation.nodePids.indexOf(dataresult.eNodePid) == -1 && dataresult.direct == 2) {
                    getLinkByPid(dataresult);
                } else if (dataresult.direct == 1) {
                    // 双方向 结束点和上一条link挂接
                    if (dataresult.eNodePid == $scope.tmcRelation.lastNode && $scope.tmcRelation.nodePids.indexOf(dataresult.sNodePid) == -1) {
                        // 对于node和link数组的维护;
                        getLinkByPid(dataresult);
                    } else if (dataresult.sNodePid == $scope.tmcRelation.lastNode && $scope.tmcRelation.nodePids.indexOf(dataresult.eNodePid) == -1) {
                        // 双方向 起始点和上一条link挂接
                        // 对于node和link数组的维护;
                        getLinkByPid(dataresult);
                    } else {
                        tooltipsCtrl.notify('您选择的接续线与上一条不连续或方向错误！', 'error');
                    }
                } else {
                    tooltipsCtrl.notify('您选择的接续线与上一条不连续或方向错误！', 'error');
                }
            } else {
                $scope.setLastNode(linkInJoinLinksIndex - 1);
                $scope.tmcRelation.linkPids.splice(linkInJoinLinksIndex);
                // $scope.hightlightViasLink();
                $scope.refreshHighLight();
                createBuffer();
                // createAllTmcBuffer();
            }
            getAllNodes();
        };
        /* 修改追踪线或选择tmcPoint */
        $scope.afterTruckFunc = function () {
            // $scope.resetToolAndMap();
            map.currentTool.disable();
            // 初始化选择关系的工具
            map.currentTool = new fastmap.uikit.SelectNodeAndPath({
                map: map,
                shapeEditor: shapeCtrl,
                selectLayers: [tmcLayer, rdLink],
                snapLayers: [tmcLayer, rdLink],
                mutiSelect: true
            });
            map.currentTool.enable();
            eventController.off(eventController.eventTypes.GETRELATIONID, $scope.addTmcPointLinePoint);
            eventController.off(eventController.eventTypes.GETFEATURE);
            eventController.on(eventController.eventTypes.GETFEATURE, function (tData) {
                if (tData.optype !== 'TMCPOINT' && tData.optype !== 'RDLINK') {
                    tooltipsCtrl.notify('修改追踪link或者选择两个TMCPoint！', 'error');
                    return;
                }
                // 如果选择的是link，则修改追踪线
                if (tData.optype === 'RDLINK') {
                    $scope.selectOutOrSeriesLinks(formatLinkObject(tData));
                } else if (tData.optype === 'TMCPOINT') { // 如果选择tmcPoint，则计算locDirect
                    // 如果采用默认方式，tmcpoint只能有一个
                    if ($scope.tmcRelation.defaultMethod) {
                        $scope.tmcRelation.pointPids = [tData];
                        $scope.tmcRelation.tmcId = tData.id;
                        $scope.tmcRelation.locDirect = 0;
                        $scope.tmcRelation.loctableId = tData.loctableId;
                        selectCtrl.selectedFeatures.direct = $scope.tmcRelation.defaultMethod ? 1 : 2;
                        // $scope.tmcRelation.direct = $scope.tmcRelation.arrowLocation ? 1 : 2;
                        // tooltipsCtrl.setChangeInnerHtml('点击空格保存,或者按ESC键取消!');
                        tooltipsCtrl.setCurrentTooltip('点击空格保存,或者按ESC键取消!');
                        /* 组装数据对象*/
                        featCodeCtrl.setFeatCode($scope.tmcRelation);
                    } else {    // 第二种方式，两个以上tmcPoint
                        $scope.tmcRelation.pointPids.push(tData);
                        // 防止多次点击去重
                        // $scope.tmcRelation.pointPids = Utils.distinctArr($scope.tmcRelation.pointPids);
                        if ($scope.tmcRelation.pointPids.length > 1 && $scope.tmcRelation.pointPids[0].locoffPos !== 0) {
                            // 如果选择的第二个位置点是第一个位置点的正向偏移量则，则位置方向赋值为“+”
                            if ($scope.tmcRelation.pointPids[0].locoffPos === parseInt($scope.tmcRelation.pointPids[$scope.tmcRelation.pointPids.length - 1].id, 10)) {
                                $scope.tmcRelation.locDirect = 1;
                            } else if ($scope.tmcRelation.pointPids[0].locoffNeg === parseInt($scope.tmcRelation.pointPids[$scope.tmcRelation.pointPids.length - 1].id, 10)) {
                                // 如果选择的第二个位置点是第一个位置点的负向偏移量则，则位置方向赋值为“-”
                                $scope.tmcRelation.locDirect = 2;
                            } else {
                                tooltipsCtrl.notify('选择的两个TMCPoint无法匹配，请重新选择！', 'error');
                                return;
                            }
                            // 赋值位置表标识
                            $scope.tmcRelation.loctableId = $scope.tmcRelation.pointPids[$scope.tmcRelation.pointPids.length - 1].loctableId;
                            // 最后一个tmcId
                            $scope.tmcRelation.tmcId = $scope.tmcRelation.pointPids[$scope.tmcRelation.pointPids.length - 1].id;
                            // 选择link作用方向
                            tooltipsCtrl.setCurrentTooltip('点击空格完成TMC创建！');
                            /* 组装数据对象*/
                            featCodeCtrl.setFeatCode($scope.tmcRelation);
                        }
                    }
                }
                // 高亮第一个tmcPoint和最后一个tmcPoint
                $scope.refreshHighLight();
            });
        };
        /* 追踪link方法 */
        $scope.getTruckLinks = function () {
            if ($scope.tmcRelation.nodePid) {
                var param = {
                    command: 'CREATE',
                    dbId: App.Temp.dbId,
                    type: 'RDLINK',
                    data: {
                        linkPid: $scope.tmcRelation.inLinkPid,
                        nodePidDir: $scope.tmcRelation.nodePid,
                        maxNum: 30
                    }
                };
                dsEdit.getByCondition(param).then(function (data) {
                    if (data.data) {
                        $scope.tmcRelation.linkPids = data.data;
                        $scope.refreshHighLight();
                        $scope.tmcRelation.arrowLocation = true;
                        createBuffer();
                        // createAllTmcBuffer();
                        // 追踪线后快捷键 a 可以修改方向
                        hotkeys.bindTo($scope).add({
                            combo: 'a',
                            description: '切换link方向',
                            callback: function () {
                                $scope.tmcRelation.arrowLocation = !$scope.tmcRelation.arrowLocation;
                                if ($scope.tmcRelation.direct == 1) {
                                    $scope.tmcRelation.direct = 2;
                                } else if ($scope.tmcRelation.direct == 2) {
                                    $scope.tmcRelation.direct = 1;
                                }
                                editLayer.clear();
                                createBuffer();
                                // createAllTmcBuffer();
                            }
                        });
                    }
                });
            }
        };

        // 新增前初始化数据
        $scope.initTmcData = function (e) {
            if (map.getZoom() < 17) {
                swal('提示', '地图缩放等级必须大于16级才可操作', 'info');
                return;
            }
            // 开始启动工具
            $scope.$emit('Map-EnableTool', null);
            feedback.clear();
            feedbackController.clear();
            highlightCtrl.clear();
            // $scope.resetToolAndMap();
            // 初始化新增数据;
            $scope.tmcRelation = {
                tmcId: '',
                locDirect: '',
                loctableId: '',
                direct: '',
                inLinkPid: '',
                nodePid: '',
                defaultMethod: true,    // 默认操作方式为线点，第二种方式为点线点
                arrowLocation: undefined,   // 箭头位置，默认true 右边
                linkPids: [],
                nodePids: [],
                pids: [],
                lastNode: '',
                pointPids: []
            };
            $scope.linkNodes = [];
            // 显示tmc相关图层
            $scope.showTmcScene();
            // $scope.resetOperator('specItem', 'addTmc');

            // 按键绑定
            hotkeys.bindTo($scope).add({
                combo: 'c',
                description: '切换第二种作业方式',
                callback: function () {
                    // 切换作业方式
                    // $scope.resetToolAndMap();
                    $scope.initTmcData();
                    $scope.tmcRelation.defaultMethod = false;
                    tooltipsCtrl.setCurrentTooltip('正要新建TMC，请选择TMCPoint！');
                    map.currentTool.disable();
                    // 初始化选择关系的工具
                    map.currentTool = new fastmap.uikit.SelectFeature({
                        map: map,
                        shapeEditor: shapeCtrl
                    });
                    map.currentTool.enable();
                    eventController.off(eventController.eventTypes.SELECTEDCHANGED, $scope.addTmcPointLinePoint);
                    eventController.on(eventController.eventTypes.SELECTEDCHANGED, $scope.addTmcPointLinePoint);
                    // 工具启动成功
                    if (map.currentTool.enabled()) {
                        $scope.$emit('Map-ToolEnabled', {
                            event: e,
                            tool: map.currentTool,
                            operationType: 'EDIT'
                        });
                    }
                }
            });
        };

        // 选择进入线和进入点
        $scope.selectLinkAndNode = function () {
            var linkDirect = '';
            var inLink = {
                sNodePid: '',
                eNodePid: ''
            };
            if (map.currentTool) {
                map.currentTool.disable();
            }
            map.currentTool = new fastmap.uikit.SelectForRestriction({
                map: map,
                currentEditLayer: rdLink,
                shapeEditor: shapeCtrl,
                operationList: ['line', 'point', 'line']
            });
            map.currentTool.enable();
            map.currentTool.snapHandler.addGuideLayer(rdLink);
            shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.TMCTRANSFORMDIRECT);
            eventController.off(eventController.eventTypes.GETNODEID);
            eventController.off(eventController.eventTypes.GETRELATIONID);
            eventController.off(eventController.eventTypes.GETFEATURE);
            eventController.off(eventController.eventTypes.GETRECTDATA);
            eventController.off(eventController.eventTypes.GETLINKID);
            eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                if (data.index == 0) {  // 第一次选择进入线
                    dsEdit.getByPid(parseInt(data.id, 10), 'RDLINK').then(function (newDetail) {
                        if (newDetail.tmclocations.length > 1) {
                            map.currentTool.selectedFeatures.pop();
                            tooltipsCtrl.notify('当前link无法再创建TMCLocation，请重新选择！', 'error');
                        } else {
                            // 清除吸附的十字
                            map.currentTool.snapHandler._guides = [];
                            map.currentTool.snapHandler.addGuideLayer(rdLink);
                            // 高亮进入线;
                            $scope.tmcRelation.inLinkPid = parseInt(data.id, 10);
                            inLink.sNodePid = parseInt(data.properties.snode, 10);
                            inLink.eNodePid = parseInt(data.properties.enode, 10);
                            // 进入线的方向属性;
                            linkDirect = parseInt(data.properties.direct, 10);
                            $scope.refreshHighLight();
                            // 如果进入线是单方向道路，自动选择进入点;
                            if (linkDirect === 2 || linkDirect === 3) {
                                // 清除吸附的十字
                                map.currentTool.snapHandler._guides = [];
                                map.currentTool.snapHandler.addGuideLayer(rdNode);
                                $scope.tmcRelation.nodePid = parseInt(linkDirect === 2 ? inLink.eNodePid : inLink.sNodePid, 10);
                                $scope.linkNodes.push($scope.tmcRelation.nodePid);
                                $scope.refreshHighLight();
                                $scope.getTruckLinks();
                                /* 自动追踪后需要手动修改，或选择TMCPoint */
                                $scope.afterTruckFunc();
                            }
                        }
                    });
                } else if (data.index == 1) {
                    // 如果双方向则先选择方向
                    // 清除吸附的十字
                    map.currentTool.snapHandler._guides = [];
                    map.currentTool.snapHandler.addGuideLayer(rdNode);
                    // 地图编辑相关设置;
                    tooltipsCtrl.setCurrentTooltip('选择进入点！');
                    if (parseInt(data.id, 10) !== inLink.sNodePid && parseInt(data.id, 10) !== inLink.eNodePid) {
                        tooltipsCtrl.notify('必须选择link的端点！', 'error');
                        return;
                    }
                    // 判断重复监听
                    if ($scope.tmcRelation.nodePid === parseInt(data.id, 10)) {
                        return;
                    }
                    // 如果进入线是双方向的，则根据用户的选择高亮进入点;
                    $scope.tmcRelation.nodePid = parseInt(data.id, 10);
                    $scope.linkNodes.push($scope.tmcRelation.nodePid);
                    highlightCtrl.highlight({
                        rowId: parseInt($scope.tmcRelation.nodePid, 10),
                        pid: parseInt($scope.tmcRelation.nodePid, 10),
                        geoLiveType: 'RDNODE'
                    });
                    // $scope.refreshHighLight();
                    tooltipsCtrl.setCurrentTooltip('已经选择进入点!请选择TMCPoint，点击 a 切换方向');
                    map.currentTool.snapHandler.addGuideLayer(rdLink);
                    $scope.getTruckLinks();
                    /* 自动追踪后需要手动修改，或选择TMCPoint */
                    $scope.afterTruckFunc();
                }
            });
            // 启动工具成功
            if (map.currentTool.enabled()) {
                $scope.$emit('Map-ToolEnabled', {
                    tool: map.currentTool,
                    operationType: 'ADD',
                    geoLiveType: 'RDTMCLOCATION'
                });
            }
        };

        /**
         * 制作TMC
         */
        $scope.addTmcLocation = function (e) {
            $scope.initTmcData(e);
            tooltipsCtrl.setCurrentTooltip('正要新建TMC，请选择进入线！或按 c 切换作业方式。');
            $scope.selectLinkAndNode();
        };

        // 创建TMC的第二种方式
        $scope.addTmcPointLinePoint = function (selectData) {
            if (selectData.feature.properties.geoLiveType == 'TMCPOINT') {
                if ($scope.tmcRelation.pointPids.length) {
                    return;
                }
                shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.TMCTRANSFORMDIRECT);
                $scope.tmcRelation.pointPids.push(formatTmcPoint(selectData.feature.properties));
                $scope.refreshHighLight();
                tooltipsCtrl.setCurrentTooltip('已选第一个TMCPoint，请选择进入线！');
                $scope.selectLinkAndNode();
            } else {
                tooltipsCtrl.setCurrentTooltip('必须选择TMCPoint，请重新选择！');
            }
        };
    }

]);
