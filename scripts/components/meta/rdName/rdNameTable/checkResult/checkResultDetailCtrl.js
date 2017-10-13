/**
 * Created by mali on 2017/4/8.
 * 检查结果详情界面
 */
angular.module('app').controller('checkResultDetailCtrl', ['$scope', '$cookies', '$rootScope', '$ocLazyLoad', 'dsMeta', '$timeout',
    function ($scope, $cookies, $rootScope, $ocLazyLoad, dsMeta, $timeout) {
        // 页面刷新时，从cookies中重新读取用户信息
        if (!App.Temp.userId) {
            var userCookie = $cookies.getObject('FM-EDITOR-User-' + App.Util.getUrlParam('access_token'));
            if (userCookie) {
                App.Temp.userId = userCookie.userId;
            } else {
                swal({
                    title: '登陆已失效，请重新登陆！',
                    type: 'error',
                    animation: 'slide-from-top',
                    closeOnConfirm: true,
                    confirmButtonText: '重新登陆'
                }, function () {
                    App.Util.logout();
                });
                return;
            }
        }

        $scope.userName = App.Temp.userName;
        $scope.userId = App.Temp.userId;

        $scope.pre = function () {
            window.location.href = '#/main';
        };

        // 高亮点击的菜单
        $scope.taskList = [];
        var menuHighLight = function (item) {
            for (var i = 0; i < $scope.taskList.length; i++) {
                var temp = $scope.taskList[i];
                temp.select = false;
                if (temp.taskName == item.taskName) {
                    temp.select = true;
                    $scope.jobName = temp.jobName;
                    $scope.taskName = temp.taskName;
                }
            }
        };

        $scope.selectTask = function (item) {
            menuHighLight(item);
            var temp = {
                taskName: $scope.taskName
            };
            $scope.$broadcast('refreshCheckRestList', temp);
            // 检查结果表格title
            // $scope.checkResultTableTitle = item.jobName;
        };

        // 计算两个日期的月份差
        var dateDif = function (date1, date2) {
            if ($scope.fromDate && $scope.untilDate) {
                date1 = date1.split('-');
                date1 = parseInt(date1[0], 10) * 12 + parseInt(date1[1], 10);
                date2 = date2.split('-');
                date2 = parseInt(date2[0], 10) * 12 + parseInt(date2[1], 10);
                var m = Math.abs(date1 - date2);
                console.log(m);
            }
        };

        // 获取当前日期的下一个月
        var getNextMonth = function (date) {
            var arr = date.split('-');
            var year = arr[0]; // 获取当前日期的年份
            var month = arr[1]; // 获取当前日期的月份
            var day = arr[2]; // 获取当前日期的日
            var days = new Date(year, month, 0);
            days = days.getDate(); // 获取当前日期中的月的天数
            var year2 = year;
            var month2 = parseInt(month, 10) + 1;
            if (month2 == 13) {
                year2 = parseInt(year2, 10) + 1;
                month2 = 1;
            }
            var day2 = day;
            var days2 = new Date(year2, month2, 0);
            days2 = days2.getDate();
            if (day2 > days2) {
                day2 = days2;
            }
            if (month2 < 10) {
                month2 = '0' + month2;
            }

            var t2 = year2 + '-' + month2 + '-' + day2;
            return t2;
        };

        // 获取当前日期的上一个月
        var getPreMonth = function (date) {
            var arr = date.split('-');
            var year = arr[0]; // 获取当前日期的年份
            var month = arr[1]; // 获取当前日期的月份
            var day = arr[2]; // 获取当前日期的日
            var days = new Date(year, month, 0);
            days = days.getDate(); // 获取当前日期中月的天数
            var year2 = year;
            var month2 = parseInt(month, 10) - 1;
            if (month2 == 0) {
                year2 = parseInt(year2, 10) - 1;
                month2 = 12;
            }
            var day2 = day;
            var days2 = new Date(year2, month2, 0);
            days2 = days2.getDate();
            if (day2 > days2) {
                day2 = days2;
            }
            if (month2 < 10) {
                month2 = '0' + month2;
            }
            var t2 = year2 + '-' + month2 + '-' + day2;
            return t2;
        };

        // 起终点时间
        $scope.fromDate = '';
        $scope.untilDate = '';
        $scope.maxDate = null;
        $scope.minDate = null;
        $scope.$watch('fromDate', function (newValue, oldValue) {
            if (newValue) {
                var next1 = getNextMonth(newValue);
                var next2 = getNextMonth(next1);
                $scope.maxDate = next2;
            }
        });
        $scope.$watch('untilDate', function (newValue, oldValue) {
            if (newValue) {
                var pre1 = getPreMonth(newValue);
                var pre2 = getPreMonth(pre1);
                $scope.minDate = pre2;
            }
        });

        // 初始化任务列表数据的选中状态
        var initTaskList = function (data) {
            for (var i = 0; i < data.length; i++) {
                data[i].select = false;
            }
            return data;
        };

        // 检查任务查询
        $scope.filterJobName = '';
        $scope.checkTaskList = function () {
            var parameter = {
                tableName: App.Temp.currentTableName,
                startDate: $scope.fromDate,
                endDate: $scope.untilDate,
                jobName: $scope.filterJobName
            };
            dsMeta.checkRstTaskList(parameter).then(function (data) {
                if (data) {
                    $scope.taskList = initTaskList(data);
                    $scope.jobName = $scope.taskList[0].jobName;
                    // 默认展示第一项
                    menuHighLight($scope.taskList[0]);

                    // 根据当前jobname 同步加载 检查结果列表
                    $ocLazyLoad.load('./../../scripts/components/meta/rdName/rdNameTable/checkResult/checkResultTableCtrl.js').then(function () {
                        $scope.tableUrl = './../../scripts/components/meta/rdName/rdNameTable/checkResult/checkResultTableTpl.html';
                    });
                    // 目的：每次打开面板都重新加载子面板
                    $timeout(function () {
                        $scope.$broadcast('CheckResultTableReload');
                    }, 100);
                }
            });
        };

        // 根据条件过滤任务列表
        $scope.$watch('fromDate + untilDate + filterJobName', function () {
            if (($scope.fromDate && !$scope.untilDate) || (!$scope.fromDate && $scope.untilDate)) {
                return;
            }
            if (!$scope.fromDate) {
                $scope.fromDate = '';
            }
            if (!$scope.untilDate) {
                $scope.untilDate = '';
            }
            var parameter = {
                tableName: App.Temp.currentTableName,
                startDate: $scope.fromDate,
                endDate: $scope.untilDate,
                jobName: $scope.filterJobName
            };
            dsMeta.checkRstTaskList(parameter).then(function (data) {
                if (data) {
                    $scope.taskList = initTaskList(data);
                    $scope.jobName = $scope.taskList[0].jobName;
                    // 默认展示第一项
                    menuHighLight($scope.taskList[0]);
                    var temp = {
                        taskName: $scope.taskName
                    };
                    $scope.$broadcast('refreshCheckRestList', temp);
                }
            });
        });
        $scope.checkTaskList();
    }
]);
