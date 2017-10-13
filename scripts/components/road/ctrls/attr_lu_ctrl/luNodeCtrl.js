/**
 * Created by mali on 2016/7/22.
 */
angular.module('app').controller('luNodeController', ['$scope', function ($scope) {
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
        { id: 1, label: '平面交叉点' }
    ];

    // 初始化
    $scope.initializeData = function () {
        $scope.luNodeData = objCtrl.data;
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
    };


    $scope.$on('$destroy', function () {
        console.log('luCtrl was destroyed!');
    });
    if (objCtrl.data) {
        $scope.initializeData();
    }
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeData);
}]);
