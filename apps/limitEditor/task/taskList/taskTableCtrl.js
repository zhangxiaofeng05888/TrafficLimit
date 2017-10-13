/**
 * Created by mali on 2017/8/28.
 * 任务列表表格显示
 */
angular.module('app').controller('taskTableCtrl', ['$scope', 'ngDialog', 'dsManage', 'dsFcc', '$timeout', 'dsColumn', 'appPath',
    function ($scope, ngDialog, dsManage, dsFcc, $timeout, dsColumn, appPath) {
        var width = document.documentElement.clientWidth - 240;
        var taskNum = parseInt((width - 15) / 315, 10);
        var taskLength = width - taskNum * 300;
        $scope.taskListMargin = {
            'margin-left': taskLength / (taskNum + 1) + 'px'
        };

        $scope.taskListData = [];
        $scope.currentTipsTypes = 0;
        $scope.currentTipsNum = 0;
        /**
         * 获取表格数据
         */
        var getData = function () {
            $scope.gridOptions.totalItems = $scope.taskListData.length;
            $scope.gridOptions.data = $scope.taskListData;
        };
        /**
         *显示子任务
         * @param data
         */
        var getChildTaskList = function (data) {
            $scope.taskListData.length = 0;
            $timeout(function () {
                $scope.taskListData = FM.Util.clone(data.datas);
                getData();
            });
        };


        /**
         * 抽取日线tips质检;
         * @param $event
         * @param item
         */
        $scope.extractTask = function ($event, item) {
            $scope.loadingFlag = true;
            $event.stopPropagation();
            if (item.isQuality == 1 && item.commonStatus != '0') {
                swal('提示', '常规任务未关闭，不可申请', 'warning');
                return;
            }
            var param = {
                subTaskId: item.subtaskId,
                checkerId: App.Temp.User.userId,
                checkerName: App.Temp.User.userRealName
            };
            dsManage.getSubtaskById(item.subtaskId)
                .then(function (data) {
                    if (data) {
                        param.grids = data.gridIds;
                        dsFcc.extractDayTipsTask(param).then(function (resData) {
                            if (resData) {
                                $scope.currentTipsNum = resData.data.total;
                                $scope.currentTipsTypes = resData.data.typeCount;
                                var html = '已抽取 ' + $scope.currentTipsNum + ' 个Tips，共 ' + $scope.currentTipsTypes + ' 类';
                                swal({
                                    title: '抽取质检Tips',
                                    text: html,
                                    html: true,
                                    showCancelButton: false,
                                    allowEscapeKey: false,
                                    confirmButtonText: '关闭',
                                    confirmButtonColor: '#ec6c62'
                                }, function (f) {
                                    if (f) { // 关闭弹窗;
                                        swal.close();
                                        $timeout(function () {
                                            location.reload();
                                        }, 500);
                                    }
                                });
                            }
                            $scope.loadingFlag = false;
                        });
                    }
                });
        };

        /**
         * 选中子任务
         * @param item
         */
        $scope.selectSubTask = function (item) {
            if (item.type === 8 || item.type === 9) { // 暂时对月编-道路grid精编和月编-道路grid粗编的特殊处理
                return;
            }

            // 如果是质检任务，且未申请数据，则不允许进入编辑
            if ((item.type == 3 || item.type == 4) && item.isQuality == 1 && (item.tipsTypeCount == 0 && item.checkCount == 0)) {
                swal('提示', '请先申请质检数据！', 'warning');
                return;
            }

            dsManage.getSubtaskById(item.subtaskId).then(function (data) {
                if (data) {
                    App.Temp.dbId = data.dbId;
                    App.Temp.subTaskId = data.subtaskId;
                    App.Temp.taskType = data.type;
                    App.Temp.programType = data.programType;
                    App.Temp.subTaskName = data.name;
                    App.Temp.gridList = data.gridIds;
                    if (data.stage == 1) { // 日编
                        App.Temp.mdFlag = 'd';
                    } else if (data.stage == 2) { // 月编
                        App.Temp.mdFlag = 'm';
                    } else { // 默认：日编
                        App.Temp.mdFlag = 'd';
                    }
                    App.Temp.monthTaskType = null;
                    // 判断是否是质检任务
                    if (data.isQuality === 1) {
                        App.Temp.qcTaskFlag = true;
                    } else {
                        App.Temp.qcTaskFlag = false;
                    }

                    App.Temp.SubTask = {
                        dbId: App.Temp.dbId,
                        subTaskId: App.Temp.subTaskId,
                        taskName: App.Temp.subTaskName,
                        taskType: App.Temp.taskType,
                        programType: App.Temp.programType,
                        gridList: data.gridIds || [],
                        meshList: data.meshes || [],
                        mdFlag: App.Temp.mdFlag,
                        monthTaskType: null,
                        geometry: data.geometry,
                        qcTaskFlag: App.Temp.qcTaskFlag,
                        qualityGeos: data.qualityGeos
                    };
                    App.Util.setSessionStorage('SubTask', App.Temp.SubTask);

                    ngDialog.close();

                    if (item.stage === 2) { // 月编POI专项
                        window.location.href = '#/monthTasks?access_token=' + App.Temp.accessToken + '&random=' + Math.floor(Math.random() * 100);
                    } else {
                        // 2017-4-27 modified by chenx
                        // 增加随机数参数，解决切换任务后，编辑页面不刷新的问题
                        window.location.href = '#/editor?access_token=' + App.Temp.accessToken + '&random=' + Math.floor(Math.random() * 100);
                    }
                }
            });
        };

        /**
         * 提交子任务
         * @param item
         */
        var pushSubTask = function (item) {
            $scope.loadingFlag = true;
            if (item.stage === 1 && (item.type === 3 || item.type === 4) && item.isQuality === 1) {
                dsFcc.closeQualityCheckTask(item.subtaskId)
                    .then(function () {
                        return dsManage.submitTask(item.subtaskId);
                    })
                    .then(function (data) {
                        if (data) {
                            $scope.$emit('pushTaskList');
                            $scope.loadingFlag = false;
                        }
                    });
            } else {
                dsManage.submitTask(item.subtaskId).then(function (res) {
                    if (res) {
                        $scope.$emit('pushTaskList');
                        $scope.loadingFlag = false;
                    }
                });
            }
        };

        /**
         * 关闭弹窗
         * @param item
         */
        var comformCloseDialog = function (item) {
            swal({
                title: '确认关闭此任务？',
                showCancelButton: true,
                allowEscapeKey: false,
                confirmButtonText: '是的，我要关闭',
                confirmButtonColor: '#ec6c62'
            }, function (f) {
                if (f) {
                    pushSubTask(item);
                }
            });
        };

        /**
         * 配置key的中文名称
         */
        var poiKeyName = {
            poi_name: '中文名称',
            poi_englishname: '英文名称',
            poi_englishaddress: '英文地址',
            poi_address: '中文地址',
            deepParking: '停车场',
            deepDetail: '通用深度',
            deepCarrental: '汽车租赁'
        };

        /**
         * 关闭任务
         * @param e
         * @param item
         */
        $scope.submitTask = function (e, item) {
            e.stopPropagation();
            // poi采集和一体化采集关闭必须待作业和已作业为0
            if (item.type == 0 || item.type == 2) {
                if (item.poiWaitWork != 0 || item.poiWorked != 0) {
                    swal('提示', '待作业POI或已作业POI不为0，无法关闭！', 'warning');
                    return;
                }
            }

            /**
             * type为7时，所有项必须都为0才可关闭
             */
            if (item.type == 7) {
                dsColumn.queryKcLog(item.subtaskId).then(function (data) {
                    var describeText = [];
                    var flag = false;
                    for (var key in data) {
                        if (data[key].flag != 0 || data[key].kcLog != 0) {
                            flag = true;
                            describeText.push(poiKeyName[key]);
                        }
                    }
                    if (flag) {
                        swal('提示', describeText.join('、') + '存在未提交的数据或库存log不为 0 ，不可关闭！', 'warning');
                    } else {
                        comformCloseDialog(item);
                    }
                });
            } else {
                comformCloseDialog(item);
            }
        };
        

        $scope.wHeight = document.documentElement.clientHeight;
        $scope.currentPage = 1;
        $scope.currentPageSize = 20;
        $scope.loadingFlag = false;

        /**
         * 质检列格式化
         * @returns {string}
         */
        function getQuality() {
            return '<div ng-if="row.entity.isQuality">质检</div><div ng-if="!row.entity.isQuality">常规</div>';
        }

        /**
         * 状态列格式化
         * @returns {string}
         */
        function getStatus() {
            var html = '<div ng-if="row.entity.type == 0 || row.entity.type == 2">' +
                '<div><span>待作业POI:</span>{{row.entity.poiWaitWork? row.entity.poiWaitWork : "无"}} </span></div>' +
                '<div><span>待提交POI:</span>{{row.entity.poiWorked? row.entity.poiWorked : "无"}} </span></div>' +
                '<div><span>已提交POI:</span>{{row.entity.poiCommit? row.entity.poiCommit : "无"}} </span></div>' +
                '</div>' +
                '<div ng-if="row.entity.type == 3 || row.entity.type == 4">' +
                '<div><span>待做Tips:</span>{{row.entity.tipsPrepared? row.entity.tipsPrepared : "无"}}</span></div>' +
                '<div><span>全部Tips:</span>{{row.entity.tipsTotal? row.entity.tipsTotal : "无"}}</span></div>' +
                '</div>' +
                '<div ng-if="row.entity.type == 7"><div><span>作业中</span></div></div>';
            return html;
        }

        /**
         * 操作列格式化
         * @returns {string}
         */
        function getOperation() {
            var html = '<div ng-if="([3,4].indexOf(row.entity.type) > -1 && !(row.entity.isQuality == 1 && (row.entity.tipsTypeCount ==0 && row.entity.checkCount == 0))) || [0, 2, 7].indexOf(row.entity.type) > -1" class="btn-task-table btn-close" ng-click="grid.appScope.submitTask($event, row.entity)">关闭</div>' +
                '<div ng-if="(row.entity.type == 3 || row.entity.type == 4) && row.entity.isQuality == 1 && (row.entity.tipsTypeCount===0 && row.entity.checkCount===0)" class="btn-task-table btn-apply" ng-click="grid.appScope.extractTask($event, row.entity)">申请</div>';
            return html;
        }

        /**
         * 双击行跳转界面方法
         * @returns {string}
         */
        var formatRow = function () {
            var html = '<div ng-dblClick="grid.appScope.selectSubTask(row.entity)">' +
                '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ' +
                'class="ui-grid-cell grid-cell-diy" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
                '</div>';
            return html;
        };
        /**
         * 表格配置初始化
         * @type {{enableColumnMenus: boolean, useExternalPagination: boolean, paginationPageSizes: number[], paginationCurrentPage: number, paginationPageSize: number, paginationTemplate: string, enableFullRowSelection: boolean, enableRowHeaderSelection: boolean, multiSelect: boolean, modifierKeysToMultiSelect: boolean, noUnselect: boolean, rowTemplate: string, columnDefs: *[], onRegisterApi: $scope.gridOptions.onRegisterApi}}
         */
        $scope.gridOptions = {
            enableColumnMenus: false,
            useExternalPagination: true,
            paginationPageSizes: [20, 50, 100, 200], // 每页显示个数选项
            paginationCurrentPage: 1, // 当前的页码
            paginationPageSize: 20, // 每页显示个数
            paginationTemplate: appPath.tool + 'uiGridPager/uiGridPagerTmpl.htm',
            enableFullRowSelection: true,
            enableRowHeaderSelection: false,
            multiSelect: false,
            modifierKeysToMultiSelect: false,
            noUnselect: false,
            rowTemplate: formatRow(),
            columnDefs: [{
                field: 'pageIndex',
                displayName: '序号',
                minWidth: '50',
                visible: true,
                cellTemplate: '<div class="ui-grid-cell-contents">{{(grid.appScope.currentPage-1)*grid.appScope.currentPageSize+grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'
            }, {
                field: 'name',
                displayName: '子任务名称',
                minWidth: 300,
                enableSorting: true,
                visible: true
            }, {
                field: 'isQuality',
                displayName: '环节',
                enableSorting: true,
                minWidth: 50,
                visible: true,
                cellTemplate: getQuality
            }, {
                field: 'planStartDate',
                displayName: '开始日期',
                minWidth: 80,
                enableSorting: true,
                visible: true
            }, {
                field: 'planEndDate',
                displayName: '结束日期',
                minWidth: 80,
                enableSorting: true,
                visible: true
            }, {
                field: 'version',
                displayName: '作业季',
                minWidth: 60,
                enableSorting: true,
                visible: true
            }, {
                field: 'status',
                displayName: '作业状态',
                minWidth: 200,
                visible: true,
                cellTemplate: getStatus
            }, {
                field: 'operate',
                displayName: '操作',
                minWidth: 100,
                visible: true,
                cellTemplate: getOperation
            }],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                gridApi.grid.registerRowsProcessor(FM.ColumnUtils.uiGridAutoHight, 200);

                // 分页事件;
                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    $scope.currentPage = newPage;
                    $scope.currentPageSize = pageSize;
                });
            }
        };

        /**
         * 监听父点击事件
         */
        $scope.$on('queryTaskList', function (event, data) {
            getChildTaskList(data);
        });
    }
]);
