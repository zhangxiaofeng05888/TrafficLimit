/**
 * Created by liuyang on 2016/12/10.
 */
angular.module('app').controller('CarRentalCtl', function ($scope) {
    var objectCtrl = fastmap.uikit.ObjectEditController();
    $scope.editWeb = false;
    $scope.editPhone = false;

    var initDeepData = function () {
        if (objectCtrl.data.carrentals.length === 0) { // 解决默认carrentals为空的情况
            objectCtrl.data.carrentals[0] = new FM.dataApi.IxPoiCarRental({ poiPid: objectCtrl.data.pid });
        }
        $scope.carrentals = objectCtrl.data.carrentals[0];
        if ($scope.carrentals.webSite) {
            $scope.editWeb = true;
        } else {
            $scope.editWeb = false;
        }
        if ($scope.carrentals.phone400) {
            $scope.editPhone = true;
        } else {
            $scope.editPhone = false;
        }
    };
    initDeepData();
    $scope.$on('reloadDeepData', function () {
        initDeepData();
    });

    /**
     * 部分属性转全角
     */
    $scope.strToDBC = function (type, str) {
        $scope.carrentals[type] = Utils.ToDBC(str);
    };
    /**
     * 打开网址
     */
    $scope.showWebSite = function () {
        if ($scope.carrentals.webSite) {
            window.open($scope.carrentals.webSite);
        }
    };
    /**
     * 打开网址
     */
    $scope.openBaidu = function () {
        window.open('https://www.baidu.com');
    };
});
