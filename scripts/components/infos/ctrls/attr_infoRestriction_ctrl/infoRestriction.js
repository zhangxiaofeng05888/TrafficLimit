/**
 * Created by Chensonglin on 17.3.30.
 */

angular.module('app').controller('restrictionCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.rotate = 'rotateright.png';
    $scope.initializeData = function () {
        $scope.speedLimit = objCtrl.data;
        if ($scope.speedLimit.feedback.f_array && $scope.speedLimit.feedback.f_array.length > 0) {
            for (var i = 0; i < $scope.speedLimit.feedback.f_array.length; i++) {
                if ($scope.speedLimit.feedback.f_array[i].type == 3) {
                    $scope.speedLimit.content = $scope.speedLimit.feedback.f_array[i].content;
                }
            }
        }
    };
    $scope.changeRotate = function (rotate) {
        var agl = $scope.speedLimit.deep.agl + rotate;
        if (agl > 360) {
            agl -= 360;
        } else if (agl < 0) {
            agl += 360;
        }
        $scope.speedLimit.deep.agl = agl;
        if ($scope.rotate == 'rotateright.png') {
            $scope.rotate = 'rotateleft.png';
        } else {
            $scope.rotate = 'rotateright.png';
        }
    };
    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
