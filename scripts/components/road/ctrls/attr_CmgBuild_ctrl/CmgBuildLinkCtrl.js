/**
 * Created by liuzhe on 2016/7/22.
 */
angular.module('app').controller('CmgBuildLinkController', ['$scope', 'dsEdit', '$ocLazyLoad', function ($scope, dsEdit, $ocLazyLoad) {
    var objCtrl = fastmap.uikit.ObjectEditController();

    // 初始化
    $scope.initializeData = function () {
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());// 存储原始数据
        $scope.CmgBuildLinkData = objCtrl.data;
        $scope.isEdit = $scope.CmgBuildLinkData.editFlag ? '可编辑' : '不可编辑';

        $scope.kindOpt = [
            { id: 0, label: '假想线' },
            { id: 1, label: '建筑物边界线' }
        ];

        $scope.options = {
            length: $scope.CmgBuildLinkData.length.toFixed(2)
        };
    };

    $scope.$on('ReloadData', $scope.initializeData);
}]);
