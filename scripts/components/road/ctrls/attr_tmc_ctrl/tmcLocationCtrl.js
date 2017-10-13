/**
 * Created by wangmingdong on 2016/11/22.
 */

angular.module('app').controller('TmcLocationCtl', ['$scope', 'dsEdit', 'dsFcc', 'hotkeys', function ($scope, dsEdit, dsFcc, hotkeys) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = new fastmap.uikit.SelectController();
    var layerCtrl = fastmap.uikit.LayerController();
    var eventController = fastmap.uikit.EventController();
    var editLayer = layerCtrl.getLayerById('edit');
    var tmcLayer = layerCtrl.getLayerById('tmcData');
    var rdLink = layerCtrl.getLayerById('rdLink');
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var featCodeCtrl = fastmap.uikit.FeatCodeController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();
    var highlightCtrl = FM.mapApi.render.HighlightController.getInstance();
    var geometryFactory = fastmap.mapApi.symbol.GeometryFactory.getInstance();
    var feedback = new fastmap.mapApi.Feedback();
    var feedbackController = fastmap.mapApi.FeedbackController.getInstance();
    var parallelTool = fastmap.mapApi.Parallel();
    var prj = new fastmap.mapApi.MecatorTranform();
    // 重新设置选择工具
    var resetToolAndMap = function () {
        if (map.floatMenu) {
            map.removeLayer(map.floatMenu);
            map.floatMenu = null;
        }
        map.scrollWheelZoom.enable();
        editLayer.drawGeometry = null;
        editLayer.clear();
        editLayer.bringToBack();
        shapeCtrl.shapeEditorResult.setFinalGeometry(null);
        shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
        shapeCtrl.stopEditing();
        rdLink.clearAllEventListeners();
        if (tooltipsCtrl.getCurrentTooltip()) {
            tooltipsCtrl.onRemoveTooltip();
        }
        if (map.currentTool) {
            map.currentTool.disable(); // 禁止当前的参考线图层的事件捕获
        }
        if (selectCtrl.rowKey) {
            selectCtrl.rowKey = null;
        }
        $(editLayer.options._div).unbind();
    };
    // 高亮link
    $scope.refreshHighLight = function () {
        highlightCtrl.clear();
        highlightCtrl.highlight({
            rowId: parseInt($scope.tmcLocationData.tmcId, 10),
            pid: parseInt($scope.tmcLocationData.tmcId, 10),
            geoLiveType: 'RDTMCLOCATION',
            links: $scope.tmcLocationData.links
        });
    };
    $scope.initializeData = function () {
        resetToolAndMap();
        $scope.tmcLocationData = objCtrl.data;
        // 拓扑操作数据
        $scope.tmcLocationData.link = {
            linkPid: $scope.tmcLocationData.links[0].linkPid,
            direct: $scope.tmcLocationData.links[0].direct
        };
        $scope.tmcLocationData.locDirect = $scope.tmcLocationData.links[0].locDirect;
        $scope.tmcLocationData.arrowLocation = this.direct == 1;   // 箭头位置，默认true 右边
        // $scope.tmcLocationData.links = angular.copy($scope.tmcLocationData.links).reverse();
        $scope.tmcLocationData.nodePids = [];   // 所有的起点和终点
        $scope.tmcLocationData.linkPids = [];
        // 格式化原始link数据
        function formatLinkOrigin() {
            for (var i = 0; i < $scope.tmcLocationData.links.length; i++) {
                $scope.tmcLocationData.links[i].sNodeGeo = $scope.tmcLocationData.links[i].geometry.coordinates[0][0] + $scope.tmcLocationData.links[i].geometry.coordinates[0][1];
                $scope.tmcLocationData.links[i].eNodeGeo = $scope.tmcLocationData.links[i].geometry.coordinates[$scope.tmcLocationData.links[i].geometry.coordinates.length - 1][0] + $scope.tmcLocationData.links[i].geometry.coordinates[$scope.tmcLocationData.links[i].geometry.coordinates.length - 1][1];
                $scope.tmcLocationData.links[i].pid = $scope.tmcLocationData.links[i].linkPid;
            }
        }
        formatLinkOrigin();
        if ($scope.tmcLocationData.tmcId.toString().length === 8) {
            $scope.loctableCode = $scope.tmcLocationData.tmcId.toString().substr(0, 2);
        } else if ($scope.tmcLocationData.tmcId.toString().length === 9) {
            $scope.loctableCode = $scope.tmcLocationData.tmcId.toString().substr(0, 3);
        }
        $scope.refreshHighLight();
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
    function createBuffer() {
        // 取出linkPid数组
        $scope.tmcLocationData.pids = [];
        $scope.tmcLocationData.linkPids = [];
        var geoms = [];
        for (var j = 0; j < $scope.tmcLocationData.links.length; j++) {
            $scope.tmcLocationData.linkPids.push($scope.tmcLocationData.links[j].linkPid);
            geoms.push([$scope.tmcLocationData.links[j].geometry.coordinates[0], $scope.tmcLocationData.links[j].geometry.coordinates[$scope.tmcLocationData.links[j].geometry.coordinates.length - 1]]);
        }
        selectCtrl.onSelected({
            geometry: geoms,
            linkWidth: 9 / prj.scale(map),
            type: 'linkArrowGuide',
            showSide: $scope.tmcLocationData.arrowLocation ? 1 : 0
        });

        layerCtrl.pushLayerFront('edit');
        var sObj = shapeCtrl.shapeEditorResult;
        editLayer.drawGeometry = selectCtrl.selectedFeatures;
        editLayer.draw(selectCtrl.selectedFeatures, editLayer);
        sObj.setOriginalGeometry(selectCtrl.selectedFeatures);
        sObj.setFinalGeometry(selectCtrl.selectedFeatures);
    }

    // 创建buffer
    function createTmcBuffer() {
        feedback.clear();
        feedbackController.clear();
        $scope.tmcLocationData.pids = [];
        $scope.tmcLocationData.linkPids = [];
        var proOriginArr = [];
        var leftLineObj = { type: 'LineString', coordinates: [] };
        var rightLineObj = { type: 'LineString', coordinates: [] };
        var geoms = [];
        for (var j = 0; j < $scope.tmcLocationData.links.length; j++) {
            $scope.tmcLocationData.linkPids.push($scope.tmcLocationData.links[j].linkPid);
            geoms.push($scope.tmcLocationData.links[j].geometry.coordinates[0]);
            geoms.push($scope.tmcLocationData.links[j].geometry.coordinates[$scope.tmcLocationData.links[j].geometry.coordinates.length - 1]);
        }
        for (var i = 0; i < geoms.length; i++) {
            proOriginArr.push(map.latLngToContainerPoint([geoms[i][1], geoms[i][0]]));
        }
        selectCtrl.onSelected({
            geometry: geoms,
            linkWidth: 9 / prj.scale(map),
            type: 'linkArrowGuide',
            showSide: $scope.tmcLocationData.arrowLocation ? 1 : 0
        });
        var symbolRight = symbolFactory.createSymbol(createSymbolLineObj('red', 'solid'));
        var symbolLeft = symbolFactory.createSymbol(createSymbolLineObj('red', 'solid'));
        var symbolData = {
            type: 'CenterMarkerLineSymbol',
            marker: createSymbolTriangle(10, 11, 10),
            direction: $scope.tmcLocationData.arrowLocation ? 's2e' : 'e2s'
        };
        for (var k = 0; k < proOriginArr.length - 1; k++) {
            var tempArray = [proOriginArr[k], proOriginArr[k + 1]];
            rightLineObj.coordinates = containerToLatlng(tempArray, parseFloat(9 / prj.scale(map)));
            leftLineObj.coordinates = containerToLatlng(tempArray, -parseFloat(9 / prj.scale(map)));
            var symbolTriangle = symbolFactory.createSymbol(symbolData);
            // true为右侧，false为左侧
            if ($scope.tmcLocationData.arrowLocation) {
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
        $scope.tmcLocationData.pids = [];
        $scope.tmcLocationData.linkPids = [];
        var proOriginArr = [];
        var leftLineObj = { type: 'LineString', coordinates: [] };
        var rightLineObj = { type: 'LineString', coordinates: [] };
        var i;
        var j;
        for (j = 0; j < $scope.tmcLocationData.links.length; j++) {
            $scope.tmcLocationData.linkPids.push($scope.tmcLocationData.links[j].linkPid);
        }
        var linkArr = $scope.checkUpAndDown($scope.tmcLocationData.linkPids, $scope.tmcLocationData.links);
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
            direction: $scope.tmcLocationData.arrowLocation ? 's2e' : 'e2s'
        };
        for (var k = 0; k < proOriginArr.length; k++) {
            var tempArray = proOriginArr[k];
            rightLineObj.coordinates = containerToLatlng(tempArray, parseFloat(9 / prj.scale(map)));
            leftLineObj.coordinates = containerToLatlng(tempArray, -parseFloat(9 / prj.scale(map)));
            var symbolTriangle = symbolFactory.createSymbol(symbolData);
            // true为右侧，false为左侧
            if ($scope.tmcLocationData.arrowLocation) {
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
            $scope.refreshHighLight();
        }
    }

    $scope.setLastNode = function (index) {
        if (index == undefined) {
            if ($scope.tmcLocationData.links.length > 1) {
                if (($scope.tmcLocationData.links[$scope.tmcLocationData.links.length - 1].eNodePid == $scope.tmcLocationData.links[$scope.tmcLocationData.links.length - 2].eNodePid)) {
                    $scope.tmcLocationData.lastNode = $scope.tmcLocationData.links[$scope.tmcLocationData.links.length - 1].sNodePid;
                }
                if (($scope.tmcLocationData.links[$scope.tmcLocationData.links.length - 1].eNodePid == $scope.tmcLocationData.links[$scope.tmcLocationData.links.length - 2].sNodePid)) {
                    $scope.tmcLocationData.lastNode = $scope.tmcLocationData.links[$scope.tmcLocationData.links.length - 1].sNodePid;
                }
                if (($scope.tmcLocationData.links[$scope.tmcLocationData.links.length - 1].sNodePid == $scope.tmcLocationData.links[$scope.tmcLocationData.links.length - 2].eNodePid)) {
                    $scope.tmcLocationData.lastNode = $scope.tmcLocationData.links[$scope.tmcLocationData.links.length - 1].eNodePid;
                }
                if (($scope.tmcLocationData.links[$scope.tmcLocationData.links.length - 1].sNodePid == $scope.tmcLocationData.links[$scope.tmcLocationData.links.length - 2].sNodePid)) {
                    $scope.tmcLocationData.lastNode = $scope.tmcLocationData.links[$scope.tmcLocationData.links.length - 1].eNodePid;
                }
            }
        } else if (index == 0) {
            $scope.tmcLocationData.lastNode = $scope.tmcLocationData.nodePid;
        } else if (index == 1) {
            $scope.tmcLocationData.lastNode = $scope.tmcLocationData.links[0].eNodePid == $scope.tmcLocationData.nodePid ? $scope.tmcLocationData.links[0].eNodePid : $scope.tmcLocationData.links[0].sNodePid;
        } else if (index > 1) {
            if (($scope.tmcLocationData.links[index].eNodePid == $scope.tmcLocationData.links[index - 1].eNodePid)) {
                $scope.tmcLocationData.lastNode = $scope.tmcLocationData.links[index - 1].eNodePid;
            }
            if (($scope.tmcLocationData.links[index].eNodePid == $scope.tmcLocationData.links[index - 1].sNodePid)) {
                $scope.tmcLocationData.lastNode = $scope.tmcLocationData.links[index - 1].sNodePid;
            }
            if (($scope.tmcLocationData.links[index].sNodePid == $scope.tmcLocationData.links[index - 1].eNodePid)) {
                $scope.tmcLocationData.lastNode = $scope.tmcLocationData.links[index - 1].eNodePid;
            }
            if (($scope.tmcLocationData.links[index].sNodePid == $scope.tmcLocationData.links[index - 1].sNodePid)) {
                $scope.tmcLocationData.lastNode = $scope.tmcLocationData.links[index - 1].sNodePid;
            }
        }
    };
    // 格式化link对象
    function formatLinkObject(link) {
        var newObj = {};
        newObj.direct = parseInt(link.properties.direct, 10);
        newObj.eNodePid = parseInt(link.properties.enode, 10);
        newObj.kind = link.properties.kind;
        newObj.length = link.properties.length;
        newObj.pid = parseInt(link.properties.id, 10);
        newObj.linkPid = parseInt(link.properties.id, 10);
        newObj.sNodePid = parseInt(link.properties.snode, 10);
        return newObj;
    }
    // 统计所有起点和终点的id
    function getAllNodes() {
        $scope.tmcLocationData.nodePids = [];
        for (var i = 0; i < $scope.tmcLocationData.links.length; i++) {
            $scope.tmcLocationData.nodePids.push(parseInt($scope.tmcLocationData.links[i].sNodePid, 10));
            $scope.tmcLocationData.nodePids.push(parseInt($scope.tmcLocationData.links[i].eNodePid, 10));
        }
        // $scope.tmcLocationData.nodePids = Utils.distinctArr($scope.tmcLocationData.nodePids);
        featCodeCtrl.setFeatCode($scope.tmcLocationData);
    }
    // 根据linkId查询详情
    function getLinkByPid(link) {
        dsEdit.getByPid(link.pid, 'RDLINK').then(function (newDetail) {
            if (newDetail.error == -1) {
                return;
            }
            var linkData = {
                direct: newDetail.direct,
                eNodePid: newDetail.eNodePid,
                geometry: newDetail.geometry,
                kind: newDetail.kind,
                pid: newDetail.pid,
                linkPid: newDetail.pid,
                sNodePid: newDetail.sNodePid
            };
            $scope.tmcLocationData.linkPids.push(parseInt(linkData.pid, 10));
            $scope.tmcLocationData.links.push(linkData);
            // $scope.hightlightViasLink();
            $scope.refreshHighLight();
            // createAllTmcBuffer();
            createBuffer();
            getAllNodes();
        });
    }
    // 选择接续线（支持修改退出线和接续线）;
    $scope.selectOutOrSeriesLinks = function (dataresult) {
        tooltipsCtrl.setCurrentTooltip('修改接续线或空格保存');
        // $scope.linkNodes = Utils.distinctArr($scope.linkNodes);
        // 判断选的线的合法性;
        if (dataresult.pid == $scope.tmcLocationData.links[0].linkPid) {
            tooltipsCtrl.setCurrentTooltipText('所选线不能与进入线重复!');
            return;
        }
        var linkInJoinLinksIndex = -1;
        for (var i = 0; i < $scope.tmcLocationData.links.length; i++) {
            if (dataresult.pid === $scope.tmcLocationData.links[i].pid) {
                linkInJoinLinksIndex = i;
            }
        }
        /* 如果没有接续线接续线直接跟退出线挂接;*/
        if (linkInJoinLinksIndex === -1) {
            $scope.setLastNode();
            // $scope.hightlightViasLink();
            if (dataresult.eNodePid == $scope.tmcLocationData.lastNode && $scope.tmcLocationData.nodePids.indexOf(dataresult.sNodePid) == -1 && dataresult.direct == 3) {
                getLinkByPid(dataresult);
            } else if (dataresult.sNodePid == $scope.tmcLocationData.lastNode && $scope.tmcLocationData.nodePids.indexOf(dataresult.eNodePid) == -1 && dataresult.direct == 2) {
                getLinkByPid(dataresult);
            } else if (dataresult.direct == 1) {
                // 双方向 结束点和上一条link挂接
                if (dataresult.eNodePid == $scope.tmcLocationData.lastNode && $scope.tmcLocationData.nodePids.indexOf(dataresult.sNodePid) == -1) {
                    // 对于node和link数组的维护;
                    getLinkByPid(dataresult);
                } else if (dataresult.sNodePid == $scope.tmcLocationData.lastNode && $scope.tmcLocationData.nodePids.indexOf(dataresult.eNodePid) == -1) {
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
            $scope.tmcLocationData.links.splice(linkInJoinLinksIndex);
            // $scope.hightlightViasLink();
            $scope.refreshHighLight();
            // createAllTmcBuffer();
            createBuffer();
        }
        getAllNodes();
    };
    $scope.getFeatureFunction = function (data) {
        // 如果选择的是link，则修改追踪线
        if (data.optype === 'RDLINK') {
            $scope.selectOutOrSeriesLinks(formatLinkObject(data));
        }
        // 高亮第一个tmcPoint和最后一个tmcPoint
        $scope.refreshHighLight();
    };
    /* 修改追踪线或选择tmcPoint */
    $scope.afterTruckFunc = function () {
        // resetToolAndMap();
        map.currentTool.disable();
        // 初始化选择关系的工具
        map.currentTool = new fastmap.uikit.SelectNodeAndPath({
            map: map,
            shapeEditor: shapeCtrl,
            selectLayers: [rdLink],
            snapLayers: [rdLink],
            mutiSelect: true
        });
        map.currentTool.enable();
        shapeCtrl.setEditingType('updateTmcLoc');
        eventController.off(eventController.eventTypes.GETFEATURE, $scope.getFeatureFunction);
        eventController.on(eventController.eventTypes.GETFEATURE, $scope.getFeatureFunction);
    };
    /* 位置方向 */
    $scope.locDirectOptions = [
        { id: 0, label: '初始值' },
        { id: 1, label: '+(位置点外，西东南北和顺时针方向)' },
        { id: 2, label: '-(位置点外，东西北南和逆时针)' },
        { id: 3, label: 'P(位置点内，西东南北)' },
        { id: 4, label: 'N(位置点内，东西北南)' }
    ];
    /* 方向关系 */
    $scope.directOptions = [
        { id: 0, label: '初始值' },
        { id: 1, label: '与Link方向相同' },
        { id: 2, label: '与Link方向相反' }
    ];
    // 修改links和direct,拓扑操作
    $scope.mapEdit = function () {
        resetToolAndMap();
        editLayer.clear();
        $scope.tmcLocationData.link.direct = $scope.tmcLocationData.links[0].direct;
        $scope.tmcLocationData.arrowLocation = $scope.tmcLocationData.link.direct == 1;
        // 重组去除linksPid
        for (var i = 0; i < $scope.tmcLocationData.links.length; i++) {
            $scope.tmcLocationData.linkPids.push($scope.tmcLocationData.links[i].linkPid);
        }
        createBuffer();
        // createTmcBuffer();
        // createAllTmcBuffer();
        $scope.afterTruckFunc();
        featCodeCtrl.setFeatCode($scope.tmcLocationData);
        // 追踪线后快捷键 a 可以修改方向
        hotkeys.bindTo($scope).add({
            combo: 'a',
            description: '切换link方向',
            callback: function () {
                $scope.tmcLocationData.arrowLocation = !$scope.tmcLocationData.arrowLocation;
                if ($scope.tmcLocationData.link.direct == 1) {
                    $scope.tmcLocationData.link.direct = 2;
                } else if ($scope.tmcLocationData.link.direct == 2) {
                    $scope.tmcLocationData.link.direct = 1;
                }
                editLayer.clear();
                // createAllTmcBuffer();
                createBuffer();
            }
        });
    };
    $scope.initializeData();

    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
