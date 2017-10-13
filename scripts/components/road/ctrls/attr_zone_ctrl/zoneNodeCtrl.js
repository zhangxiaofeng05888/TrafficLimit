/**
 * Created by liuyang on 2016/6/29.
 */
var zoneNodeApp = angular.module('app');
zoneNodeApp.controller('zoneNodeController', ['$scope', function ($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    // 形态
    $scope.form = [
        { id: 0, label: '无' },
        { id: 1, label: '图廓点' },
        { id: 7, label: '角点' }
    ];
    $scope.editFlag = [
        { id: 0, label: '不可编辑' },
        { id: 1, label: '可编辑' }
    ];
    // 种别
    $scope.kind = [
        { id: 1, label: '平面交叉点' },
        { id: 2, label: 'AOIZone 边界点' },
        { id: 3, label: 'KDZone 边界点' }
    ];
    // 初始化
    $scope.initializeData = function () {
        $scope.zoneNodeData = objCtrl.data;
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());// 记录原始数据
    };

    $scope.$on('$destroy', function () {
        console.log('zoneCtrl was destroyed!');
    });
    if (objCtrl.data) {
        $scope.initializeData();
    }
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeData);
}]);
