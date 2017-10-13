/**
 * Created by Chensonglin on 17.3.31.
 */
angular.module('app').controller('maintenanceCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.initializeData = function () {
        $scope.maintenance = objCtrl.data;
        if ($scope.maintenance.feedback.f_array && $scope.maintenance.feedback.f_array.length > 0) {
            for (var i = 0; i < $scope.maintenance.feedback.f_array.length; i++) {
                if ($scope.maintenance.feedback.f_array[i].type == 3) {
                    $scope.maintenance.content = $scope.maintenance.feedback.f_array[i].content;
                }
            }
        }
    };
    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
