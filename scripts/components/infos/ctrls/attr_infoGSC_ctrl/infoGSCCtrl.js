/**
 * Created by zhaohang on 2017/6/20.
 */
angular.module('app').controller('gscCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = fastmap.uikit.SelectController();
    // 初始化函数;
    $scope.initializeData = function () {
        $scope.gscData = objCtrl.data;
        if ($scope.gscData.feedback.f_array && $scope.gscData.feedback.f_array.length > 0) {
            for (var i = 0; i < $scope.gscData.feedback.f_array.length; i++) {
                if ($scope.gscData.feedback.f_array[i].type == 3) {
                    $scope.gscData.content = $scope.gscData.feedback.f_array[i].content;
                }
            }
        }
    };
    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);

