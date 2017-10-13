/**
 * Created by wangmingdong on 2016/8/8.
 */

var rdTrafficSignalApp = angular.module('app');
rdTrafficSignalApp.controller('SeCtl', ['$scope', 'dsEdit', function ($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.initializeData = function () {
        $scope.seData = objCtrl.data;
    };
    $scope.initializeData();

    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
