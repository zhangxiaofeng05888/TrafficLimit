/**
 * Created by Chensonglin on 17.3.30.
 */
angular.module('app').controller('busLaneCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.initializeData = function () {
        $scope.busLane = objCtrl.data;
        if ($scope.busLane.feedback.f_array && $scope.busLane.feedback.f_array.length > 0) {
            for (var i = 0; i < $scope.busLane.feedback.f_array.length; i++) {
                if ($scope.busLane.feedback.f_array[i].type == 3) {
                    $scope.busLane.content = $scope.busLane.feedback.f_array[i].content;
                }
            }
        }
    };
    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);

