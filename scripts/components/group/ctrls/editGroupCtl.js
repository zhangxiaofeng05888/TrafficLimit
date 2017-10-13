/**
 * Created by zhaohang on 2017/9/27.
 */
angular.module('app').controller('editGroupCtrl', ['$window', '$scope', '$timeout', 'NgTableParams', 'dsFcc', 'appPath',
    function ($window, $scope, $timeout, NgTableParams, dsFcc, appPath) {
        // 初始化表格;
        $scope.groupType = [
            {
                value: 1,
                name: '新增'
            },
            {
                value: 2,
                name: '删除'
            },
            {
                value: 3,
                name: '修改'
            },
            {
                value: 4,
                name: '已制作'
            }
        ];
        $scope.saveGroup = function () {
            if (!$scope.groupData.principle) {
                swal('提示', '请输入限制信息', 'warning');
                return;
            }
            var params = {
                command: 'UPDATE',
                type: 'SCPLATERESGROUP',
                objId: $scope.groupData.groupId,
                data: {
                    groupType: $scope.groupData.groupType,
                    principle: $scope.groupData.principle,
                    objStatus: 'UPDATE'
                }
            };
            dsFcc.addGroup(params).then(function (data) {
                $scope.$emit('closeGroupDialog', 'editGroup');
                swal('提示', '修改成功', 'success');
            });
        };
        var initialize = function (event, data) {
            $scope.groupData = Object.assign({}, data.data);
        };

        var unbindHandler = $scope.$on('ReloadData-editGroup', initialize);
        $scope.$on('$destroy', function (event, data) {

        });
    }
]);
