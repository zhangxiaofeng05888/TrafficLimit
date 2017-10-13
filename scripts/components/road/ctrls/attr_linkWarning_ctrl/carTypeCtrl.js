var oridinaryInfoApp = angular.module('app', []);
oridinaryInfoApp.controller('carTypeController', function ($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventCtrl = fastmap.uikit.EventController();
    // 从父获取数据
    $scope.carshowData = $scope.vehicleOptions;
    $scope.carSelect = function (item) {
        if (item.checked) {
            item.checked = false;
            for (var i in $scope.carData) {
                if ($scope.carData[i].id.toString() == item.id) {
                    $scope.carData.splice(i, 1);
                }
            }
        } else {
            item.checked = true;
            $scope.carData.push(item);
        }
        $scope.$emit('warningCarType');
    };
    eventCtrl.off(eventCtrl.eventTypes.SELECTEDVEHICLECHANGE);
    eventCtrl.on(eventCtrl.eventTypes.SELECTEDVEHICLECHANGE, $scope.initializeData);
});
