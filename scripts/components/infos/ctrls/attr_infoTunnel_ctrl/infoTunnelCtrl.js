/**
 * Created by Chensonglin on 17.3.31.
 */
angular.module('app').controller('tunnelCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.initializeData = function () {
        $scope.tunnel = objCtrl.data;
        if ($scope.tunnel.feedback.f_array && $scope.tunnel.feedback.f_array.length > 0) {
            for (var i = 0; i < $scope.tunnel.feedback.f_array.length; i++) {
                if ($scope.tunnel.feedback.f_array[i].type == 3) {
                    $scope.tunnel.content = $scope.tunnel.feedback.f_array[i].content;
                }
            }
        }
    };
    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
