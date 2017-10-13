/**
 * Created by chenxiao on 2016/7/26.
 */
angular.module('app').controller('CheckJobCtrl', ['$rootScope', '$scope', '$timeout',
    'appPath', 'dsEdit',
    function ($rootScope, $scope, $timeout, appPath, dsEdit) {
        var eventCtrl = new fastmap.uikit.EventController();
        $scope.checkType = 0;
        $scope.suites = [];
        $scope.selectedSuite = null;
        $scope.loaddingSuites = false;
        $scope.loaddingRules = false;

        var toStage2 = function (type) {
            $scope.checkType = type;
            $scope.suites = [];
            $scope.selectedSuite = null;

            $scope.loaddingSuites = true;
            dsEdit.getCheckRuleSuites(type).then(function (data) {
                $scope.loaddingSuites = false;
                $scope.suites = data;
                if ($scope.suites.length > 0) {
                    $scope.selectSuite($scope.suites[0]);
                }
            });
        };

        // 执行检查;
        var doExecute = function (rules) {
            dsEdit.exeOnlineCheck($scope.checkType, rules).then(function (data) {
                if (data) {
                    var temp = {
                        itemId: data,
                        itemType: 'check',
                        itemRemark: null,
                        itemStatus: false
                    };

                    $rootScope.onLineJobStack = temp;
                    eventCtrl.fire(L.Mixin.EventTypes.PARTSCLOSEPANEL, {
                        panelName: 'CheckJobPanel'
                    });
                    sessionStorage.setItem('ON-LINE-JOB-STACK', JSON.stringify($rootScope.onLineJobStack));
                    $scope.showLoading();
                    // $timeout(function () {
                    //     $scope.hideLoading();
                    // }, 300000);
                }
            });
        };

        // 运行监听函数;
        $scope.execute = function () {
            let rules = [];
            let temp;
            let f = true;
            for (let i = 0; i < $scope.suites.length; i++) {
                if ($scope.suites[i].checked) {
                    if ($scope.suites[i].ruleLoaded) {
                        temp = $scope.suites[i].rules.filter(it => it.checked).map(it => it.ruleCode);
                        Array.prototype.push.apply(rules, temp);
                    } else {
                        f = false;
                        break;
                    }
                }
            }

            if (!f) {
                swal('选择的Suite包尚未加载完成，请稍后再试！', null, 'info');
                return;
            }

            if (rules.length === 0) {
                swal('请先选择要执行的检查规则！', null, 'info');
                return;
            }

            doExecute(rules);
        };

        // suite包切换;
        $scope.selectSuite = function (suite) {
            if (suite.selected) {
                return;
            }

            if ($scope.selectedSuite) {
                $scope.selectedSuite.selected = false;
            }
            suite.selected = true;

            suite.ruleLoaded = !!suite.ruleLoaded;
            if (!suite.ruleLoaded && !suite.rulePromise) {
                suite.rulePromise = dsEdit.getCheckRulesBySuiteId(suite.suiteId).then(function (data) {
                    suite.rules = data;
                    suite.ruleLoaded = true;
                });
            }

            $scope.selectedSuite = suite;
        };

        // suite包中规则选择;
        $scope.toggleSuite = function (suite) {
            let i;
            if (suite.checked) {
                if (suite.ruleLoaded) {
                    for (i = 0; i < suite.rules.length; i++) {
                        suite.rules[i].checked = true;
                    }
                } else {
                    if (suite.rulePromise) {
                        suite.rulePromise.then(function () {
                            for (let j = 0; j < suite.rules.length; j++) {
                                suite.rules[j].checked = true;
                            }
                        });
                    } else {
                        suite.rulePromise = dsEdit.getCheckRulesBySuiteId(suite.suiteId).then(function (data) {
                            suite.rules = data;
                            suite.ruleLoaded = true;

                            for (let j = 0; j < suite.rules.length; j++) {
                                suite.rules[j].checked = true;
                            }
                        });
                    }
                }
            } else {
                for (i = 0; i < suite.rules.length; i++) {
                    suite.rules[i].checked = false;
                }
            }
        };

        // 检查规则选择;
        $scope.toggleRule = function (rule) {
            if (rule.checked) {
                $scope.selectedSuite.checked = true;
            } else {
                let temp = $scope.selectedSuite.rules.filter(it => it.checked);
                if (temp.length === 0) {
                    $scope.selectedSuite.checked = false;
                }
            }
        };

        var initialize = function (event, data) {
            // 开始就调道路粗编的suite包;
            toStage2(3);
        };

        $scope.$on('ReloadData-CheckJobPanel', initialize);
    }
]);
