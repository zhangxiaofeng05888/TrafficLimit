/**
 * Created by Chensonglin on 17.3.30.
 */

angular.module('app').controller('roadDirectionCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.rotate = 'rotateright.png';
    $scope.direction = [
        { id: 1, dr: '双方向' },
        { id: 2, dr: '单方向' }
    ];
    $scope.initializeData = function () {
        $scope.roadDirection = objCtrl.data;
        if ($scope.roadDirection.feedback.f_array && $scope.roadDirection.feedback.f_array.length > 0) {
            for (var i = 0; i < $scope.roadDirection.feedback.f_array.length; i++) {
                if ($scope.roadDirection.feedback.f_array[i].type == 3) {
                    $scope.roadDirection.content = $scope.roadDirection.feedback.f_array[i].content;
                }
            }
        }
    };
    $scope.changeRoadDirection = function () {
        $scope.roadDirection.deep.time = '';
    };
    $scope.changeRotate = function (rotate) {
        var agl = $scope.roadDirection.deep.agl + rotate;
        if (agl > 360) {
            agl -= 360;
        } else if (agl < 0) {
            agl += 360;
        }
        $scope.roadDirection.deep.agl = agl;
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
