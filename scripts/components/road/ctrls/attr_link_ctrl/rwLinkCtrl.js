/**
 * Created by wuz on 2016/6/24.
 */
var rwLinkZone = angular.module('app');
rwLinkZone.controller('rwLinkController', ['$scope', 'appPath', 'dsEdit', '$ocLazyLoad', function ($scope, appPath, dsEdit, $ocLazyLoad) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var selectCtrl = fastmap.uikit.SelectController();
    var rwLink = layerCtrl.getLayerById('rwLink');
    var rwNode = layerCtrl.getLayerById('rwNode');

    $scope.kind = [
        { id: 1, label: '铁路' },
        { id: 2, label: '磁悬浮' },
        { id: 3, label: '地铁/轻轨' }
    ];
    $scope.form = [
        { id: 0, label: '无' },
        { id: 1, label: '桥' },
        { id: 2, label: '隧道' }
    ];
    $scope.scale = [
        { id: 0, label: '2.5w' },
        { id: 1, label: '20w' },
        { id: 2, label: '100w' }
    ];
    $scope.detailFlag = [
        { id: 0, label: '不应用' },
        { id: 1, label: '只存在于详细区域' },
        { id: 2, label: '只存在于广域区域' },
        { id: 3, label: '存在于详细和广域区域' }
    ];


    var initializeData = function () {
        $scope.rwLinkData = objCtrl.data;
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        if ($scope.rwLinkData.names.length >= 1) {
            $scope.addBtnShow = false;
        } else {
            $scope.addBtnShow = true;
        }
        var linkArr = $scope.rwLinkData.geometry.coordinates;
        var points = [];
        for (var i = 0, len = linkArr.length; i < len; i++) {
            var pointOfLine = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
            points.push(pointOfLine);
        }
        var line = fastmap.mapApi.lineString(points);
        selectCtrl.onSelected({
            geometry: line,
            id: $scope.rwLinkData.pid,
            type: 'Link',
            direct: $scope.rwLinkData.direct,
            snode: $scope.rwLinkData.sNodePid,
            enode: $scope.rwLinkData.eNodePid
        });
        $ocLazyLoad.load('../../scripts/components/road/ctrls/attr_link_ctrl/namesOfRwDetailCtrl.js');
    };

    // 增加铁路名
    $scope.addRdName = function () {
        var newName = fastmap.dataApi.rwLinkName({ linkPid: $scope.rwLinkData.pid });
        $scope.rwLinkData.names.unshift(newName);
        if ($scope.rwLinkData.names.length >= 1) {
            $scope.addBtnShow = false;
        }
    };
    // 删除道路名;
    $scope.minusName = function (id) {
        $scope.rwLinkData.names.splice(id, 1);
        if ($scope.rwLinkData.names.length == 0) {
            $scope.addBtnShow = true;
        }
    };
    // 当前选中的名称数据的索引;
    $scope.currentIndex = undefined;
    // 选中行进行名称编辑时更新当前数据以及索引;
    $scope.rememberNameNum = function (index) {
        $scope.currentIndex = index;
        $scope.currentActiveRoadName = $scope.rwLinkData.names[index];
    };


    var unbindHandler = $scope.$on('ReloadData', initializeData);
    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
