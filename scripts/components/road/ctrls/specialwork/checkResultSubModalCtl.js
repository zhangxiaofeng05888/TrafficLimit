angular.module('app').controller('checkResultSubModalCtl', ['$window', '$scope', '$timeout', 'dsEdit', 'dsMeta', 'appPath', '$sce', function ($window, $scope, $timeout, dsEdit, dsMeta, appPath, $sce) {
    /**
     * 修改检查项状态
     * @param pid 数据pid
     * @param newType 要修改成的状态
     */
    $scope.changeType = function (pid, newType) {
        dsEdit.updateRdNCheckType(pid, newType).then(function (data) {
            if (data) {
                $scope.refreshCheckResult();
            }
        });
    };
    /**
     * 展示编辑界面
     * @param pid
     * @param type
     */
    $scope.showDetail = function (e, row) {
        var target = e.target.dataset;
        var pid = target.pid;
        dsMeta.queryRdNByNameID(pid).then(function (data) {
            if (data) {
                $scope.$emit('openEditPanel', data);
                $scope.closeSubModal();
            } else {
                swal('提示', '未查询到数据', 'error');
            }
        });
    };

    /**
     * 格式化等级
     * @returns {string}
     */
    function getLevel() {
        var html = '<div class="ui-grid-cell-contents"><span ng-class="{0: \'text-muted\',1: \'text-danger\',2: \'text-warning\',3: \'text-info\'}[row.entity.rank]">{{{0: \'--\',1: \'错误\',2: \'警告\',3: \'提示\'}[row.entity.rank]}}</span></div>';
        return html;
    }

    /**
     * 格式化错误对象;
     * @param datas
     * @returns {*}
     */
    $scope.formatErrorList = function (datas) {
        var htmlArray = [];
        for (var i = 0; i < datas.length; i++) {
            htmlArray.push('[<a style="cursor: pointer;" class="check-target text-primary" data-type="' + datas[i].featType + '" data-pid="' + datas[i].pid + '">' + datas[i].featType + ',' + datas[i].pid + '</a>]');
        }
        return $sce.trustAsHtml(htmlArray.join(', '));
    };
    function getErrorObj() {
        var html = '<div ng-click="grid.appScope.showDetail($event, row)" class="ui-grid-cell-contents" ng-bind-html="grid.appScope.formatErrorList(row.entity.targets)"></div>';
        return html;
    }

    /**
     * 格式化检查状态
     * @returns {string}
     */
    function getCheckStatusTpl() {
        var html = '<div class="ui-grid-cell-contents"><button class="btn al" ng-class="{3: \'active\'}[row.entity.status]" data-type="" data-pid="" ng-click="grid.appScope.changeType(row.entity.pid, 3)"></button>' +
            '<button class="btn no" ng-class="{2: \'active\'}[row.entity.status]" ng-click="grid.appScope.changeType(row.entity.pid, 2)"></button>' +
            '<button class="btn ex" ng-class="{1: \'active\'}[row.entity.status]" ng-click="grid.appScope.changeType(row.entity.pid, 1)"></button></div>';
        return html;
    }

    /**
     * 格式化检查时间
     * @returns {string}
     */
    function getCheckTime() {
        var html = '<div>{{row.entity.createDate.substr(0,10)}}</div>';
        return html;
    }
    var paginationOptions = {
        pageNum: 1,
        pageSize: 15,
        sortBy: ''
    };

    /**
     * 获取表格数据
     * @param options 请求参数
     * @param callBack
     */
    function getData(options, callBack) {
        var param = {
            subtaskId: App.Temp.subTaskId,
            pageSize: 15,
            pageNum: 1,
            sortby: paginationOptions.sortby || ''
        };
        var params = $.extend(param, options);
        $scope.loadingFlag = true;
        dsEdit.getRoadNameCheckResult(params).then(function (data) {
            if (data == -1) {
                return;
            }
            var ret = [];
            var total = data.totalCount;
            for (var i = 0, len = data.result.length; i < len; i++) {
                ret.push(new FM.dataApi.IxCheckResult(data.result[i]));
            }
            $scope.gridOptions.totalItems = total;
            $scope.gridOptions.data = ret;
            if (callBack) {
                callBack($scope.gridOptions.data);
            }
        }).finally(function () {
            $scope.loadingFlag = false;
        });
    }

    /**
     * 刷新检查结果列表
     */
    $scope.refreshCheckResult = function () {
        getData();
    };
    /**
     * 初始化表格
     */
    var initialize = function () {
        $scope.gridOptions = {
            enableColumnMenus: false,
            useExternalPagination: true,
            paginationPageSizes: [15, 25, 50], // 每页显示个数选项
            paginationCurrentPage: 1, // 当前的页码
            paginationPageSize: 15, // 每页显示个数
            paginationTemplate: appPath.tool + 'uiGridPager/uiGridPagerTmpl.htm',
            enableFullRowSelection: true,
            enableRowHeaderSelection: false,
            multiSelect: false,
            modifierKeysToMultiSelect: false,
            noUnselect: false,
            columnDefs: [
                { field: 'ruleId', displayName: '规则号', enableSorting: true, minWidth: 55 },
                { field: 'rank', displayName: '等级', enableSorting: false, minWidth: 40, cellTemplate: getLevel() },
                { field: 'targets', displayName: '错误对象', enableSorting: false, minWidth: 120, cellTemplate: getErrorObj() },
                { field: 'information', displayName: '错误信息', enableSorting: false, minWidth: 120 },
                { field: 'status', displayName: '确认状态', enableSorting: false, minWidth: 90, cellTemplate: getCheckStatusTpl() },
                { field: 'createDate', displayName: '检查时间', enableSorting: false, minWidth: 50, cellTemplate: getCheckTime() },
                { field: 'jobId', displayName: 'jobId', enableSorting: false, minWidth: 50 }
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                // 分页事件;
                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    paginationOptions.pageNum = newPage;
                    paginationOptions.pageSize = pageSize;
                    getData(function (data) {
                        // 翻页后自动滚动到第一条数据
                        $timeout(function () {
                            gridApi.core.scrollTo(data[0]);
                        });
                    });
                });

                // 处理改变列表高度后，滚动条跳动的问题
                gridApi.grid.registerRowsProcessor(FM.ColumnUtils.uiGridAutoHight, 200);

                // 排序事件
                gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                    if (sortColumns.length) {
                        var direct = sortColumns[0].sort.direction;
                        var sortName = sortColumns[0].field.toLowerCase();
                        paginationOptions.sortby = direct == 'desc' ? '-' + sortName : '+' + sortName;
                        getData();
                    }
                });
            }
        };
        // 初始化表格;
        getData();
    };
    $scope.$on('ReloadData-roadnameCheckResult', initialize);
}]);
