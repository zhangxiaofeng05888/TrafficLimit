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
        $scope.addItem = function () {
            $scope.row.push({
                time: '',
                target: '',
                range: '',
                strategy: ''
            });
        };
        $scope.deleteItem = function (index) {
            if ($scope.row.length === 1) {
                return;
            }
            $scope.row.splice(index, 1);
        };
        $scope.limit = function (event, index, name) {
            if (event.keyCode === 220) {
                swal('提示', '不能输入"|"', 'warning');
                $scope.row[index][name] = $scope.row[index][name].substring(0, $scope.row[index][name].length - 1);
            }
        };
        $scope.saveGroup = function () {
            var principle = '';
            for (var i = 0; i < $scope.row.length; i++) {
                if (!$scope.row[i].time) {
                    swal('提示', '请输入限制时间', 'warning');
                    return;
                }
                if (!$scope.row[i].target) {
                    swal('提示', '请输入限行对象', 'warning');
                    return;
                }
                if (!$scope.row[i].range) {
                    swal('提示', '请输入限行范围', 'warning');
                    return;
                }
                if (!$scope.row[i].strategy) {
                    swal('提示', '请输入限行策略', 'warning');
                    return;
                }
                var str = '限行时间:' + $scope.row[i].time + '|限行对象:' + $scope.row[i].target + '|限行范围:' + $scope.row[i].range + '|限行策略:' + $scope.row[i].strategy;
                if (i + 1 === $scope.row.length) {
                    principle += str;
                } else {
                    principle = principle + str + '||';
                }
                if (principle.length >= 600) {
                    swal('提示', '超出最大字段长度', 'warning');
                    return;
                }
            }
            var params = {
                command: 'UPDATE',
                type: 'SCPLATERESGROUP',
                objId: $scope.groupData.groupId,
                data: {
                    groupType: $scope.groupData.groupType,
                    principle: principle,
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
            $scope.row = [];
            var doubleRow = $scope.groupData.principle.split('||');
            for (var i = 0; i < doubleRow.length; i++) {
                var arr = doubleRow[i].split('|');
                $scope.row.push({
                    time: arr[0].substring(5),
                    target: arr[1].substring(5),
                    range: arr[2].substring(5),
                    strategy: arr[3].substring(5)
                });
            }
        };

        var unbindHandler = $scope.$on('ReloadData-editGroup', initialize);
        $scope.$on('$destroy', function (event, data) {

        });
    }
]);
