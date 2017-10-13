/**
 * Created by wuzhen on 2016/12/6.
 */
angular.module('app').controller('monthTaskMainCtrl', ['$scope', 'ngDialog', 'dsColumn', 'dsManage',
    function ($scope, ngDialog, dsColumn, dsManage) {
        if (!$scope.testLogin()) {
            return;
        }

        if (!$scope.testTask()) {
            return;
        }

        $scope.subtaskName = '';

        // 根据屏幕计算高度
        // var height = document.documentElement.clientHeight;
        // var width = document.documentElement.clientWidth;
        // var percent = height / 1019;
        //
        // $scope.mapBackGround = {
        //     'padding-top': (height - (1000 * percent)) / 2 + 'px',
        //     width: width + 'px',
        //     height: height + 'px',
        //     position: 'absolute'
        // };

        var resizeWindow = function () {
            var height = document.documentElement.clientHeight;
            $scope.panelBodyHight = {
                height: height + 'px'
            };
        };

        window.onresize = function () {
            // ng-style不管用
            $('.column_container').css({
                height: document.documentElement.clientHeight
            });
        };

        $scope.subTaskKinds = [
            // make eslint happy
            {
                label: '中文名称',
                workType: 'poi_name',
                kcLog: 0,
                flag: 0,
                select: true
            }, {
                label: '英文名称',
                workType: 'poi_englishname',
                kcLog: 0,
                flag: 0,
                select: false
            }, {
                label: '中文地址',
                workType: 'poi_address',
                kcLog: 0,
                flag: 0,
                select: false
            }, {
                label: '英文地址',
                workType: 'poi_englishaddress',
                kcLog: 0,
                flag: 0,
                select: false
            }, {
                label: '深度信息-停车场',
                workType: 'deepParking',
                kcLog: 0,
                flag: 0,
                select: false
            }, {
                label: '深度信息-汽车租赁',
                workType: 'deepCarrental',
                kcLog: 0,
                flag: 0,
                select: false
            }, {
                label: '深度信息-通用深度',
                workType: 'deepDetail',
                kcLog: 0,
                flag: 0,
                select: false
            }, {
                label: '点位调整-开发中',
                workType: '',
                kcLog: 0,
                flag: 0,
                select: false
            }, {
                label: '后期专项-开发中',
                workType: '',
                kcLog: 0,
                flag: 0,
                select: false
            }, {
                label: '月后批处理-开发中',
                workType: '',
                kcLog: 0,
                flag: 0,
                select: false
            }, {
                label: '区域检查专项-开发中',
                workType: '',
                kcLog: 0,
                flag: 0,
                select: false
            }
            //     {
            //     label: '敏感信息处理-开发中',
            //     workType: '',
            //     kcLog: 0,
            //     flag: 0,
            //     select: false
            // }
        ];

        $scope.workType = $scope.subTaskKinds[0].id; // 默认选中名称类

        $scope.selectWorkType = function (item) {
            if (item.noEvent) {
                return;
            }
            for (var i = 0; i < $scope.subTaskKinds.length; i++) {
                $scope.subTaskKinds[i].select = false;
                item.select = true;
            }
            sessionStorage.setItem('FM-Quality-one-level', JSON.stringify({
                label: item.label,
                workType: item.workType
            }));
            if (item.label.indexOf('深度信息') == -1) {
                $scope.openMonthEditor(item.workType);
            } else {
                App.Temp.monthTaskType = item.workType;
                App.Temp.SubTask.monthTaskType = item.workType;
                App.Util.setSessionStorage('SubTask', App.Temp.SubTask);
                window.location.href = '#/editor?access_token=' + App.Temp.accessToken + '&random=' + (new Date()).getTime();
            }
        };

        // 打开任务列表
        $scope.goTaskMenu = function () {
            ngDialog.open({
                template: 'task/taskGeneralPage.html',
                controller: 'taskGeneralPageCtrl',
                className: 'ngdialog-theme-default',
                width: '100%',
                height: '100%',
                closeByEscape: false,
                closeByDocument: false
            });
        };

        $scope.openMonthEditor = function (workType) {
            var route;
            if (workType === 'deepCarrental' || workType === 'deepDetail' || workType === 'deepParking') {
                route = '#/deepInfo';
            } else if (workType === 'poi_name') {
                route = '#/chinaNameTask';
            } else if (workType === 'poi_address') {
                route = '#/chinaAddressTask';
            } else if (workType === 'poi_englishname') {
                route = '#/engNameTask';
            } else if (workType === 'poi_englishaddress') {
                route = '#/engAddressTask';
            } else {
                route = '#/editor';
            }
            App.Temp.monthTaskType = workType;
            App.Temp.SubTask.monthTaskType = workType;
            App.Util.setSessionStorage('SubTask', App.Temp.SubTask);

            window.location.href = route + '?access_token=' + App.Temp.accessToken;
        };

        var initSubTaskList = function () {
            // 如果是质检，屏蔽深度信息
            if (App.Temp.qcTaskFlag) {
                for (var i = 0; i < $scope.subTaskKinds.length; i++) {
                    if ($scope.subTaskKinds[i].workType == 'deepParking' || $scope.subTaskKinds[i].workType == 'deepCarrental' ||
                        $scope.subTaskKinds[i].workType == 'deepDetail') {
                        $scope.subTaskKinds[i].label += '-开发中';
                        $scope.subTaskKinds[i].noEvent = true;
                        $scope.subTaskKinds[i].flag = 0;
                        $scope.subTaskKinds[i].kcLog = 0;
                    }
                }
            }
        };

        function initPage() {
            // initSubTaskList();
            resizeWindow();
            dsColumn.queryKcLog(App.Temp.subTaskId).then(function (res) {
                if (res) {
                    $scope.workItemLog = res;
                    for (var i = 0; i < $scope.subTaskKinds.length; i++) {
                        if (res[$scope.subTaskKinds[i].workType]) {
                            $scope.subTaskKinds[i].kcLog = res[$scope.subTaskKinds[i].workType].kcLog;
                            $scope.subTaskKinds[i].flag = res[$scope.subTaskKinds[i].workType].flag;
                        }
                    }

                    // initSubTaskList();
                }
            });
            // 查询子任务名称
            var param = {
                platForm: 1,
                snapshot: 1,
                status: 1,
                pageSize: 1000
            };
            dsManage.getSubtaskListByUser(param).then(function (data) {
                if (data.errcode === 0) {
                    for (var i = 0; i < data.data.result.length; i++) {
                        var temp = data.data.result[i];
                        if (temp.subtaskId == App.Temp.subTaskId) {
                            App.Temp.subtaskName = temp.name;
                            $scope.subtaskName = App.Temp.subtaskName;
                        }
                    }
                }
            });
        }

        initPage();

        $scope.$on('$destroy', function () {
            var opens = ngDialog.getOpenDialogs();
            if (opens && opens.length > 0) {
                ngDialog.closeAll();
            }
        });
    }
]);
