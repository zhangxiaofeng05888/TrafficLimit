/**
 * Created by zhaohang on 2017/6/6.
 */

angular.module('app').controller('highWayConnectCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.initializeData = function () {
        $scope.highWayConnect = objCtrl.data;
        if ($scope.highWayConnect.feedback.f_array && $scope.highWayConnect.feedback.f_array.length > 0) {
            for (var i = 0; i < $scope.highWayConnect.feedback.f_array.length; i++) {
                if ($scope.highWayConnect.feedback.f_array[i].type == 3) {
                    $scope.highWayConnect.content = $scope.highWayConnect.feedback.f_array[i].content;
                }
            }
        }
    };

    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);

