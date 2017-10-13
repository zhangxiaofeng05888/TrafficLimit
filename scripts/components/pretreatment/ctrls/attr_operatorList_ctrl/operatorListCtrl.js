/**
 * Created by zhongxiaoming on 2017/5/3.
 */
angular.module('app').controller('operatorListCtrl', ['$scope', function ($scope) {
    $scope.operateObj = 'fc';
    $scope.checkedId = 'TIPFC';
    $scope.operatorList = [
        {
            id: 'TIPFC',
            name: 'FC预处理'
        },
        {
            id: 'landuse',
            name: '土地利用机场功能面处理'
        }
    ];

    $scope.changeOperateType = function (value) {
        $scope.$emit('change_operater', value);
    };
    
    $scope.changeOperateType({
        id: 'TIPFC',
        name: 'FC预处理'
    });
}]);

