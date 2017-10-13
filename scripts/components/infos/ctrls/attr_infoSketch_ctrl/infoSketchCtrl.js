/**
 * Created by zhaohang on 2017/6/1.
 */

angular.module('app').controller('sketchCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.initializeData = function () {
        $scope.sketch = objCtrl.data;
        if ($scope.sketch.feedback.f_array && $scope.sketch.feedback.f_array.length > 0) {
            for (var i = 0; i < $scope.sketch.feedback.f_array.length; i++) {
                if ($scope.sketch.feedback.f_array[i].type == 3) {
                    $scope.sketch.content = $scope.sketch.feedback.f_array[i].content;
                }
            }
        }
    };
    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
