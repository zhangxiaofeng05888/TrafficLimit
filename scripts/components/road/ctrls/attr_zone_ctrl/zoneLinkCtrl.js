/**
 * Created by liuyang on 2016/6/29.
 */
var zoneLinkApp = angular.module('app');
zoneLinkApp.controller('zoneLinkController', ['$scope', 'dsEdit', function ($scope, dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var zoneLink = layerCtrl.getLayerById('zoneLink');
    var zoneNode = layerCtrl.getLayerById('zoneNode');
    var zoneFace = layerCtrl.getLayerById('zoneFace');
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.kindOpt = [
        { id: 0, label: '假想线' },
        { id: 1, label: 'AOIZONE边界线' },
        { id: 2, label: 'KDZONE边界线' }
    ];
    $scope.form = [
        { id: 0, label: '未调查' },
        { id: 1, label: '无属性' }
    ];
    $scope.scale = [
        { id: 0, label: '2.5w' },
        { id: 1, label: '20w' },
        { id: 2, label: '100w' }
    ];

    // 初始化
    $scope.initializeData = function () {
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());// 存储原始数据
        $scope.zoneLinkData = objCtrl.data;
        // 回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if ($scope.zoneLinkForm) {
            $scope.zoneLinkForm.$setPristine();
        }
        var linkArr = $scope.zoneLinkData.geometry.coordinates;
        var points = [];
        for (var i = 0, len = linkArr.length; i < len; i++) {
            var pointOfLine = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
            points.push(pointOfLine);
        }
        var line = fastmap.mapApi.lineString(points);
        selectCtrl.onSelected({// 存储选择数据信息
            geometry: line,
            id: $scope.zoneLinkData.pid,
            type: 'Link',
            direct: $scope.zoneLinkData.direct,
            snode: $scope.zoneLinkData.sNodePid,
            enode: $scope.zoneLinkData.eNodePid
        });
    };
    if (objCtrl.data) {
        $scope.initializeData();
    }

    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeData);
}]);
