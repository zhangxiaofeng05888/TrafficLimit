/**
 * Created by zhongxiaoming on 2017/7/28.
 */

angular.module('app').controller('deletePropertyInProgressCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.initializeData = function () {
        $scope.delBuilding = objCtrl.data;
        if ($scope.delBuilding.feedback.f_array && $scope.delBuilding.feedback.f_array.length > 0) {
            for (var i = 0; i < $scope.delBuilding.feedback.f_array.length; i++) {
                if ($scope.delBuilding.feedback.f_array[i].type == 3) {
                    $scope.delBuilding.content = $scope.delBuilding.feedback.f_array[i].content;
                }
            }
        }
    };
    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);
    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);

