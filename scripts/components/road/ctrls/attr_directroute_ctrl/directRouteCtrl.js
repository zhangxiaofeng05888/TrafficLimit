/**
 * Created by wangmingdong on 2016/8/5.
 */

var rdElectronicEyeApp = angular.module('app');
rdElectronicEyeApp.controller('DirectRouteCtl', ['$scope', function ($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.initializeData = function () {
        $scope.directRouteData = objCtrl.data;
    };

    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
