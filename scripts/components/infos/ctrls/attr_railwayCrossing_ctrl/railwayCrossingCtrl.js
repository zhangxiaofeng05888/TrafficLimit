angular.module('app').controller('railwayCrossingCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = fastmap.uikit.SelectController();
    // 初始化函数;
    $scope.initializeData = function () {
        $scope.railwayData = objCtrl.data;
        if ($scope.railwayData.feedback.f_array && $scope.railwayData.feedback.f_array.length > 0) {
            for (var i = 0; i < $scope.railwayData.feedback.f_array.length; i++) {
                if ($scope.railwayData.feedback.f_array[i].type == 3) {
                    $scope.railwayData.content = $scope.railwayData.feedback.f_array[i].content;
                }
            }
        }
    };
    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);

