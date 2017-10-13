/**
 * Created by chenxiao on 2016/7/26.
 */
angular.module('app').controller('AutofillJobPanelCtrl', ['$scope', '$interval', 'dsFcc', 'dsEdit', 'dsOutput',
    function ($scope, $interval, dsFcc, dsEdit, dsOutput) {
        $scope.jobStatus = 0;
        $scope.progress = '0%';

        var initData = function () {
            $scope.tipList = [];
            // 临时方案，勾选已实现的tip
            var supportTips = ['1201', '1101', '1514', '1109', '1203'];
            var tipsObj = FM.uikit.Config.getTipMapping();
            for (var item in tipsObj) {
                if (tipsObj.hasOwnProperty(item) &&
                    supportTips.indexOf(item) >= 0) { // add by chenx on 2017-3-9，临时方案，只显示已支持的类型
                    $scope.tipList.push({
                        id: item,
                        name: tipsObj[item],
                        checked: supportTips.indexOf(item) >= 0
                    });
                }
            }

            $scope.tipList.sort(function (a, b) {
                return a.name.length > b.name.length ? 1 : -1;
            });
        };

        var getJobDesc = function (rules) {
            let ruleNames = [];
            for (let i = 0; i < $scope.tipList.length; i++) {
                if (rules.indexOf($scope.tipList[i].id) >= 0) {
                    ruleNames.push($scope.tipList[i].name);
                }
            }

            return ruleNames.join('， ');
        };

        var doAutoFill = function (tips) {
            $scope.progress = '1%';
            $scope.jobStatus = 1;
            $scope.jobDesc = getJobDesc(tips);

            dsFcc.runAutomaticInput(tips).then(function (data) {
                var param = {
                    dbId: App.Temp.dbId,
                    gridIds: App.Temp.gridList
                };
                var timer = $interval(function () {
                    dsEdit.getJobById(data.data.jobId).then(function (d) {
                        if (d.status == 3 || d.status == 4) { // 1-创建，2-执行中 3-成功 4-失败
                            $interval.cancel(timer);
                            $scope.progress = '100%';
                            if (d.status == 3) {
                                $scope.jobStatus = 2;
                                dsOutput.push({
                                    op: '自动录入JOB执行成功',
                                    type: 'succ',
                                    pid: '0',
                                    childPid: ''
                                });
                                $scope.$emit('job-autofill', {
                                    status: 'succ'
                                });
                            } else {
                                $scope.jobStatus = 3;
                                dsOutput.push({
                                    op: '自动录入JOB执行失败',
                                    type: 'fail',
                                    pid: '0',
                                    childPid: ''
                                });
                                $scope.$emit('job-autofill', {
                                    status: 'fail'
                                });
                            }
                        } else {
                            $scope.progress = Math.floor(d.latestStepSeq / d.stepCount * 100) + '%';
                        }
                    });
                }, 2000);
            });

            $scope.$emit('job-autofill', {
                status: 'begin'
            });

            $scope.$emit('Dialog-ResetTitle', {
                type: 'autoJobPanel',
                title: '自动录入执行中...'
            });
        };

        $scope.doExecute = function () {
            var tips = [];
            for (var i = 0; i < $scope.tipList.length; i++) {
                if ($scope.tipList[i].checked) {
                    tips.push($scope.tipList[i].id);
                }
            }
            if (tips.length == 0) {
                swal('请选择要录入的Tips', null, 'info');
            } else {
                swal({
                    title: '确认执行选中Tips的自动录入操作？',
                    showCancelButton: true,
                    allowEscapeKey: false,
                    confirmButtonText: '是的，我要执行',
                    confirmButtonColor: '#ec6c62'
                }, function (f) {
                    if (f) {
                        doAutoFill(tips);
                    }
                });
            }
        };

        $scope.goback = function () {
            $scope.jobStatus = 0;
            $scope.$emit('Dialog-ResetTitle', {
                type: 'autoJobPanel',
                title: '自动录入'
            });
        };

        var initialize = function () {
            // todo: 页面加载时，是否需要加后台正在执行自动录入的判断
        };

        initData();

        $scope.$on('ReloadData-autoJobPanel', initialize);
    }
]);
