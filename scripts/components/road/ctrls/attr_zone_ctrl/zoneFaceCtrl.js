/**
 * Created by liuyang on 2016/6/29.
 */
var zoneFaceApp = angular.module('app');
zoneFaceApp.controller('zoneFaceController', ['$scope', 'dsEdit', function ($scope, dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var zoneFace = layerCtrl.getLayerById('zoneFace');
    // 初始化
    $scope.initializeData = function () {
        $scope.zoneFaceData = objCtrl.data;// 获取数据
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());// 存储原始数据
        // 回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if ($scope.zoneFaceForm) {
            $scope.zoneFaceForm.$setPristine();
        }
    };
    if (objCtrl.data) {
        $scope.initializeData();
    }

    /**
     *
     */
    $scope.setZoneID = function () {
        $scope.$emit('showFullLoadingOrNot', true);
        var param = {};
        param.pid = $scope.zoneFaceData.pid;
        param.ruleId = 'BATCHZONEID';
        dsEdit.PolygonBatchWork(param).then(function (data) {
            if (typeof data === 'string') {
                $scope.$emit('showFullLoadingOrNot', false);
                swal('不存在需要批处理的link数据', data, 'warning');
            } else {
                $scope.$emit('showFullLoadingOrNot', false);
                swal('赋ZoneID批处理成功：', '处理了' + data.log.length + '条数据', 'success');
            }
        });
    };
    /**
     *
     */
    $scope.deleteZoneID = function () {
        $scope.$emit('showFullLoadingOrNot', true);
        var param = {};
        param.pid = $scope.zoneFaceData.pid;
        param.ruleId = 'BATCHDELZONEID';
        dsEdit.PolygonBatchWork(param).then(function (data) {
            if (typeof data === 'string') {
                $scope.$emit('showFullLoadingOrNot', false);
                swal('不存在需要批处理的link数据', data, 'warning');
            } else {
                $scope.$emit('showFullLoadingOrNot', false);
                swal('删除ZoneID批处理成功：', '处理了' + data.log.length + '条数据', 'success');
            }
        });
    };
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeData);
}]);
