/**
 * Created by zhaohang on 2016/11/1.
 */
angular.module('app').controller('taskGeneralPageCtrl', ['$scope', 'ngDialog', '$ocLazyLoad',
    'appPath', 'dsManage', 'dsFcc', '$timeout',
    function ($scope, ngDialog, $ocLazyLoad, appPath, dsManage, dsFcc, $timeout) {
        $scope.loading = { flag: false };
        dsManage.referenceLoadingSwitch($scope.loading);
        $scope.childListFlag = true; // 当前任务折叠flag;
        $scope.childMarchFlag = false; // 任务进展折叠flag;
        $scope.openChildList = function () {
            $scope.childListFlag = !$scope.childListFlag;
        };
        $scope.openChildMarch = function () {
            $scope.childMarchFlag = !$scope.childMarchFlag;
        };
        $scope.logout = function () {
            window.location.href = '#/login';
            ngDialog.close();
        };
        $scope.currentSelected = null;

        $scope.taskTypes = {
            '-1': '总览',
            0: 'POI_采集',
            1: '道路_采集',
            2: '一体化_采集',
            3: '一体化_grid粗编_日编',
            4: '一体化_区域粗编_日编',
            5: 'POI粗编_日编',
            6: '代理店',
            '7_0': 'POI专项_月编（零批）',
            '7_1': 'POI专项_月编（一批）',
            '7_2': 'POI专项_月编（二批）',
            '7_3': 'POI专项_月编（三批）',
            8: '道路_grid精编',
            9: '道路_grid粗编',
            10: '道路区域专项',
            11: '预处理子任务'
        };
        
        /**
         * 按显示方式显示当前任务列表
         */
        var showTaskList = function () {
            if ($scope.cardShow) {
                $ocLazyLoad.load('./task/taskList/taskListChildCtrl.js').then(function () {
                    $scope.taskListUrl = './task/taskList/taskListChildTemp.html';
                    $scope.taskHistoryHighLight = false;
                    $timeout(function () {
                        $scope.$broadcast('queryTaskList', $scope.currentSelected);
                    }, 500);
                });
            } else {
                $ocLazyLoad.load('./task/taskList/taskTableCtrl.js').then(function () {
                    $scope.taskListUrl = './task/taskList/taskTableTpl.html';
                    $scope.taskHistoryHighLight = false;
                    $timeout(function () {
                        $scope.$broadcast('queryTaskList', $scope.currentSelected);
                    }, 500);
                });
            }
        };

        // 切换显示效果
        $scope.cardShow = true;
        $scope.changeTaskDisplay = function () {
            $scope.cardShow = !$scope.cardShow;
            showTaskList();
        };

        // 选择任务类型;
        $scope.selectTaskList = function (type, data) {
            $scope.finalResultArray.forEach(function (item) {
                item.select = (item.type === data.type);
            });
            $scope.currentSelected = data;
            if (type === 'taskList') {
                showTaskList();
            } else {
                $ocLazyLoad.load('./task/taskList/taskHistoryCtrl.js').then(function () {
                    $scope.taskListUrl = './task/taskList/taskHistoryTemp.html';
                    $scope.taskHistoryHighLight = true;
                });
            }
        };
        // 搜索所有的子任务并组成数据模型;
        $scope.getTaskTotal = function () {
            var param = {
                platForm: 1,
                snapshot: 1,
                status: 1,
                pageSize: 10000
            };
            $scope.finalResultObj = { '-1': { total: 0, datas: [], type: -1 } };
            $scope.finalResultArray = [];
            dsManage.getSubtaskListByUser(param).then(function (data) {
                var results = data.data.result;
                results.forEach(function (item) {
                    var cond1 = [0, 2, 3, 4, 7].indexOf(item.type) > -1;
                    var cond2 = true;
                    var taskType = item.type;
                    if (item.descp) { cond2 = !/预处理/g.test(item.descp); }
                    if (item.type === 7) {
                        taskType = item.type + '_' + item.lot;
                    }
                    if (cond1 && cond2) {
                        if (!$scope.finalResultObj[taskType]) {
                            $scope.finalResultObj[taskType] = { total: 0, datas: [], type: taskType };
                        }
                        $scope.finalResultObj['-1'].datas.push(item);
                        $scope.finalResultObj['-1'].total += 1;
                        $scope.finalResultObj[taskType].datas.push(item);
                        $scope.finalResultObj[taskType].total += 1;
                        $scope.finalResultObj[taskType].select = false;
                    }
                });
                // 解决总览总是在最后的问题;
                for (var key in $scope.finalResultObj) {
                    if (key === '-1') {
                        $scope.finalResultArray.unshift($scope.finalResultObj[key]);
                    } else {
                        $scope.finalResultArray.push($scope.finalResultObj[key]);
                    }
                }
                // 更新当前选中值;
                if (!$scope.currentSelected) {
                    $scope.currentSelected = FM.Util.clone($scope.finalResultArray[0]);
                } else {
                    $scope.finalResultArray.forEach(function (item) {
                        if (item.type === $scope.currentSelected.type) {
                            $scope.currentSelected = FM.Util.clone(item);
                        }
                    });
                }
                $scope.selectTaskList('taskList', $scope.currentSelected);
            });
        };
        
        $scope.getTaskTotal();
        // 提交或关闭后触发;
        $scope.$on('pushTaskList', function () {
            $scope.getTaskTotal();
        });
    }
]);
