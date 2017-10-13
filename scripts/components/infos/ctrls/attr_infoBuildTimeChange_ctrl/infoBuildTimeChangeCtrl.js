/**
 * Created by zhaohang on 2017/8/8.
 */
angular.module('app').controller('buildTimeChangeCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.initializeData = function () {
        $scope.buildTimeChange = objCtrl.data;
        if ($scope.buildTimeChange.feedback.f_array && $scope.buildTimeChange.feedback.f_array.length > 0) {
            for (var i = 0; i < $scope.buildTimeChange.feedback.f_array.length; i++) {
                if ($scope.buildTimeChange.feedback.f_array[i].type == 3) {
                    $scope.buildTimeChange.content = $scope.buildTimeChange.feedback.f_array[i].content;
                }
            }
        }
    };
    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);

