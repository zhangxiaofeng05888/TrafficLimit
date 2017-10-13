/**
 * Created by linglong on 2015/12/26.
 */
angular.module('app').controller('rdLinkTabPanelCtrl', ['$scope', '$q', '$ocLazyLoad', '$timeout', 'appPath', function ($scope, $q, $ocLazyLoad, $timeout, appPath) {
    var objectCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = fastmap.uikit.SelectController();
    var eventController = fastmap.uikit.EventController();
    var sceneCtrl = FM.mapApi.scene.SceneController.getInstance();
    // tab页初中tpl和ctrl的加载路径;
    var TPL_URL = appPath.road + 'tpls/attr_link_tpl/';
    var CTR_URL = appPath.road + 'ctrls/attr_link_ctrl/';

    // tab页的数据模型;
    $scope.roadTabList = [
        {
            name: '基础属性',
            tpl: 'basicAttrTpl.html'
        },
        {
            name: '道路名称',
            tpl: 'namesTpl.html'
        },
        {
            name: '限速',
            tpl: 'speedTpl.html'
        },
        {
            name: '限制信息',
            tpl: 'restrictInfoTpl.html'
        },
        {
            name: '实时交通',
            tpl: 'realTimeTrafficTpl.html'
        },
        {
            name: '行人导航',
            tpl: 'pedestrianNaviTepl.html'
        }
    ];
    // 初始化方法当前object中的原始数据以及获得当前要编辑的数据;
    var initializeLinkData = function () {
        $scope.linkData = objectCtrl.data;
        // link的几何属性塞进selectFeature;
        var linkArr = $scope.linkData.geometry.coordinates;
        var points = [];
        for (var i = 0, len = linkArr.length; i < len; i++) {
            var pointOfLine = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
            points.push(pointOfLine);
        }
        var line = fastmap.mapApi.lineString(points);
        selectCtrl.onSelected({
            geometry: line,
            id: $scope.linkData.pid,
            type: 'Link',
            direct: $scope.linkData.direct,
            snode: $scope.linkData.sNodePid,
            enode: $scope.linkData.eNodePid
        });
        /*
         * 当进入rdLink的编辑环境后，加载好跟rdLink有关的所有控制器及其自控制器;
         * */
        var llPromises = [];
        // 基础属性部分;
        llPromises.push($ocLazyLoad.load(CTR_URL + 'basicAttrCtrl.js'));
        llPromises.push($ocLazyLoad.load(CTR_URL + 'basicOfFormWayCtrl.js'));
        llPromises.push($ocLazyLoad.load(CTR_URL + 'formTypeFlagCtrl.js'));
        llPromises.push($ocLazyLoad.load(CTR_URL + 'linkZoneCtrl.js'));
        // 道路名称;
        llPromises.push($ocLazyLoad.load(CTR_URL + 'namesCtrl.js'));
        llPromises.push($ocLazyLoad.load(CTR_URL + 'namesOfDetailCtrl.js'));
        // 限速部分;
        llPromises.push($ocLazyLoad.load(CTR_URL + 'speedCtrl.js'));
        llPromises.push($ocLazyLoad.load(CTR_URL + 'speedOfConditionCtrl.js'));
        // 限制部分;
        llPromises.push($ocLazyLoad.load(CTR_URL + 'restrictInfoCtrl.js'));
        llPromises.push($ocLazyLoad.load(CTR_URL + 'limitOfOrdinaryCtrl.js'));
        llPromises.push($ocLazyLoad.load(CTR_URL + 'limitOfTruckCtrl.js'));
        // 实时交通;
        llPromises.push($ocLazyLoad.load(CTR_URL + 'realTimeTrafficCtrl.js'));
        llPromises.push($ocLazyLoad.load(CTR_URL + 'rticOfIntCtrl.js'));
        llPromises.push($ocLazyLoad.load(CTR_URL + 'rticOfCar.js'));
        // 行人导航
        llPromises.push($ocLazyLoad.load(CTR_URL + 'pedestrianNaviCtrl.js'));
        llPromises.push($ocLazyLoad.load(CTR_URL + 'pedestrianNaviOfSidewalkCtrl.js'));
        llPromises.push($ocLazyLoad.load(CTR_URL + 'pedestrianNaviOfWalkStairCtrl.js'));
        $q.all(llPromises).then(function () {
            // 设置初始要加载的tpl;
            if (!$scope.roadTabSelect) {
                $scope.roadPantlUrl = TPL_URL + $scope.roadTabList[0].tpl;
                $scope.roadTabSelect = $scope.roadTabList[0].tpl;
            } else {
                $scope.roadTabSelect = $scope.roadTabSelect;
                $scope.roadPantlUrl = TPL_URL + $scope.roadTabSelect;
            }
        });
    };

    var getLimitLayer = function (layID) {
        var layers = sceneCtrl.getSceneLayers();
        var isLoaded = sceneCtrl.isLayerLoaded(layID);

        //  如果图层已经加载，并且visible为true
        if (isLoaded) {
            return null;
        }

        //  下面的if，说明图层已经加载，但是visible为false
        for (var i = 0, len = layers.length; i < len; i++) {
            if (layers[i].id === layID) {
                layers[i].setVisible();
                sceneCtrl.refreshMap();
                return null;
            }
        }

        return sceneCtrl.getLayerById(layID);
    };

    var loadLimitLayer = function () {
        var limitLayer = getLimitLayer('RdLinkSpeedLimit');    //  线限速
        var limitDependentLayer = getLimitLayer('RdLinkSpeedLimitDependent');  //  条件线限速
        var layers = [];

        if (limitLayer) {
            layers.push(limitLayer);
        }

        if (limitDependentLayer) {
            layers.push(limitDependentLayer);
        }

        if (layers.length) {
            sceneCtrl.addToTemporary(layers);
        }
    };

    var canRemove = function (layID) {
        var curScene = sceneCtrl.getCurrentScene();

        //  下面的情况说明线限速图层不是临时添加的，存在于场景本身的配置图层中，这种情况，不删除线限速图层
        for (var i = 0, len = curScene.layers.length; i < len; i++) {
            if (curScene.layers[i].id === layID) {
                return false;
            }
        }
        return true;
    };

    var removeLimitLayer = function () {
        //  如果打开线限速场景后，点击选择线限速，不删除图层
        if (objectCtrl.data && (objectCtrl.data.geoLiveType === 'RDLINKSPEEDLIMIT' || objectCtrl.data.geoLiveType === 'RDLINKSPEEDLIMIT_DEPENDENT')) {
            return;
        }

        var flag1 = canRemove('RdLinkSpeedLimit');
        var flag2 = canRemove('RdLinkSpeedLimitDependent');
        var ids = [];

        if (flag1) {
            ids.push('RdLinkSpeedLimit');
        }

        if (flag2) {
            ids.push('RdLinkSpeedLimitDependent');
        }

        if (ids.length) {
            sceneCtrl.removeFromTemporary(ids);
        }
    };

    /*
     *  rdLink各个tab页切换的程序控制:
     *  （1） 当前tab页active的显示；
     *  （2） 加载对应的tpl；
     * */
    $scope.changeRoadModule = function (item) {
        $scope.roadTabSelect = item.tpl;
        $scope.roadPantlUrl = TPL_URL + item.tpl;
        if (item.tpl === 'speedTpl.html') {
            loadLimitLayer();
        } else {
            removeLimitLayer();
        }
    };

    /*
    * 计算角度，限速和限制继承此方法
    * */
    $scope.angleOfLink = function (pointA, pointB) {
        var PI = Math.PI;
        var angle;
        if ((pointA.x - pointB.x) === 0) {
            angle = PI / 2;
        } else {
            angle = Math.atan((pointA.y - pointB.y) / (pointA.x - pointB.x));
        }
        return angle;
    };

    var unbindHandler = $scope.$on('ReloadData', initializeLinkData);
    $scope.$on('$destroy', function () {
        removeLimitLayer();
        unbindHandler = null;
    });

    eventController.on(L.Mixin.EventTypes.LINKDIRECTCHANGED, function (data) {
        $scope.linkData = FM.Util.clone(objectCtrl.originalData);
        $scope.linkData.direct = data.data.direct;
        objectCtrl.data = $scope.linkData;
        $scope.linkData.changeDirect(objectCtrl);
        // objectCtrl.data = $scope.linkData;
        $scope.$apply();
    });
}]);
