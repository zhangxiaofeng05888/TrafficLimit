/**
 * Created by linglong on 2016/12/29.
 */
angular.module('app').controller('oridinaryFactoryCarController', ['$scope', function ($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    // rtic方向;
    $scope.rticDroption = [
        { id: 0, label: '无' },
        { id: 1, label: '顺方向' },
        { id: 2, label: '逆方向' }
    ];
    // rtic等级;
    $scope.rankoption = [
        { id: 0, label: '无' },
        { id: 1, label: '高速' },
        { id: 2, label: '城市高速' },
        { id: 3, label: '干线道路' },
        { id: 4, label: '其他道路' }
    ];

    // 切换等级的逻辑控制;
    $scope.changeRank = function (data) {
        if (data == 0) {
            swal('', 'RTIC等级不能为无，请选择RTIC等级', '');
            $scope.currentInternetData.rank = 0;
        }
        if (data == 1 && objCtrl.originalData.kind != 1) {
            swal('', 'RTIC等级为高速的link必须是高速种别', '');
            $scope.currentInternetData.rank = 0;
        }
        if (data == 2 && objCtrl.originalData.kind != 2) {
            swal('', 'RTIC等级为高速的link必须是城高种别', '');
            $scope.currentInternetData.rank = 0;
        }
    };
}]);
