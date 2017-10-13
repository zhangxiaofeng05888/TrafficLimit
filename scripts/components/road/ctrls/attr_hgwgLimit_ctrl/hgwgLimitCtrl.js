/**
 * Created by zhaohang on 2017/1/4.
 */
angular.module('app').controller('hgwgLimitCtl', ['$scope', '$timeout', 'dsEdit', 'appPath', '$ocLazyLoad', function ($scope, $timeout, dsEdit, appPath, $ocLazyLoad) {
    var eventCtrl = fastmap.uikit.EventController();
    var selectCtrl = fastmap.uikit.SelectController();
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var relationData = layerCtrl.getLayerById('relationData');

    $scope.directList = [
        { id: 0, label: '未调查' },
        { id: 2, label: '顺方向' },
        { id: 3, label: '逆方向' }
    ];

    $scope.initializeData = function () {
        if ($scope.hgwgLimitForm) {
            $scope.hgwgLimitForm.$setPristine();
        }
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        selectCtrl.onSelected({
            data: objCtrl.data.getIntegrate()
        });
        $scope.hgwgLimitObj = objCtrl.data;
        if ($scope.hgwgLimitObj.geometry && $scope.hgwgLimitObj.geometry.coordinates.length == 2) {
            $scope.hgwgLimitObj.geometryStr = $scope.hgwgLimitObj.geometry.coordinates[0] + ',' + $scope.hgwgLimitObj.geometry.coordinates[1];
        }
    };

    $scope.formateNumbers = function (field, maxVal, len) {
        var val = $scope.hgwgLimitObj[field];
        if (!val) {
            $scope.hgwgLimitObj[field] = 0.00;
            return;
        }
        var b = parseFloat(val);
        if (b > maxVal) {
            b = maxVal;
        }
        $scope.hgwgLimitObj[field] = parseFloat(Number(b).toFixed(len));
    };

    // 根据pid重新请求数据
    $scope.refreshData = function () {
        dsEdit.getByPid($scope.hgwgLimitObj.pid, 'RDHGWGLIMIT').then(function (data) {
            if (data) {
                objCtrl.setCurrentObject('RDHGWGLIMIT', data);
                objCtrl.setOriginalData(objCtrl.data.getIntegrate());
            }
        });
    };
    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
