/**
 * Created by Chensonglin on 17.4.10.
 */
angular.module('app', []).controller('infoDetailCtrl', function ($scope) {
    $scope.infoModel = null;
    $scope.turnToInfoList = function () {
        $scope.$emit('ToList');
    };

    $scope.isAdopted = [
        { id: 0, name: '未处理' },
        { id: 1, name: '未采纳' },
        { id: 2, name: '采纳' },
        { id: 3, name: '部分采纳' }
    ];
    $scope.reason = [
        { id: 0, name: '影像不清晰' },
        { id: 1, name: '库中已有' },
        { id: 2, name: '未找到' },
        { id: 3, name: '未开通' },
        { id: 4, name: '不符合采集标准' },
        { id: 5, name: '无法达到' },
        { id: 6, name: '现场未发生变化' },
        { id: 7, name: '删除复制新增' },
        { id: 8, name: '无图片（DB改善用）' },
        { id: 9, name: '一级情报（UGC轨迹和影像用）' },
        { id: 10, name: '无效轨迹' },
        { id: 11, name: '不需要处理' }
    ];
    $scope.$on('ReloadData', function (event, data) {
        if (data.data.features) {
            $scope.infoModel = data.data.features;
        } else {
            $scope.infoModel = data.data;
        }
        $scope.infoModel.i_proposal = 3;
        for (var key in $scope.infoModel) {
            if (key == 'i_proposal') {
                switch ($scope.infoModel[key]) {
                    case 1:
                        $scope.infoModel[key] = '删除';
                        break;
                    case 2:
                        $scope.infoModel[key] = '更新';
                        break;
                    case 3:
                        $scope.infoModel[key] = '新增';
                        break;
                    default:
                }
            }
        }


        $scope.$apply();
    });

    $scope.save = function () {
        $scope.$emit('UpdateInfo', {
            globalId: $scope.infoModel.globalId,
            isAdopted: $scope.infoModel.c_isAdopted,
            denyReason: $scope.infoModel.c_denyReason,
            denyRemark: $scope.infoModel.c_denyRemark
        });
    };

    $scope.reset = function () {
        $scope.infoModel.c_isAdopted = null;
        $scope.infoModel.c_denyReason = null;
        $scope.infoModel.c_denyRemark = null;
    };
});
