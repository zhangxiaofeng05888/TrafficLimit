/**
 * Created by Chensonglin on 17.3.30.
 */

angular.module('app').controller('roadPACtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.initializeData = function () {
        $scope.roadPA = objCtrl.data;
        if ($scope.roadPA.feedback.f_array && $scope.roadPA.feedback.f_array.length > 0) {
            for (var i = 0; i < $scope.roadPA.feedback.f_array.length; i++) {
                if ($scope.roadPA.feedback.f_array[i].type == 3) {
                    $scope.roadPA.content = $scope.roadPA.feedback.f_array[i].content;
                }
            }
        }
    };

    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);

