/**
 * Created by zhaohang on 2017/9/22.
 */
angular.module('app').controller('addGroupCtrl', ['$window', '$scope', '$timeout', 'NgTableParams', 'dsFcc', 'appPath',
    function ($window, $scope, $timeout, NgTableParams, dsFcc, appPath) {
        // 初始化表格;
        $scope.cityName = App.Temp.infoToGroupData.cityName;
        $scope.saveGroup = function () {
            if (!$scope.principle) {
                swal('提示', '请输入限制信息', 'warning');
                return;
            }
            var params = {
                command: 'CREATE',
                type: 'SCPLATERESGROUP',
                data: {
                    infoIntelId: App.Temp.infoToGroupData.infoId,
                    adAdmin: App.Temp.infoToGroupData.cityId,
                    groupType: 1,
                    principle: $scope.principle,
                    condition: App.Temp.infoToGroupData.condition
                }
            };
            dsFcc.addGroup(params).then(function (data) {
                $scope.$emit('closeGroupDialog', 'addGroup');
                swal('提示', '保存成功', 'success');
            });
        };
        var initialize = function () {
            $scope.principle = '';
        };

        var unbindHandler = $scope.$on('ReloadData-addGroup', initialize);
        $scope.$on('$destroy', function (event, data) {

        });
    }
]);
