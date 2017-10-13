/**
 * Created by Chensonglin   on 17.3.30.
 */
angular.module('app').controller('trafficSignalCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.initializeData = function () {
        $scope.trafficLights = objCtrl.data;
        if ($scope.trafficLights.feedback.f_array && $scope.trafficLights.feedback.f_array.length > 0) {
            for (var i = 0; i < $scope.trafficLights.feedback.f_array.length; i++) {
                if ($scope.trafficLights.feedback.f_array[i].type == 3) {
                    $scope.trafficLights.content = $scope.trafficLights.feedback.f_array[i].content;
                }
            }
        }
    };
    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
