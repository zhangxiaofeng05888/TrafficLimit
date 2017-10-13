/*
 * Created by chenx on 2017 / 5 / 22.
 */
angular.module('app').controller('SceneLayersController', function ($scope, appTemp) {
    var sceneCtrl = FM.mapApi.scene.SceneController.getInstance();
    var sourceCtrl = FM.mapApi.source.SourceController.getInstance();
    var leafletMap = sceneCtrl.getLeafletMap();

    $scope.typeList = [{
        value: 'feature',
        text: '常规渲染'
    }, {
        value: 'thematic',
        text: '专题渲染'
    }, {
        value: 'tips',
        text: 'Tips图层'
    }, {
        value: 'reference',
        text: '参考图层'
    }];

    $scope.tipStatus = [{
        id: 1,
        label: App.Temp.qcTaskFlag ? '待质检' : '待作业',
        workStatus: 0
    }, {
        id: 2,
        label: App.Temp.qcTaskFlag ? '已质检' : '已作业',
        workStatus: 2
    }, {
        id: 3,
        label: '有问题',
        workStatus: 1
    }, {
        id: 4,
        label: '任务外',
        workStatus: 11  //  选中时，不传11；未选中时，传11；俊芳说服务那边11是公用的，不好改，所以web用到的地方要取反处理
    }];

    $scope.sceneType = appTemp.sceneType || 'feature';

    $scope.selectedSceneId = null;

    $scope.visibleBackgroundLayerId = null;

    $scope.allTips = { flag: false };

    $scope.test = function () {
        appTemp.sceneType = $scope.sceneType;
    };

    var resetAllTipsFlag = function () {
        var f = true;
        for (var i = 0; i < $scope.tipLayers.length; i++) {
            if (!$scope.tipLayers[i].checked) {
                f = false;
                break;
            }
        }

        $scope.allTips.flag = f;
    };

    var resetLayerChecked = function () {
        for (var i = 0; i < $scope.layers.length; i++) {
            $scope.layers[i].checked = sceneCtrl.isLayerLoaded($scope.layers[i].id);
            if ($scope.layers[i].label === 'background' && $scope.layers[i].checked) {
                $scope.visibleBackgroundLayerId = $scope.layers[i].id;
            }
        }
        resetAllTipsFlag();
    };

    var resetTipStatus = function () {
        var source = sourceCtrl.getSource('tipSource');
        var workStatus = source.getParameter('workStatus') || [];
        for (var i = 0; i < $scope.tipStatus.length; i++) {
            if (workStatus.indexOf($scope.tipStatus[i].workStatus) >= 0) {
                $scope.tipStatus[i].checked = true;
            }
        }

        $scope.tipStatus[3].checked = !(workStatus.indexOf(11) >= 0);   //  '任务外'特殊处理
    };

    var resetThematicFigureBar = function (curScene) {
        if (curScene.type === 'thematic') {
            $scope.$emit('Open-ThematicFigureBar', curScene);
        } else {
            $scope.$emit('Close-ThematicFigureBar');
        }
    };

    var refreshPanel = function (data) {
        var currentScene = data.newScene;

        $scope.currentScene = currentScene;
        $scope.selectedSceneId = currentScene.id;
        $scope.sceneType = appTemp.sceneType = currentScene.type;

        resetLayerChecked();
        resetThematicFigureBar(currentScene);
    };

    leafletMap.on('SceneChanged', refreshPanel);

    $scope.refreshCurrentScene = function (item) {
        resetLayerChecked();
        sceneCtrl.refreshMap();
    };

    $scope.goUp = function (index) {
        var layers = $scope.sceneLayers;
        index = layers.length - index - 1;
        if (index === layers.length - 1) {
            return;
        }

        var temp = layers.splice(index, 1)[0];

        layers.splice(index + 1, 0, temp);

        sceneCtrl.refreshScene();
    };

    $scope.goDown = function (index) {
        var layers = $scope.sceneLayers;
        index = layers.length - index - 1;
        if (index === 0) {
            return;
        }

        var temp = layers.splice(index, 1)[0];

        layers.splice(index - 1, 0, temp);

        sceneCtrl.refreshScene();
    };

    $scope.toTop = function (index) {
        var layers = $scope.sceneLayers;
        index = layers.length - index - 1;
        if (index === layers.length - 1) {
            return;
        }

        var temp = layers.splice(index, 1)[0];

        layers.push(temp);

        sceneCtrl.refreshScene();
    };

    $scope.toBottom = function (index) {
        var layers = $scope.sceneLayers;
        index = layers.length - index - 1;
        if (index === 0) {
            return;
        }

        var temp = layers.splice(index, 1)[0];

        layers.unshift(temp);

        sceneCtrl.refreshScene();
    };

    $scope.deleteLayer = function (item) {
        sceneCtrl.removeFromScene(item.id);
        resetLayerChecked();
    };

    $scope.selectScene = function (scene) {
        sceneCtrl.changeScene(scene.id);
    };

    //  判断图层是否已经被添加到当前地图场景中, 如果存在，返回对应scenelayer
    var getSceneLayer = function (layer) {
        for (var i = 0, len = $scope.sceneLayers.length; i < len; i++) {
            if ($scope.sceneLayers[i].id === layer.id) {
                return $scope.sceneLayers[i];
            }
        }
        return null;
    };

    $scope.toggleLayer = function (layer) {
        if (layer.checked) {
            var sceneLayer = getSceneLayer(layer);

            if (sceneLayer) {
                sceneLayer.setVisible();
                sceneCtrl.refreshMap();
            } else {
                layer.setVisible(); //  专门针对，初始化时，道路标注和grid子任务中fc预处理tips的visible为false的情况
                sceneCtrl.addToScene(layer);
            }
        } else {
            sceneCtrl.removeFromScene(layer.id);
        }

        if (layer.label === 'tip') {
            if (layer.checked) {
                resetAllTipsFlag();
            } else {
                $scope.allTips.flag = false;
            }
        }
    };

    $scope.toggleBackgroundLayer = function (layer, event) {
        if (layer.id === $scope.visibleBackgroundLayerId) {
            sceneCtrl.removeFromBackground(layer.id);
            $scope.visibleBackgroundLayerId = null;
        } else {
            if ($scope.visibleBackgroundLayerId) {
                sceneCtrl.removeFromBackground($scope.visibleBackgroundLayerId);
            }
            sceneCtrl.addToBackground(layer);
            $scope.visibleBackgroundLayerId = layer.id;
        }
    };

    $scope.toggleOverlayLayer = function (layer) {
        if (layer.checked) {
            sceneCtrl.addToOverlay(layer);
        } else {
            sceneCtrl.removeFromOverlay(layer.id);
        }
    };

    $scope.toggleTipStatus = function (item) {
        var i;
        var workStatus = [];
        for (i = 0; i < $scope.tipStatus.length; i++) {
            if ($scope.tipStatus[i].checked) {
                workStatus.push($scope.tipStatus[i].workStatus);
            }
        }

        //  '任务外'特殊处理
        i = workStatus.indexOf(11);
        if (i > -1) {
            workStatus.splice(i, 1);
        } else {
            workStatus.push(11);
        }

        var source = sourceCtrl.getSource('tipSource');
        source.setParameter('workStatus', workStatus);
        var types = [];
        for (i = 0; i < $scope.tipLayers.length; i++) {
            if ($scope.tipLayers[i].checked) {
                types.push($scope.tipLayers[i].getFeatureType());
            }
        }
        sceneCtrl.redrawLayerByGeoLiveTypes(types);
    };

    $scope.toggleAllTips = function () {
        var layers,
            layerIds;
        if ($scope.allTips.flag) {
            layers = $scope.tipLayers.filter(function (item) {
                if (!item.checked) {
                    item.checked = true;
                    item.setVisible();  //  初始化时某个图层visible为false，删除后重新添加，应为选中状态
                    var sceneLayer = getSceneLayer(item);
                    if (sceneLayer) {
                        sceneLayer.setVisible();
                        return false;
                    }
                    return true;
                }
                return false;
            });

            if (layers.length > 0) {
                sceneCtrl.addToScene(layers);
            } else {
                sceneCtrl.refreshMap();
            }
        } else {
            layerIds = [];
            for (var i = 0; i < $scope.tipLayers.length; i++) {
                if ($scope.tipLayers[i].checked) {
                    $scope.tipLayers[i].checked = false;
                    layerIds.push($scope.tipLayers[i].id);
                }
            }
            sceneCtrl.removeFromScene(layerIds);
        }
    };

    var _sortByPy = function (a, b) {
        var res = 0;
        var value1 = window.pinyinUtil.getPinyin(a.name, '', false, false).toLowerCase();
        var value2 = window.pinyinUtil.getPinyin(b.name, '', false, false).toLowerCase();
        if (value1 > value2) {
            res = 1;
        } else if (value1 < value2) {
            res = -1;
        }
        return res;
    };

    var initialize = function () {
        $scope.scenes = sceneCtrl.getScenes();
        $scope.layers = sceneCtrl.getLayers();

        $scope.featureLayers = sceneCtrl.getLayersByLabel('feature');
        $scope.thematicLayers = sceneCtrl.getLayersByLabel('thematic');
        $scope.tipLayers = sceneCtrl.getLayersByLabel('tip');
        $scope.tipLayers.sort(_sortByPy);
        $scope.backLayers = sceneCtrl.getLayersByLabel('background');
        $scope.overLayers = sceneCtrl.getLayersByLabel('overlay');

        // 当前场景，当前场景下的图层只包含了场景配置的图层
        $scope.currentScene = sceneCtrl.getCurrentScene();
        if ($scope.currentScene) {
            $scope.selectedSceneId = $scope.currentScene.id;
            resetThematicFigureBar($scope.currentScene);
        }
        // 当前加载到地图的场景图层，包含当前场景的图层，用户勾选的图层，以及编辑要素时临时添加的依赖图层
        $scope.sceneLayers = sceneCtrl.getSceneLayers();

        resetLayerChecked();

        resetTipStatus();
    };

    $scope.$on('ReloadData', initialize);
    $scope.$on('$destroy', function () {
        leafletMap.off('SceneChanged', refreshPanel);
    });
});
