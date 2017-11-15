/**
 * Created by zhaohang on 2017/11/15.
 */
angular.module('app').controller('limitLineCtl', ['$scope', '$timeout', 'dsEdit', 'appPath', '$ocLazyLoad', function ($scope, $timeout, dsEdit, appPath, $ocLazyLoad) {
    var eventCtrl = fastmap.uikit.EventController();
    var selectCtrl = fastmap.uikit.SelectController();
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();

    $scope.linkDir = [{
        id: 0,
        label: '未限制'
    }, {
        id: 1,
        label: '双方向限行'
    }, {
        id: 2,
        label: '顺方向限行'
    }, {
        id: 3,
        label: '逆方向限行'
    }];
    $scope.initializeData = function () {
        $scope.limitLineDate = objCtrl.data;
    };

    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
