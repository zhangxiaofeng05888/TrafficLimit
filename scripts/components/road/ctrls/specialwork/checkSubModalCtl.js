/**
 * Created by mali on 2016-11-22
 */
angular.module('app').controller('CheckSubModalCtrl', ['$scope', '$interval', 'dsEdit', 'dsOutput',
    function ($scope, $interval, dsEdit, dsOutput) {
        $scope.pageSize = 10;
        $scope.page = 1;
        $scope.dataLoading = true;
        var checkedRulesArr = []; // 选中的规则号
        /**
         * 关闭当前窗口;
         */
        $scope.closeEditPanel = function () {
            $scope.$emit('CLOSECURRENTPANEL');
        };

        // 获取所有的suit包
        $scope.loadingSuites = false;
        function getAllSuits(checkType, flag) {
            $scope.loadingSuites = true;
            $scope.loadingRules = true;
            dsEdit.getCheckRuleSuites(checkType, flag).then(function (data) {
                $scope.suites = data;
                for (var i = 0; i < $scope.suites.length; i++) {
                    $scope.suites[i].checked = false;
                }
                // 默认查询第一个suit下的检查规则
                $scope.getRulesBySuitId($scope.suites[0].suiteId, $scope.ruleCode);
                $scope.currentSuite = $scope.suites[0].suiteId;
                $scope.suites[0].selected = true;
                $scope.loadingSuites = false;
                $scope.loadingRules = false;
            });
        }
        getAllSuits(5, 0);

        // 根据suitsId 查询检查规则
        $scope.loadingRules = false;
        $scope.getRulesBySuitId = function (suiteId, ruleCode) {
            $scope.loadingRules = true;
            dsEdit.getCheckRulesBySuiteId(suiteId, ruleCode).then(function (data) {
                if (checkedRulesArr.length > 0) {
                    for (var j = 0; j < data.length; j++) {
                        for (var q = 0; q < checkedRulesArr.length; q++) {
                            if (data[j].ruleCode == checkedRulesArr[q]) {
                                data[j].checked = true;
                            }
                        }
                    }
                    $scope.checkRulesList = data;
                } else {
                    $scope.checkRulesList = data;
                }
                $scope.loadingRules = false;
                for (var i = 0; i < $scope.checkRulesList.length; i++) {
                    $scope.checkRulesList[i].selected = false;
                }
            });
        };

        // 点击行事件
        $scope.refreshRulesBySuitId = function (item) {
            $scope.currentSuite = item.suiteId;
            for (var i = 0; i < $scope.suites.length; i++) {
                if ($scope.suites[i].suiteId == item.suiteId) {
                    $scope.suites[i].selected = true;
                } else {
                    $scope.suites[i].selected = false;
                }
            }
            $scope.getRulesBySuitId(item.suiteId, $scope.ruleCode);
        };

        // 删除数组中的指定元素
        var removeArrVal = function (arr, val) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == val) {
                    arr.splice(i, 1);
                    break;
                }
            }
        };

        // 全选
        $scope.selectSuite = function (item) {
            if (item.suiteId == $scope.currentSuite) {
                if (item.checked) {
                    for (var i = 0; i < $scope.checkRulesList.length; i++) {
                        $scope.checkRulesList[i].checked = true;
                        if (checkedRulesArr.indexOf($scope.checkRulesList[i].ruleCode == -1)) {
                            checkedRulesArr.push($scope.checkRulesList[i].ruleCode);
                        }
                    }
                } else {
                    for (var j = 0; j < $scope.checkRulesList.length; j++) {
                        $scope.checkRulesList[j].checked = false;
                        removeArrVal(checkedRulesArr, $scope.checkRulesList[j].ruleCode);
                    }
                }
            } else {
                if (item.checked) {
                    dsEdit.getCheckRulesBySuiteId(item.suiteId).then(function (data) {
                        for (var r = 0; r < data.length; r++) {
                            checkedRulesArr.push(data[r].ruleCode);
                        }
                    });
                } else {
                    dsEdit.getCheckRulesBySuiteId(item.suiteId).then(function (data) {
                        for (var q = 0; q < data.length; q++) {
                            removeArrVal(checkedRulesArr, data[q].ruleCode);
                        }
                    });
                }
            }
        };


        // 需要判断当前suit包下的规则号是否还有勾选项，如果没有，则取消suit包的勾选
        var refreshSuitCheck = function () {
            var flag = false;
            for (var i = 0; i < checkedRulesArr.length; i++) {
                for (var j = 0; j < $scope.checkRulesList.length; j++) {
                    if ($scope.checkRulesList[j].ruleCode == checkedRulesArr[i]) {
                        flag = true;
                    }
                }
            }
            if (flag) {
                for (var p = 0; p < $scope.suites.length; p++) {
                    if ($scope.suites[p].suiteId == $scope.currentSuite) {
                        $scope.suites[p].checked = true;
                    }
                }
            } else {
                for (var z = 0; z < $scope.suites.length; z++) {
                    if ($scope.suites[z].suiteId == $scope.currentSuite) {
                        $scope.suites[z].checked = false;
                    }
                }
            }
        };

        // 选择检查规则
        $scope.selectRule = function (item) {
            if (item.checked) {
                var flag = false;
                for (var i = 0; i < checkedRulesArr.length; i++) {
                    if (checkedRulesArr[i] == item.ruleCode) {
                        flag = true;
                    }
                }
                if (!flag) {
                    checkedRulesArr.push(item.ruleCode);
                }
                for (var j = 0; j < $scope.suites.length; j++) {
                    if ($scope.suites[j].suiteId == $scope.currentSuite) {
                        $scope.suites[j].checked = true;
                    }
                }
            } else {
                removeArrVal(checkedRulesArr, item.ruleCode);
                refreshSuitCheck();
            }
        };

        $scope.doExecute = function () {
            if (checkedRulesArr.length == 0) {
                swal('请选择要执行的检查项', '', 'info');
            } else {
                $scope.closeDialog('roadnameCheck');
                $scope.$emit('check-running', {
                    checkRunning: true
                });
                dsEdit.exeOnlineCheck(5, checkedRulesArr).then(function (data) {
                    if (data) {
                        var timer = $interval(function () {
                            dsEdit.getJobById(data).then(function (d) {
                                if (d.status == 3 || d.status == 4) { // 1-创建，2-执行中 3-成功 4-失败
                                    // dialog 关闭后，发事件，父界面接收不到
                                    // $scope.$emit('check-running', {
                                    //     checkRunning: false
                                    // });
                                    $scope.closeCheckRunning();
                                    if (d.status == 3) {
                                        swal('提示', '检查执行成功！', 'info');
                                    } else {
                                        swal('提示', '检查执行失败！', 'info');
                                    }
                                    $interval.cancel(timer);
                                }
                            });
                        }, 5000);
                    }
                });
            }
        };
        $scope.filterRuleCode = function () {
            $scope.getRulesBySuitId($scope.currentSuite, $scope.ruleCode);
        };

        // 初始化
        var initialize = function () {
            // 获取当前选中的数据
            getAllSuits(5, 0);
            checkedRulesArr = []; // 选中的规则号
        };
        $scope.$on('ReloadData-roadnameCheck', initialize);
    }
]);
