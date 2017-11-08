/**
 * Created by zhaohang on 2017/9/22.
 */
angular.module('app').controller('addGroupCtrl', ['$window', '$scope', '$timeout', 'NgTableParams', 'dsFcc', 'appPath',
    function ($window, $scope, $timeout, NgTableParams, dsFcc, appPath) {
        // 初始化表格;
        $scope.cityName = App.Temp.infoToGroupData.cityName;
        $scope.row = [
            {
                time: '',
                target: '',
                range: '',
                strategy: ''
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
                command: 'CREATE',
                type: 'SCPLATERESGROUP',
                data: {
                    infoIntelId: App.Temp.infoToGroupData.infoId,
                    adAdmin: App.Temp.infoToGroupData.cityId,
                    groupType: 1,
                    principle: principle,
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
