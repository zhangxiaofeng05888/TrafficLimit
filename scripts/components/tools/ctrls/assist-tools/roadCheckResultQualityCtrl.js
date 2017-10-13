/**
 * Created by linglong on 2017/9/4.
 */
angular.module('app').controller('roadCheckResultQualityCtrl', ['$scope', 'dsFcc', 'dsEdit', '$timeout',
    function ($scope, dsFcc, dsEdit, $timeout) {
        // 弹框的类型，区分是新增还是查看; 等级; 错误原因
        $scope.boxType = 'add';
        $scope.errorLevels = ['S', 'A', 'B', 'C'];
        $scope.errorReasons = ['录入错误', '录入遗漏'];
        $scope.originErrorObj = null;

        /**
         * 控制器初始话;
         * @param data
         */
        var initPage = function (data) {
            $scope.openTime = new Date();
            // 数据模型;
            $scope.errorObj = {
                checkTaskId: App.Temp.subTaskId,
                quDesc: '',
                reason: '录入错误',
                erContent: '程序检查',
                quRank: 'C',
                isPrefer: 0,
                erType: 2,
                worker: App.Temp.User.userRealName + ' ' + App.Temp.User.userId
            };

            $scope.boxType = data.flag;
            $scope.logStatus = data.status;
            $scope.logEntity = data.data;
            $scope.param = data.param;
            $timeout(function () {
                if (data.flag === 'show') {
                    dsFcc.getRoadCheckQuality($scope.logEntity.pid)
                        .then(function (res) {
                            if (res != -1) {
                                $scope.errorObj = FM.Util.clone(res.data);
                                $scope.originErrorObj = FM.Util.clone(res.data);
                                $scope.showRoadCheckQuality = true;
                            }
                        }, function () {
                            $scope.showRoadCheckQuality = false;
                            $scope.$emit('closeRoadCheckBox');
                        });
                } else {
                    $scope.showRoadCheckQuality = true;
                    $scope.errorObj.objectType = $scope.logEntity.targets[0].featType;
                    $scope.errorObj.objectId = $scope.logEntity.targets[0].pid;
                    $scope.errorObj.logId = $scope.logEntity.targets[0].id;
                    if ($scope.logEntity.worker) {
                        $scope.errorObj.worker = $scope.logEntity.worker;
                        $scope.errorObj.workTime = $scope.logEntity.updateDate;
                    }
                }
            });
        };

        /**
         * 保存质检信息;
         */
        $scope.doSaveQua = function () {
            // 问题描述必须输入
            if (!$scope.errorObj.quDesc) {
                swal('提示', '请输入问题说明！', 'warning');
                return;
            }
            dsEdit.qaUpdateSaveProblem($scope.logEntity, $scope.logStatus, $scope.errorObj).then(function (data) {
                $scope.$emit('onSaveRoadCheckQuality', {
                    data: $scope.param,
                    status: $scope.logStatus,
                    res: data
                });
                $scope.closeDialog();
            });
        };

        /**
         * 更新质检信息;
         */
        $scope.upDateSaveQua = function () {
            // 问题描述必须输入
            if (!$scope.errorObj.quDesc) {
                swal('提示', '请输入问题说明！', 'warning');
                return;
            }
            var param = {};
            for (var key in $scope.originErrorObj) {
                if ($scope.originErrorObj[key] != $scope.errorObj[key]) {
                    param[key] = $scope.errorObj[key];
                }
            }
            if (Utils.isEmptyObject(param)) {
                swal('提示', '未做任何修改', 'info');
                return;
            }
            dsFcc.updateWrong(param, $scope.errorObj.logId).then(function (data) {
                $scope.$emit('onSaveRoadCheckQuality', {
                    data: $scope.param,
                    status: $scope.logStatus,
                    res: data
                });
                $scope.closeDialog();
            });
        };

        /**
         * 关闭弹框;
         */
        $scope.closeDialog = function () {
            $scope.showRoadCheckQuality = false;
            $scope.$emit('closeRoadCheckBox');
        };

        /**
         * 转化时间格式;
         * @returns {*}
         */
        $scope.formatDateFunc = function () {
            return Utils.newDateFormat($scope.openTime, 'yyyy-MM-dd hh:mm:ss');
        };

        /**
         * 接收父级的事件;
         */
        $scope.$on('refreshRoadCheckBox', function (event, data) {
            initPage(data);
        });
    }
]);
