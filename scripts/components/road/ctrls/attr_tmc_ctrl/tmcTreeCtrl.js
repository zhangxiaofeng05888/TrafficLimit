/**
 * Created by wangmingdong on 2016/11/30.
 */

var tmcTreeApp = angular.module('app');
tmcTreeApp.controller('TmcTreeController', function ($scope, dsMeta, dsEdit, $timeout, $ocLazyLoad) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = new fastmap.uikit.SelectController();
    var layerCtrl = fastmap.uikit.LayerController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var eventController = fastmap.uikit.EventController();
    var featCodeCtrl = fastmap.uikit.FeatCodeController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var rdLink = layerCtrl.getLayerById('rdLink');
    var rdNode = layerCtrl.getLayerById('rdNode');
    var rdCross = layerCtrl.getLayerById('relationData');
    var workPoint = layerCtrl.getLayerById('workPoint');
    var editLayer = layerCtrl.getLayerById('edit');
    var tmcLayer = layerCtrl.getLayerById('tmcData');
    var highlightCtrl = FM.mapApi.render.HighlightController.getInstance();
    /* 加载二级面板 */
    $scope.loadChildPanel = function (res, ctrl, html) {
        var showNameInfoObj = {
            loadType: 'attrTplContainer',
            propertyCtrl: ctrl,
            propertyHtml: html
        };
        objCtrl.tmcInfos = res;
        $scope.$emit('transitCtrlAndTpl', showNameInfoObj);
    };
    /* 递归查询所有tmcLine */
    $scope.getAllTmcLine = function (array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].type == 'TMCLINE') {
                $scope.tmcLineArray.push(array[i]);
                if (array[i].children) {
                    $scope.getAllTmcLine(array[i].children);
                }
            } else if (i === array.length - 1) {
                if (array[i].children) {
                    $scope.getAllTmcLine(array[i].children);
                }
            }
        }
    };
    // 从树信息中查找定位高亮
    $scope.locTreeData = function (array, id) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].tmcId == id) {
                $scope.selectedItem = array[i];
            }
            if (array[i].children) {
                $scope.locTreeData(array[i].children, id);
            }
            if (i == array.length - 1) {
                if (array[i].children) {
                    $scope.locTreeData(array[i].children, id);
                }
            }
        }
    };
    // 展开树节点
    $scope.setExpendNodes = function (result) {
        $scope.expendNodes = [];
        $scope.getAllTmcNode = function (array) {
            $scope.expendNodes.push(array[0]);
            for (var i = 0; i < array.length; i++) {
                if (array[i]) {
                    $scope.expendNodes.push(array[i]);
                    if (array[i].children) {
                        $scope.getAllTmcNode(array[i].children);
                    }
                }
            }
        };
        $scope.getAllTmcNode(result);
    };
    // 高亮查询出来的全部tmcline
    $scope.highLightTmcLine = function (tmcLineArray) {
        var zoom = map.getZoom() < 17 ? 17 : map.getZoom();
        editLayer.clear();
        // 根据经纬度坐标高亮link
        var lines = [];
        var activeLines = [];
        for (var i = 0; i < tmcLineArray.length; i++) {
            if (tmcLineArray[i].geometry) {
                var points = [];
                for (var j = 0; j < tmcLineArray[i].geometry.length; j++) {
                    if (tmcLineArray[i].geometry[j][0].length) {
                        for (var n = 0; n < tmcLineArray[i].geometry[j].length; n++) {
                            var mPoint = fastmap.mapApi.point(tmcLineArray[i].geometry[j][n][0], tmcLineArray[i].geometry[j][n][1]);
                            points.push(mPoint);
                        }
                    } else {
                        var point = fastmap.mapApi.point(tmcLineArray[i].geometry[j][0], tmcLineArray[i].geometry[j][1]);
                        points.push(point);
                    }
                }
                if (!$scope.activeTmc || $scope.activeTmc.tmcId != $scope.tmcLineArray[i].tmcId) {
                    lines.push(fastmap.mapApi.lineString(points));
                } else {
                    activeLines.push(fastmap.mapApi.lineString(points));
                }
            }
        }
        var multiPolyLine = fastmap.mapApi.multiPolyline(lines,
            {
                color: 'blue',
                size: 3
            }, activeLines, {
                color: 'red',
                size: 3
            });
        var sObj = shapeCtrl.shapeEditorResult;
        layerCtrl.pushLayerFront('edit');
        selectCtrl.onSelected({
            geometry: multiPolyLine
        });
        editLayer.drawGeometry = multiPolyLine;
        editLayer.draw(multiPolyLine, editLayer);
        sObj.setOriginalGeometry(multiPolyLine);
        sObj.setFinalGeometry(multiPolyLine);
        // map.setView([data.data.geometry[1], data.data.geometry[0]], zoom);
    };
    // 只高亮选择的单条tmcLine
    $scope.highLightLine = function (tmcLine) {
        // editLayer.clear();
        var points = [];
        for (var i = 0; i < tmcLine.geometry.length; i++) {
            var point = fastmap.mapApi.point(tmcLine.geometry[i][0], tmcLine.geometry[i][1]);
            points.push(point);
        }
        var tmcLineString = fastmap.mapApi.lineString(points);
        var sObj = shapeCtrl.shapeEditorResult;
        layerCtrl.pushLayerFront('edit');
        selectCtrl.onSelected({
            geometry: tmcLineString
        });
        editLayer.drawGeometry = tmcLineString;
        editLayer.draw(tmcLineString, editLayer);
        sObj.setOriginalGeometry(tmcLineString);
        sObj.setFinalGeometry(tmcLineString);
    };
    function formatTmcPoint(id) {
        var point = {
            rowId: id,
            pid: parseInt(id, 10),
            geoLiveType: 'TMCPOINT'
        };
        return point;
    }
    function formatTmcLocation(id) {
        var location = {
            rowId: id,
            linkPid: parseInt(id, 10),
            geoLiveType: 'RDTMCLOCATION'
        };
        return location;
    }
    // 选择tmcLocation
    $scope.selectTmcLocation = function (item) {
        $scope.activeTmc = item;
        objCtrl.setCurrentObject('RDTMCLOCATION', item);
        $scope.$emit('ObjectSelected', { feature: fastmap.dataApi.rdTmcLocation(item) });
    };
    // 选择树子节点查询
    $scope.showTreeSelected = function (sel) {
        var zoom = map.getZoom() < 17 ? 17 : map.getZoom();
        var param = {
            tmcId: sel.tmcId,
            type: sel.type
        };
        // 判断是否重复选择
        if (sel.type == 'TMCPOINT' || sel.type == 'TMCLINE') {
            for (var i = 0; i < $scope.selectTmcInfo.length; i++) {
                if ($scope.selectTmcInfo[i].tmcId == sel.tmcId) {
                    break;
                }
                if (i == $scope.selectTmcInfo.length - 1 && $scope.selectTmcInfo[i].tmcId != sel.tmcId) {
                    $scope.selectTmcInfo = [];
                    $scope.selectTmcInfo.push(sel);
                }
            }
        }
        if (sel.type === 'TMCPOINT') {
            editLayer.clear();
            $scope.activeTmc = sel;
            dsMeta.queryTmcData(param).then(function (data) {
                map.setView([data.geometry[1], data.geometry[0]], zoom);
                if (data.lineTmcId != 0) {
                    for (var j = 0; j < $scope.tmcLineArray.length; j++) {
                        if ($scope.tmcLineArray[j].tmcId == data.lineTmcId) {
                            $scope.highLightLine($scope.tmcLineArray[j]);
                        }
                    }
                }
                $scope.locTreeData($scope.tmcTreeData, parseInt(sel.tmcId, 10));
                $scope.$emit('ObjectSelected', { feature: fastmap.dataApi.tmcPoint(data) });
            });
        } else if (sel.type === 'TMCLINE') {
            $scope.activeTmc = sel;
            if (sel.geometry) {
                $scope.highLightTmcLine($scope.tmcLineArray);
            }
            dsMeta.queryTmcData(param).then(function (data) {
                $scope.locTreeData($scope.tmcTreeData, parseInt(sel.tmcId, 10));
                $scope.$emit('ObjectSelected', { feature: fastmap.dataApi.tmcLine(data) });
                // $scope.loadChildPanel(fastmap.dataApi.tmcLine(data.data), 'scripts/components/road/ctrls/attr_tmc_ctrl/tmcLineCtrl', '../../../scripts/components/road/tpls/attr_tmc_tpl/tmcLineTpl.html');
            });
        } else {
            var temp = {
                geoLiveType: 'TMCAREA',
                pid: 0,
                rowId: ''
            };
            $scope.$emit('ObjectSelected', { feature: temp });
        }
    };
    /* $scope.initTmcTree = function () {
     $scope.tmcLineArray = [];
     $scope.tmcTreeData = [];
     };*/

    // 刷新tmcTree
    $scope.$on('setTmcTree', function (event, data) {
        editLayer.clear();
        $scope.selectTmcInfo = [];
        $scope.tmcLineArray = [];
        $scope.selectTmcLocations = [];
        // 当前选中的tmc元素
        for (var i = 0; i < data.tmcPoints.length; i++) {
            var point = {
                type: 'TMCPOINT',
                tmcId: data.tmcPoints[i]
            };
            $scope.selectTmcInfo.push(point);
        }
        if ($scope.selectTmcInfo.length == 1) {
            $scope.activeTmc = $scope.selectTmcInfo[0];
            // 展示tmcpoint信息
            $scope.showTreeSelected($scope.activeTmc);
        }
        $scope.tmcTreeData = data.treeData;
        $scope.getAllTmcLine(data.treeData);
        $scope.setExpendNodes(data.treeData);
        $scope.highLightTmcLine($scope.tmcLineArray);
    });
    // 刷新tmcLocation
    $scope.$on('ReloadData', function (event, data) {
        if (data && data.type != 'tmc') {
            return;
        }
        if (data.childType == 'tmcPoint') {
            editLayer.clear();
            $scope.selectTmcInfo = [];
            $scope.tmcLineArray = [];
            $scope.selectTmcLocations = [];
            // 当前选中的tmc元素
            for (var i = 0; i < data.tmcPoints.length; i++) {
                var point = {
                    type: 'TMCPOINT',
                    tmcId: data.tmcPoints[i]
                };
                $scope.selectTmcInfo.push(point);
            }
            if ($scope.selectTmcInfo.length == 1) {
                $scope.activeTmc = $scope.selectTmcInfo[0];
                // 展示tmcpoint信息
                $scope.showTreeSelected($scope.activeTmc);
            }
            $scope.tmcTreeData = data.treeData;
            $scope.getAllTmcLine(data.treeData);
            $scope.setExpendNodes(data.treeData);
            $scope.highLightTmcLine($scope.tmcLineArray);
        } else {
            editLayer.clear();
            $scope.selectTmcInfo = [];
            $scope.tmcLineArray = [];
            $scope.selectTmcLocations = data.tmcLocations;
            $scope.activeTmc = $scope.selectTmcLocations[0];
            $scope.selectTmcLocation($scope.activeTmc);
        }
    });
    // 排除已经删除的tmcLocation数据
    $scope.$on('refreshTmcLocation', function (event, data) {
        for (var i = 0; i < $scope.selectTmcLocations.length; i++) {
            if ($scope.selectTmcLocations[i].pid == data) {
                $scope.selectTmcLocations.splice(i, 1);
                break;
            }
        }
        if ($scope.selectTmcLocations.length == 0) {
            $scope.$emit('closeLeftPanel', false);
        } else {
            $scope.activeTmc = $scope.selectTmcLocations[0];
            $scope.selectTmcLocation($scope.activeTmc);
        }
    });
});
