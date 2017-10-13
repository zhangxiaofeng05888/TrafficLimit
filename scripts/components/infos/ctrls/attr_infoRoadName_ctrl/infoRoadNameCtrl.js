/**
 * Created by Chensonglin on 17.3.31.
 */
angular.module('app').controller('roadNameCtrl', ['$scope', '$timeout', function ($scope, timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.initializeData = function () {
        $scope.roadName = objCtrl.data;
        if ($scope.roadName.feedback.f_array && $scope.roadName.feedback.f_array.length > 0) {
            for (var i = 0; i < $scope.roadName.feedback.f_array.length; i++) {
                if ($scope.roadName.feedback.f_array[i].type == 3) {
                    $scope.roadName.content = $scope.roadName.feedback.f_array[i].content;
                }
            }
        }
    };
    $scope.addName = function () {
        var length = $scope.roadName.deep.n_array.length;
        if (length > 0 && $scope.roadName.deep.n_array[length - 1] === '') {
            return;
        }
        $scope.roadName.deep.n_array.push('');
    };
    $scope.deleteName = function () {
        $scope.roadName.deep.n_array.splice($scope.roadName.deep.n_array.length - 1, 1);
    };
    $scope.changeName = function (item, index) {
        $scope.roadName.deep.n_array[index] = item;
    };
    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);

