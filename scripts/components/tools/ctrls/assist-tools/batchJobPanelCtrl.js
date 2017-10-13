/**
 * Created by chenxiao on 2016/7/26.
 */
angular.module('app').controller('BatchJobPanelCtrl', ['$scope', '$interval', 'dsEdit', 'dsOutput',
    function ($scope, $interval, dsEdit, dsOutput) {
        var logMsgCtrl = fastmap.uikit.LogMsgController($scope);
        $scope.batchPacks = [{
            bacthId: 'speed_limit',
            batchType: 2,
            bacthName: '批处理赋速度限制',
            rules: [{
                ruleName: '速度限制值批处理',
                check: true,
                ruleCode: 'BATCH_SLE'
            }, {
                ruleName: 'BUA限速跳跃',
                check: true,
                ruleCode: 'BUA_SPEEDLIMIT_BATCH'
            }, {
                ruleName: '速度限制等级批处理',
                check: true,
                ruleCode: 'BATCH_SPEED_CLASS',
                param: {
                    P_ASSIGN_WAY: {
                        options: [{
                            value: 1,
                            text: '速度限制来源赋值'
                        }, {
                            value: 2,
                            text: '速度限制等级值标识'
                        }, {
                            value: 3,
                            text: '制作所有的等级值'
                        }],
                        selected: 1
                    }
                }
            }]
        }, {
            bacthId: 'poi_batch',
            batchType: 0,
            bacthName: '批处理POI建关联',
            rules: [{
                ruleName: '批处理POI建关联',
                check: true,
                ruleCode: 'BATCH_POI_GUIDELINK'
            }]
        }];

        $scope.jobStatus = 0;

        $scope.selectPack = function (item) {
            for (var i = $scope.batchPacks.length - 1; i >= 0; i--) {
                $scope.batchPacks[i].check = false;
            }
            item.check = true;
            $scope.selectedBatch = item;
        };
        $scope.selectPack($scope.batchPacks[0]);

        var getSelectedRules = function () {
            var batches = [];
            var ruleId,
                params;
            for (var i = 0; i < $scope.selectedBatch.rules.length; i++) {
                if ($scope.selectedBatch.rules[i].check) {
                    ruleId = $scope.selectedBatch.rules[i].ruleCode;
                    if ($scope.selectedBatch.rules[i].param) {
                        params = [];
                        for (var key in $scope.selectedBatch.rules[i].param) {
                            if ($scope.selectedBatch.rules[i].param.hasOwnProperty(key)) {
                                params.push(key + '=>' + $scope.selectedBatch.rules[i].param[key].selected);
                            }
                        }
                        batches.push(ruleId + ':' + params.join(','));
                    } else {
                        batches.push(ruleId);
                    }
                }
            }
            return batches;
        };

        var getRuleDesc = function (rules) {
            var packName;
            var ruleNames = [];
            var i,
                j;
            var temp = rules.map(function (item) {
                return item.split(':')[0];
            });

            var f = false;
            for (i = 0; i < $scope.batchPacks.length; i++) {
                f = false;
                for (j = 0; j < $scope.batchPacks[i].rules.length; j++) {
                    if (temp.indexOf($scope.batchPacks[i].rules[j].ruleCode) >= 0) {
                        ruleNames.push($scope.batchPacks[i].rules[j].ruleName);
                        f = true;
                    }
                }

                if (f) {
                    packName = $scope.batchPacks[i].bacthName;
                    break;
                }
            }

            return packName + '：' + ruleNames.join('， ');
        };

        var waitingJob = function (jobId) {
            var timer = $interval(function () {
                dsEdit.getJobById(jobId).then(function (data) {
                    if (data.status == 3 || data.status == 4) { // 1-创建，2-执行中 3-成功 4-失败
                        $interval.cancel(timer);
                        $scope.progress = '100%';
                        if (data.status == 3) {
                            $scope.jobStatus = 2;
                            dsOutput.push({
                                op: '执行批处理执行成功',
                                type: 'succ',
                                pid: jobId,
                                childPid: ''
                            });
                            $scope.$emit('job-batch', {
                                status: 'succ'
                            });
                        } else {
                            $scope.jobStatus = 3;
                            dsOutput.push({
                                op: '执行批处理执行失败',
                                type: 'fail',
                                pid: jobId,
                                childPid: ''
                            });
                            $scope.$emit('job-batch', {
                                status: 'fail'
                            });
                        }
                    } else {
                        $scope.progress = Math.floor(data.latestStepSeq / data.stepCount * 100) + '%';
                    }
                });
            }, 5000);
        };

        $scope.doExecute = function () {
            var rules = getSelectedRules();

            if (rules.length == 0) {
                swal('请选择要执行的批处理', '', 'info');
            } else {
                var param = {
                    taskId: App.Temp.subTaskId,
                    ruleCode: rules.join(';'),
                    type: $scope.selectedBatch.batchType
                };
                dsEdit.exeOnlineBatch(param).then(function (data) {
                    if (data) {
                        waitingJob(data);
                    }
                });
                $scope.jobDesc = getRuleDesc(rules);
                $scope.progress = '1%';
                $scope.jobStatus = 1;
                $scope.$emit('job-batch', {
                    status: 'begin'
                });

                $scope.$emit('Dialog-ResetTitle', {
                    type: 'batchJobPanel',
                    title: '批处理执行中...'
                });
            }
        };

        $scope.goback = function () {
            $scope.jobStatus = 0;
            $scope.$emit('Dialog-ResetTitle', {
                type: 'batchJobPanel',
                title: '批处理'
            });
        };

        var initialize = function () {
            dsEdit.getRunningJobByTask('gdbBatch').then(function (data) {
                if (data && data.jobId) {
                    $scope.jobStatus = 1;
                    var rules = JSON.parse(data.jobRequest).rules;
                    $scope.jobDesc = getRuleDesc(rules);
                    $scope.progress = Math.floor(data.stepSeq / data.stepCount * 100) + '%';

                    waitingJob(data.jobId);
                } else {
                    $scope.jobStatus = 0;
                }
            });
        };

        $scope.$on('ReloadData-batchJobPanel', initialize);
    }
]);
