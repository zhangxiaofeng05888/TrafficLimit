/**
 * Created by liuzhe on 2016/7/22.
 */
angular.module('app').controller('CmgBuildNodeController', ['$scope', function ($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();

    // 形态
    $scope.form = [
        { id: 0, label: '无' },
        { id: 1, label: '图廓点' },
        { id: 7, label: '角点' }
    ];

    // 初始化
    $scope.initializeData = function () {
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        $scope.CmgBuildNodeData = objCtrl.data;
    };

    $scope.$on('ReloadData', $scope.initializeData);
}]);
