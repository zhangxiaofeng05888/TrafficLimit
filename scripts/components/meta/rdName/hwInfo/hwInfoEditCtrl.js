/**
 * Created by mali on 2017/3/30.
 * 高速道路名表编辑新增面板
 */
angular.module('app').controller('hwInfoEditCtl', ['$scope', '$ocLazyLoad', 'appPath', '$interval', 'dsMeta',
    function ($scope, $ocLazyLoad, appPath, $interval, dsMeta) {
        var objectCtrl = fastmap.uikit.ObjectEditController();
        $scope.memoOpt = [
            { id: '0', label: '通用' },
            { id: '1', label: '13CY' },
            { id: '2', label: 'NBT' }
        ];
        $scope.uRecordOpt = [
            { id: 0, label: '无' },
            { id: 1, label: '新增' },
            { id: 2, label: '删除' },
            { id: 3, label: '修改' }
        ];
        var initializeData = function () {
            // $scope.hwInfoData = fastmap.dataApi.scRoadNameHwInfo({});
            $scope.hwInfoData = objectCtrl.data;
            objectCtrl.setOriginalData(objectCtrl.data.getIntegrate());
        };

        // 新增重置
        $scope.reset = function () {
            $scope.hwInfoData = fastmap.dataApi.scRoadNameHwInfo({});
        };
        initializeData();
        /** *
         * 保存
         */
        $scope.doSave = function () {
            var changes = objectCtrl.data.getChanges();
            if (changes) {
                if (!$scope.hwInfoData.memo) {
                    swal('提示', '备用信息为必填字段，请检查！', 'info');
                    return;
                }
                $scope.$emit('freshload', { flag: true });
                var param = {
                    tableName: App.Temp.currentTableName,
                    data: $scope.hwInfoData.getIntegrate()
                };
                dsMeta.rdNameSave(param).then(function (data) {
                    if (data) {
                        $scope.closeModal();
                        swal({
                            title: '保存成功',
                            type: 'info',
                            showCancelButton: false,
                            closeOnConfirm: true,
                            confirmButtonText: '确定'
                        }, function (f) {
                            if (f) {
                                $scope.refreshData();
                                $scope.$emit('freshload', { flag: false });
                            }
                        });
                    }
                });
            } else {
                swal('属性值没有变化', '', 'info');
            }
        };

        var unbindHandler = $scope.$on('SubModalReload', initializeData);
        $scope.$on('$destroy', function () {
            unbindHandler = null;
        });
    }
]);
