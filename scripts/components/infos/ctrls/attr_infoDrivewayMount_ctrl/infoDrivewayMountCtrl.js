/**
 * Created by Chensonglin on 17.3.30.
 */

angular.module('app').controller('drivewayMountCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.roadNumber = [
        { id: 1, label: '1' },
        { id: 2, label: '2' },
        { id: 3, label: '3' },
        { id: 4, label: '4' },
        { id: 5, label: '5' },
        { id: 6, label: '6' },
        { id: 7, label: '7' },
        { id: 8, label: '8' },
        { id: 9, label: '9' },
        { id: 10, label: '10' },
        { id: 11, label: '11' },
        { id: 12, label: '12' }
    ];

    $scope.initializeData = function () {
        $scope.quantity = objCtrl.data;
        if ($scope.quantity.feedback.f_array && $scope.quantity.feedback.f_array.length > 0) {
            for (var i = 0; i < $scope.quantity.feedback.f_array.length; i++) {
                if ($scope.quantity.feedback.f_array[i].type == 3) {
                    $scope.quantity.content = $scope.quantity.feedback.f_array[i].content;
                }
            }
        }
    };
    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
