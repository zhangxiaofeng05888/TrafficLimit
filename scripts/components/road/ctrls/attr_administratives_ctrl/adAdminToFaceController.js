/**
 * Created by linglong on 2017/2/16.
 */
angular.module('app').controller('adAdminToFaceController', ['$scope', function ($scope) {
    var eventController = new fastmap.uikit.EventController();
    /**
     * 初始化方法
     */
    var initializeData = function (data) {
        $scope.selectedData = data;
        $scope.faces = data.adFacePid.concat($scope.selectedData.zoneFacePid);
        $scope.faceIndex = -1;
        $scope.pointIndex = -1;
        $scope.selectedFace = null;
    };

    // 选择行政区划点的控制;
    $scope.selectPoint = function (feature, index) {
        $scope.pointIndex = ($scope.pointIndex == -1 || $scope.pointIndex != index) ? index : -1;
        if ([8, 9].indexOf(feature.properties.kind) != -1) {
            $scope.faceType = 'ZONEFACE';
            $scope.faces = $scope.selectedData.zoneFacePid;
        } else {
            $scope.faceType = 'ADFACE';
            $scope.faces = $scope.selectedData.adFacePid;
        }
        feature = ($scope.pointIndex != -1) ? feature : null;
        eventController.fire(L.Mixin.EventTypes.CTRLPANELSELECTED, { feature: feature, objType: 'ADADMIN' });
    };

    // 选择行政区划面;
    $scope.selectFace = function (feature, index) {
        $scope.faceIndex = ($scope.faceIndex == -1 || $scope.faceIndex != index) ? index : -1;
        $scope.selectedFace = feature.properties;
        feature = ($scope.faceIndex != -1) ? feature : null;
        eventController.fire(L.Mixin.EventTypes.CTRLPANELSELECTED, { feature: feature, objType: $scope.selectedFace.geoLiveType });
    };

    $scope.doRealted = function () {
        if ($scope.faceIndex != -1 && $scope.pointIndex != -1) {
            eventController.fire(L.Mixin.EventTypes.JOINFACE);
        } else {
            swal('建立关联出错：', '数据不完整,无法建立关联!', 'error');
        }
    };

    $scope.dismissRealte = function () {
        if ($scope.faceIndex != -1) {
            eventController.fire(L.Mixin.EventTypes.DISMISSFACE);
        } else {
            swal('解除关联出错：', '请首先选择要解除关联的面!', 'error');
        }
    };


    var unbindHandler = $scope.$on('ReloadData-AdminJoinFacesPanel', function (event, data) {
        initializeData(data.data);
    });

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
