/**
 * Created by zhaohang on 2017/6/6.
 */
angular.module('app').controller('gpsDotCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = fastmap.uikit.SelectController();
    // 初始化函数;
    $scope.initializeData = function () {
        $scope.gpsDotData = objCtrl.data;
        if ($scope.gpsDotData.feedback.f_array && $scope.gpsDotData.feedback.f_array.length > 0) {
            for (var i = 0; i < $scope.gpsDotData.feedback.f_array.length; i++) {
                if ($scope.gpsDotData.feedback.f_array[i].type == 3) {
                    $scope.gpsDotData.content = $scope.gpsDotData.feedback.f_array[i].content;
                }
            }
        }
    };
    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);

