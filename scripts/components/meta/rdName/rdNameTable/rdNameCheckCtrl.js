/**
 * Created by mali on 2017/3/31.
 * 道路名检查界面
 */
angular.module('app').controller('RdNameCheckCtrl', ['$scope', '$interval', 'dsMeta', 'dsOutput', '$timeout',
    function ($scope, $interval, dsMeta, dsOutput, $timeout) {
        $scope.pageSize = 10;
        $scope.page = 1;
        $scope.checkRange = 0;
        $scope.checkMsg = '';
        var checkedRulesArr = []; // 选中的规则号
        $scope.adminOpt = [
            { id: 0, label: '请选择' },
            { id: 214, label: '全国' },
            { id: 110000, label: '北京' },
            { id: 120000, label: '天津' },
            { id: 130000, label: '河北' },
            { id: 140000, label: '山西' },
            { id: 150000, label: '内蒙古' },
            { id: 210000, label: '辽宁' },
            { id: 220000, label: '吉林' },
            { id: 230000, label: '黑龙江' },
            { id: 310000, label: '上海' },
            { id: 320000, label: '江苏' },
            { id: 330000, label: '浙江' },
            { id: 340000, label: '安徽' },
            { id: 350000, label: '福建' },
            { id: 360000, label: '江西' },
            { id: 370000, label: '山东' },
            { id: 410000, label: '河南' },
            { id: 420000, label: '湖北' },
            { id: 430000, label: '湖南' },
            { id: 440000, label: '广东' },
            { id: 450000, label: '广西' },
            { id: 460000, label: '海南' },
            { id: 500000, label: '重庆' },
            { id: 510000, label: '四川' },
            { id: 520000, label: '贵州' },
            { id: 530000, label: '云南' },
            { id: 540000, label: '西藏' },
            { id: 610000, label: '陕西' },
            { id: 620000, label: '甘肃' },
            { id: 630000, label: '青海' },
            { id: 640000, label: '宁夏' },
            { id: 650000, label: '新疆' },
            { id: 810000, label: '香港' },
            { id: 820000, label: '澳门' }
        ];
        // 行政区划下拉列表禁用标识
        $scope.adminDisable = true;

        // 获取所有的suit包
        function getAllSuits(checkType, flag) {
            dsMeta.getCheckRuleSuites(checkType, flag).then(function (data) {
                $scope.suites = data;
                for (var i = 0; i < $scope.suites.length; i++) {
                    $scope.suites[i].checked = false;
                }
                // 默认查询第一个suit下的检查规则
                $scope.getRulesBySuitId($scope.suites[0].suiteId, $scope.ruleCode);
                $scope.currentSuite = $scope.suites[0].suiteId;
                $scope.suites[0].selected = true;
            });
        }

        // 根据suitsId 查询检查规则
        $scope.loaddingSuites = false;
        $scope.getRulesBySuitId = function (suiteId, ruleCode) {
            $scope.loaddingSuites = true;
            dsMeta.getCheckRulesBySuiteId(suiteId, ruleCode).then(function (data) {
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
                $scope.loaddingSuites = false;
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
                    dsMeta.getCheckRulesBySuiteId(item.suiteId).then(function (data) {
                        for (var r = 0; r < data.length; r++) {
                            checkedRulesArr.push(data[r].ruleCode);
                        }
                    });
                } else {
                    dsMeta.getCheckRulesBySuiteId(item.suiteId).then(function (data) {
                        for (var q = 0; q < data.length; q++) {
                            removeArrVal(checkedRulesArr, data[q].ruleCode);
                        }
                    });
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
            } else {
                removeArrVal(checkedRulesArr, item.ruleCode);
            }
        };

        function getCheckParam() {
            var param = {
                checkType: 5,
                jobName: $scope.checkMsg,
                ckRules: checkedRulesArr.join(','),
                params: {
                    name: '',
                    nameGroupid: '',
                    adminId: '',
                    roadTypes: []
                },
                nameIds: []
            };
            if ($scope.checkRange == 0) { // 检查选中数据
                var selectedData = $scope.getSelectedData();
                var selectedNameIds = [];
                for (var i = 0; i < selectedData.length; i++) {
                    selectedNameIds.push(selectedData[i].nameId);
                }
                param.nameIds = selectedNameIds;
            } else if ($scope.checkRange == 1) { // 检查本次检查结果数据
                if (!$scope.filterAdminId) {
                    $scope.filterAdminId = '';
                }
                param.params.name = $scope.filterName;
                param.params.nameGroupid = $scope.filterNameGroupid;
                param.params.adminId = $scope.filterAdminId;
                param.params.roadTypes = $scope.filter.roadTypes;
            } else { // 检查全部数据
                if (!$scope.checkAdminId) {
                    $scope.checkAdminId = '';
                }
                param.params.adminId = $scope.checkAdminId;
            }
            return param;
        }

        $scope.running = false;
        $scope.progress = 0;
        $scope.doExecute = function () {
            if (!$scope.checkMsg) {
                swal('提示', '检查描述不能为空', 'error');
                return;
            }
            if (checkedRulesArr.length == 0) {
                swal('提示', '请选择要执行的检查项', 'info');
                return;
            }
            var params = {
                jobName: $scope.checkMsg,
                tableName: App.Temp.currentTableName
            };
            // 判断检查描述是否重复
            dsMeta.checkMsgExists(params).then(function (data) {
                if (data.isExistsflag) {
                    swal('提示', '检查描述重复，请重新输入', 'error');
                } else {
                    var param = getCheckParam();
                    $scope.checkDisable = true;
                    $scope.closeSubModal();
                    $scope.$emit('REFRESHCHECKBTN', true);
                    dsMeta.exeOnlineCheck(param).then(function (dat) {
                        if (dat) {
                            var timer = $interval(function () {
                                dsMeta.getJobById(dat).then(function (d) {
                                    if (d.status == 3 || d.status == 4) { // 1-创建，2-执行中 3-成功 4-失败
                                        $interval.cancel(timer);
                                        $scope.progress = 100;
                                        $scope.checkDisable = false;
                                        $scope.$emit('REFRESHCHECKBTN', false);
                                        if (d.status == 3) {
                                            swal('提示', '执行检查执行成功', 'info');
                                            $scope.closeSubModal();
                                        } else {
                                            swal('提示', '执行检查执行失败', 'info');
                                        }
                                    }
                                });
                            }, 5000);
                        }
                    });
                }
            });
        };

        $scope.checkRangeChange = function () {
            if ($scope.checkRange == 2) {
                $scope.adminDisable = false;
                getAllSuits(5, 1);
            } else {
                $scope.adminDisable = true;
                getAllSuits(5, 0);
            }
        };

        $scope.cancel = function () {
            $scope.closeSubModal();
        };

        $scope.reset = function () {
            $scope.checkRange = 0;
            $scope.checkAdminId = '';
            $scope.checkMsg = '';
            getAllSuits(5, 0);
            checkedRulesArr = []; // 选中的规则号
        };

        $scope.filterRuleCode = function () {
            $scope.getRulesBySuitId($scope.currentSuite, $scope.ruleCode);
        };

        getAllSuits(5, 0);
        // 初始化
        var initialize = function () {
            // 获取当前选中的数据
            getAllSuits(5, 0);
            $scope.checkRange = 0;
            $scope.checkMsg = '';
            checkedRulesArr = []; // 选中的规则号
        };
        $scope.$on('SubModalReload', initialize);
        // var unbindHandler = $scope.$on('SubModalReload', initialize);
        // $scope.$on('$destroy', function () {
        //     unbindHandler = null;
        // });
    }
]);
