/**
 * Created by wangmingdong on 2017/2/6.
 */

angular.module('app').controller('selectTmcCtrl', ['$scope', '$q', '$ocLazyLoad', '$rootScope', 'dsFcc', 'dsEdit', 'dsMeta', 'appPath', '$interval', 'hotkeys',
    function ($scope, $q, $ocLazyLoad, $rootScope, dsFcc, dsEdit, dsMeta, appPath, $interval, hotkeys) {
        var selectCtrl = fastmap.uikit.SelectController();
        var objCtrl = fastmap.uikit.ObjectEditController();
        var layerCtrl = fastmap.uikit.LayerController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var eventController = fastmap.uikit.EventController();
        var transform = new fastmap.mapApi.MecatorTranform();
        var rdLink = layerCtrl.getLayerById('rdLink');
        var rwLink = layerCtrl.getLayerById('rwLink');
        var lcLink = layerCtrl.getLayerById('lcLink');
        var rdNode = layerCtrl.getLayerById('rdNode');
        var workPoint = layerCtrl.getLayerById('workPoint');
        var editLayer = layerCtrl.getLayerById('edit');
        var poiLayer = layerCtrl.getLayerById('poi');
        var crfData = layerCtrl.getLayerById('crfData');
        var tmcLayer = layerCtrl.getLayerById('tmcData');
        var highRenderCtrl = fastmap.uikit.HighRenderController();
        var highlightCtrl = FM.mapApi.render.HighlightController.getInstance();
        var feedback = new fastmap.mapApi.Feedback();
        var featCodeCtrl = fastmap.uikit.FeatCodeController();

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
        /* 查询TMC树形结构 */
        $scope.getTmcTree = function (tmcPoints) {
            var param = {
                tmcIds: tmcPoints
            };
            dsMeta.queryTmcTree(param).then(function (data) {
                $scope.tmcTreeData = [data.data];
                $scope.$emit('ShowInfoPage', {
                    type: 'tmcTreePanel',
                    data: {
                        type: 'tmc',
                        childType: 'tmcPoint',
                        treeData: $scope.tmcTreeData,
                        tmcPoints: tmcPoints
                    }
                });
            });
        };
        // $scope.showTmcScene();
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

        // 框选操作
        $scope.selectRectData = function (data) {
            highlightCtrl.clear();
            // 移除新增的C按键事件
            hotkeys.del('c');
            $scope.selectTmcPoints = []; // 框选出的tmcPoint
            $scope.selectTmcLocations = []; // 框选出的tmcLocation
            $scope.tmcLocationList = [];
            if (data && data.data && data.data.length == 0) {
                $scope.toolTipText = '请重新框选！';
                return;
            }
            // 筛选排除非TMCPoint 和 TMCLocation要素
            for (var i = 0; i < data.data.length; i++) {
                if (data.data[i].data) {
                    if (data.data[i].data.properties.geoLiveType == 'TMCPOINT') {
                        if (data.data[i].data.properties.id != undefined) {
                            $scope.selectTmcPoints.push(data.data[i].data.properties.id);
                        }
                    } else if (data.data[i].data.properties.geoLiveType == 'RDTMCLOCATION') {
                        if (data.data[i].data.properties.id != undefined) {
                            $scope.selectTmcLocations.push(data.data[i].data.properties.id);
                        }
                    }
                }
            }
            $scope.selectTmcPoints = Utils.distinctArr($scope.selectTmcPoints);
            $scope.selectTmcLocations = Utils.distinctArr($scope.selectTmcLocations);
            for (var k = 0; k < $scope.selectTmcPoints.length; k++) {
                highlightCtrl.highlight(formatTmcPoint($scope.selectTmcPoints[k]));
            }
            for (var l = 0; l < $scope.selectTmcLocations.length; l++) {
                highlightCtrl.highlight(formatTmcLocation($scope.selectTmcLocations[l]));
            }
            // 如果选择的只有tmcLocation 则查询tmcLocation， 如果选择的既有tmcLocation 还有 tmcPoint ，查询tmc树
            if ($scope.selectTmcPoints.length) {
                $scope.getTmcTree($scope.selectTmcPoints);
            } else if ($scope.selectTmcLocations.length) {
                for (var q = 0; q < $scope.selectTmcLocations.length; q++) {
                    $scope.selectTmcLocations[q] = parseInt($scope.selectTmcLocations[q], 10);
                }
                dsEdit.getTmcLocatoinByPids($scope.selectTmcLocations).then(function (tmcLocationData) {
                    $scope.$emit('ShowInfoPage', {
                        type: 'tmcTreePanel',
                        data: {
                            type: 'tmc',
                            childType: 'tmcLocation',
                            tmcLocations: tmcLocationData
                        }
                    });
                });
            } else {
                $scope.toolTipText = '请重新框选！';
                return;
            }
            map.currentTool.disable();
            tooltipsCtrl.disable();
        };

        $scope.selectTmc = function (e) {
            // resetToolAndMap();
            // 开始启动工具
            $scope.$emit('Map-EnableTool', {
                type: 'select' // 目前用于关闭临时图层的控制
            });
            $scope.showTmcScene();
            editLayer.clear();
            shapeCtrl.shapeEditorResult.setFinalGeometry(null);
            feedback.clear();
            highlightCtrl.clear();
            // 框选tmc显示数据结构
            map.currentTool = new fastmap.uikit.SelectForRectang({
                map: map,
                shapeEditor: shapeCtrl,
                LayersList: [tmcLayer]
            });
            map.currentTool.enable();
            $scope.toolTipText = '请框选TMCPoint 或 TMCLocation！';
            eventController.off(eventController.eventTypes.GETRECTDATA, $scope.selectRectData);
            eventController.on(eventController.eventTypes.GETRECTDATA, $scope.selectRectData);
            tooltipsCtrl.setCurrentTooltip($scope.toolTipText);
            // 工具启动成功
            if (map.currentTool.enabled()) {
                $scope.$emit('Map-ToolEnabled', {
                    event: e,
                    tool: map.currentTool,
                    operationType: 'EDIT'
                });
            }
        };
    }
]);
