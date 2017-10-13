/**
 * Created by Chensonglin on 17.3.31.
 */
angular.module('app').controller('bridgeCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.initializeData = function () {
        $scope.bridge = objCtrl.data;
        if ($scope.bridge.feedback.f_array && $scope.bridge.feedback.f_array.length > 0) {
            for (var i = 0; i < $scope.bridge.feedback.f_array.length; i++) {
                if ($scope.bridge.feedback.f_array[i].type == 3) {
                    $scope.bridge.content = $scope.bridge.feedback.f_array[i].content;
                }
            }
        }
    };
    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
