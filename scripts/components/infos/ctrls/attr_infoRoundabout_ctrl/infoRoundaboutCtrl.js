/**
 * Created by Chensonglin on 17.3.31.
 */
angular.module('app').controller('roundaboutCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.initializeData = function () {
        $scope.roundabout = objCtrl.data;
        if ($scope.roundabout.feedback.f_array && $scope.roundabout.feedback.f_array.length > 0) {
            for (var i = 0; i < $scope.roundabout.feedback.f_array.length; i++) {
                if ($scope.roundabout.feedback.f_array[i].type == 3) {
                    $scope.roundabout.content = $scope.roundabout.feedback.f_array[i].content;
                }
            }
        }
    };
    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
