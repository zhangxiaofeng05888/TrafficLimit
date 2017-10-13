/**
 * Created by mali on 2017/3/30.
 * 道路名拆分界面
 */
angular.module('app').controller('RdNameSplitCtrl', ['$scope', '$ocLazyLoad', 'appPath', '$interval', 'dsMeta',
    function ($scope, $ocLazyLoad, appPath, $interval, dsMeta) {
        $scope.dataFlag = '2';
        // 拆分
        $scope.doSplit = function () {
            var param = {};
            if ($scope.dataFlag == 1) { // 拆分选中的数据
                if ($scope.getSelectedData().length == 0) {
                    swal({
                        title: '请先选择要拆分的数据',
                        type: 'info',
                        showCancelButton: false,
                        closeOnConfirm: true,
                        confirmButtonText: '确定'
                    }, function (f) {
                        if (f) {
                            $scope.closeSubModal();
                            $scope.$apply();
                        }
                    });
                    return;
                }
                param = {
                    flag: 1,
                    data: $scope.getSelectedData()
                };
            } else if ($scope.dataFlag == 2) { // 拆分检查结果数据
                for (var p in $scope.roadTypeVal) {
                    if ($scope.roadTypeVal[p]) {
                        $scope.filter.roadTypes.push(parseInt(p, 10));
                    }
                }
                param = {
                    flag: -1,
                    params: { name: $scope.filterName, nameGroupid: $scope.filterNameGroupid, adminId: $scope.filterAdminId, roadTypes: $scope.filter.roadTypes }
                };
                if ($scope.filterName == '' && $scope.filterNameGroupid == '' && $scope.filterAdminId == '' && $scope.filter.roadTypes.length == 0) {
                    swal('提示', '请先选择查询条件，不支持整张表拆分', 'error');
                    $scope.closeSubModal();
                    return;
                }
            }
            $scope.$emit('freshload', { flag: true });
            dsMeta.rdnameSplit(param).then(function (data) {
                if (data) {
                    swal({
                        title: '拆分成功',
                        type: 'info',
                        showCancelButton: false,
                        closeOnConfirm: true,
                        confirmButtonText: '确定'
                    }, function (f) {
                        if (f) {
                            $scope.$emit('REFRESHROADNAMELIST');
                            $scope.closeSubModal();
                            $scope.$emit('freshload', { flag: false });
                        }
                    });
                }
            });
        };

        $scope.cancel = function () {
            $scope.closeSubModal();
        };

        // 初始化
        var initialize = function () {
            // 获取当前选中的数据
            var selectedRoadNameList = $scope.getSelectedData();
            $scope.selectedDataCount = selectedRoadNameList.length;
        };

        var unbindHandler = $scope.$on('SubModalReload', initialize);
        $scope.$on('$destroy', function () {
            unbindHandler = null;
        });
    }
]);
