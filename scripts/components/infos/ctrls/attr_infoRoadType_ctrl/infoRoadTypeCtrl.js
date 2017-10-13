/**
 * Created by Chensonglin on 17.3.30.
 */
angular.module('app').controller('roadTypeCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.roadKind = [
        { id: 0, label: '作业中' },
        { id: 1, label: '高速道路' },
        { id: 2, label: '城市道路' },
        { id: 3, label: '国道' },
        { id: 4, label: '省道' },
        { id: 5, label: '预留' },
        { id: 6, label: '县道' },
        { id: 7, label: '乡镇村道路' },
        { id: 8, label: '其他道路' },
        { id: 9, label: '非引导道路' },
        { id: 10, label: '步行道路' },
        { id: 11, label: '人渡' },
        { id: 13, label: '轮渡' },
        { id: 15, label: '10级路（障碍物）' }
    ];
    $scope.initializeData = function () {
        $scope.roadType = objCtrl.data;
        if ($scope.roadType.feedback.f_array && $scope.roadType.feedback.f_array.length > 0) {
            for (var i = 0; i < $scope.roadType.feedback.f_array.length; i++) {
                if ($scope.roadType.feedback.f_array[i].type == 3) {
                    $scope.roadType.content = $scope.roadType.feedback.f_array[i].content;
                }
            }
        }
    };
    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);

