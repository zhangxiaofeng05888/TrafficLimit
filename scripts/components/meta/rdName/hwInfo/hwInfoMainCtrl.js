/**
 * Created by mali on 2017/4/17.
 * 高速道路名表
 */
angular.module('app').controller('hwInfoMainCtl', ['$scope', '$ocLazyLoad', 'uibButtonConfig', '$sce', 'dsEdit', '$document', 'appPath', '$interval', '$timeout', 'dsMeta', 'ngDialog', 'uiGridConstants',
    function ($scope, $ocLazyLoad, uibBtnCfg, $sce, dsEdit, $document, appPath, $interval, $timeout, dsMeta, ngDialog, uiGridConstants) {
        var objectCtrl = fastmap.uikit.ObjectEditController();
        var _self = $scope;
        $scope.checkboxes = { checked: false };
        // 动态计算表格高度
        var height = document.documentElement.clientHeight - 215;
        $scope.rightTableHeight = {
            height: height + 'px'
        };
        $scope.tableContentHeight = {
            height: height - 50 + 'px'
        };
        var eventCtrl = fastmap.uikit.EventController();
        // 监控全选;
        $scope.$watch(function () {
            return $scope.checkboxes.checked;
        }, function (value) {
            angular.forEach($scope.hwInfoList, function (item) {
                item.checked = value;
            });
        });
        $scope.memoOpt = [
            { id: 0, label: '通用' },
            { id: 1, label: '13CY' },
            { id: 2, label: 'NBT' }
        ];
        $scope.uRecordOpt = {
            0: '无',
            1: '新增',
            2: '删除',
            3: '修改'
        };
        $scope.memoOpt = {
            0: '通用',
            1: '13CY',
            2: 'NBT'
        };

        function getMemoName() {
            return '<div>{{grid.appScope.memoOpt[row.entity.memo]}}</div>';
        }
        function getURecordName() {
            return '<div>{{grid.appScope.uRecordOpt[row.entity.uRecord]}}</div>';
        }
        $scope.cols = [
            {
                field: 'selector',
                headerCellTemplate: '<div><input type="checkbox" ng-model="grid.appScope.checkboxes.checked" class="fm-control"/></div>',
                cellTemplate: '<div><input type="checkbox" ng-model="row.entity.checked" class="fm-control"/></div>',
                displayName: '选择',
                visible: true,
                maxWidth: 30
            },
            // {
            //     field: 'num_index',
            //     title: '序号',
            //     width: '18px',
            //     show: true
            // },
            {
                field: 'hwPidUp',
                displayName: '上行高速号码',
                enableSorting: true,
                minWidth: 50,
                visible: true,
                type: 'number'
            },
            {
                field: 'hwPidDw',
                displayName: '下行高速号码',
                minWidth: 40,
                enableSorting: true,
                visible: true,
                type: 'number'
            },
            {
                field: 'nameGroupid',
                displayName: '名称组号',
                minWidth: 40,
                enableSorting: true,
                visible: true,
                type: 'number'
            },
            {
                field: 'memo',
                displayName: '备用信息',
                minWidth: 60,
                enableSorting: true,
                visible: true,
                cellTemplate: getMemoName
            },
            {
                field: 'uRecord',
                displayName: '更新记录',
                minWidth: 40,
                enableSorting: true,
                visible: true,
                cellTemplate: getURecordName,
                type: 'number'
            },
            {
                field: 'uFields',
                displayName: '更新字段',
                minWidth: 40,
                enableSorting: true,
                visible: true
            }
        ];

        // 初始化显示表格字段方法;
        $scope.initShowField = function (params) {
            for (var i = 0; i < $scope.cols.length; i++) {
                for (var j = 0; j < params.length; j++) {
                    if ($scope.cols[i].title == params[j]) {
                        $scope.cols[i].show = true;
                    }
                }
            }
        };

        // 重置表格字段显示方法;
        $scope.resetTableField = function () {
            for (var i = 0; i < $scope.cols.length; i++) {
                if ($scope.cols[i].show) {
                    $scope.cols[i].show = !$scope.cols[i].show;
                }
            }
        };

        // 表格配置过滤条件
        $scope.filter = {
            hwPidUp: '',
            hwPidDw: '',
            memo: [],
            uFields: '',
            uRecords: [],
            nameGroupid: ''
        };

        // 高级查询中道路类型默认值处理
        $scope.memoOptVal = {
            0: false,
            1: false,
            2: false
        };
        $scope.uRecordOptVal = {
            0: false,
            1: false,
            2: false,
            3: false
        };
        // 表格过滤查询
        $scope.filterHwPidUp = '';
        $scope.filterHwPidDw = '';
        // $scope.filterMemo = '';
        $scope.filterUFields = '';
        $scope.query = function () {
            $scope.filter.memo = [];
            $scope.filter.uRecords = [];
            $scope.filter.uFields = [];
            $scope.filter.hwPidUp = $scope.filterHwPidUp;
            $scope.filter.hwPidDw = $scope.filterHwPidDw;
            $scope.filter.nameGroupid = $scope.filterNameGroupid;
            // $scope.filter.memo = $scope.filterMemo;
            $scope.filter.uFields = $scope.filterUFields;
            for (var p in $scope.memoOptVal) {
                if ($scope.memoOptVal[p]) {
                    $scope.filter.memo.push(parseInt(p, 10));
                }
            }
            for (var q in $scope.uRecordOptVal) {
                if ($scope.uRecordOptVal[q]) {
                    $scope.filter.uRecords.push(parseInt(q, 10));
                }
            }
            $scope.refreshData();
        };

        // 重置方法
        $scope.reset = function () {
            $scope.filter.hwPidUp = '';
            $scope.filter.hwPidDw = '';
            $scope.filter.memo = [];
            $scope.filter.uFields = '';
            $scope.filter.uRecords = [];
            $scope.filter.nameGroupid = '';
            $scope.filterHwPidUp = '';
            $scope.filterHwPidDw = '';
            $scope.filterUFields = '';
            $scope.filterNameGroupid = '';
            $scope.memoOptVal = {
                0: false,
                1: false,
                2: false
            };
            $scope.uRecordOptVal = {
                0: false,
                1: false,
                2: false,
                3: false
            };
            $scope.refreshData();
        };

        /** *
         * 弹出编辑面板
         */
        $scope.openEditPanel = function (data, index) {
            $scope.subModal = true;
            $scope.subModalTitle = '编辑数据';
            data.geoLiveType = 'SCROADNAMEHWINFO';
            $scope.hwInfoData = data;

            objectCtrl.setCurrentObject('SCROADNAMEHWINFO', data);

            $ocLazyLoad.load(appPath.meta + 'rdName/hwInfo/hwInfoEditCtrl.js').then(function () {
                $scope.subModalTpl = appPath.meta + 'rdName/hwInfo/hwInfoEditTpl.html';
            });
            // 目的：每次打开面板都重新加载子面板
            $timeout(function () {
                $scope.$broadcast('SubModalReload');
            }, 100);
        };

        /** *
         * 关闭编辑面板
         */
        $scope.closeModal = function () {
            $scope.subModal = false;
        };

        // 获取表格的勾选数据
        $scope.getSelectedData = function () {
            var selectedList = [];
            for (var i = 0; i < $scope.hwInfoList.length; i++) {
                if ($scope.hwInfoList[i].checked) {
                    selectedList.push($scope.hwInfoList[i].hwPidUp);
                }
            }
            return selectedList;
        };

        // 高级查询
        $scope.advancedModal = false;
        $scope.advancedQuery = function () {
            $scope.advancedModal = !$scope.advancedModal;
        };
        // 删除方法
        $scope.delete = function () {
            if ($scope.getSelectedData().length == 0) {
                swal({
                    title: '请先选择要删除的数据',
                    type: 'info',
                    showCancelButton: false,
                    closeOnConfirm: true,
                    confirmButtonText: '确定'
                }, function (f) {
                    if (f) {
                        $scope.closeModal();
                        $scope.$apply();
                    }
                });
                return;
            }
            var param = {
                tableName: App.Temp.currentTableName,
                ids: $scope.getSelectedData()
            };
            $scope.$emit('freshload', { flag: true });
            dsMeta.rdNameDelete(param).then(function (data) {
                if (data) {
                    swal({
                        title: '删除成功',
                        type: 'info',
                        showCancelButton: false,
                        closeOnConfirm: true,
                        confirmButtonText: '确定'
                    }, function (f) {
                        if (f) {
                            $scope.refreshData();
                            $scope.closeModal();
                            $scope.$emit('freshload', { flag: false });
                        }
                    });
                }
            });
        };

        var paginationOptions = {
            pageNum: 1,
            pageSize: 20,
            sortby: null,
            sortDir: null
        };

        var formatRow = function () {
            var html = '<div ng-dblClick="grid.appScope.openEditPanel(row.entity)">' +
                '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ' +
                'class="ui-grid-cell grid-cell-diy" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
                '</div>';
            return html;
        };
        // 初始化方法
        var getData = function () {
            var param = {
                tableName: App.Temp.currentTableName,
                pageNum: paginationOptions.pageNum,
                pageSize: paginationOptions.pageSize,
                sortby: paginationOptions.sortby || '',
                data: {
                    hwPidUp: $scope.filter.hwPidUp,
                    hwPidDw: $scope.filter.hwPidDw,
                    memo: $scope.filter.memo,
                    uFields: $scope.filter.uFields,
                    uRecords: $scope.filter.uRecords,
                    nameGroupid: $scope.filter.nameGroupid
                }
            };
            $scope.loadingFlag = true;
            dsMeta.getRdNameList(param).then(function (data) {
                $scope.hwInfoList = data.result;
                $scope.gridOptions.totalItems = data.totalCount;
                $scope.gridOptions.data = data.result;
                $scope.loadingFlag = false;
            }, function () { $scope.loadingFlag = false; });
        };

        // 刷新表格方法;
        $scope.refreshData = function () {
            getData();
        };

        $scope.toggleVisible = function () {
            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        };

        var initTable = function () {
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
                columnDefs: $scope.cols,
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;

                    // 分页事件;
                    gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                        paginationOptions.pageNum = newPage;
                        paginationOptions.pageSize = pageSize;
                        getData();
                    });

                    // 排序事件
                    gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (sortColumns.length) {
                            var direct = sortColumns[0].sort.direction;
                            var sortName = sortColumns[0].field;
                            paginationOptions.sortby = direct == 'desc' ? '-' + sortName : '+' + sortName;
                            getData();
                        }
                    });
                }
            };
            // 初始化表格;
            getData();
        };
        // 初始化方法
        initTable();
    }
]);
