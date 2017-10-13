/**
 * Created by mali on 2017/4/8.
 * 检查结果表格
 */
angular.module('app').controller('checkResultTableCtrl', ['$scope', '$ocLazyLoad', 'NgTableParams', 'ngTableEventsChannel', 'uibButtonConfig', '$sce', 'dsEdit', '$document', 'appPath', '$interval', '$timeout', 'dsMeta', 'uiGridConstants',
    function ($scope, $ocLazyLoad, NgTableParams, ngTableEventsChannel, uibBtnCfg, $sce, dsEdit, $document, appPath, $interval, $timeout, dsMeta, uiGridConstants) {
        var _self = $scope;
        var objectCtrl = fastmap.uikit.ObjectEditController();
        var height = document.documentElement.clientHeight - 215;
        $scope.rightTableHeight = {
            height: height + 'px'
        };
        $scope.tableContentHeight = {
            height: height - 40 + 'px'
        };
        $scope.checkboxes = { checked: false };
        // 监控全选;
        $scope.$watch(function () {
            return $scope.checkboxes.checked;
        }, function (value) {
            angular.forEach($scope.checkResultData, function (item) {
                item.checked = value;
            });
        });
        $scope.roadType = {
            0: '未区分',
            1: '高速',
            2: '国道',
            3: '铁路',
            4: '出口编号'
        };
        $scope.checkRstType = {
            0: '无',
            1: 'Fatal',
            2: 'Critical',
            3: 'Error',
            4: 'warning'
        };
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
        $scope.operateOptions = [
            {
                id: 0,
                label: ' 未修改'
            },
            {
                id: 1,
                label: ' 例外'
            },
            {
                id: 2,
                label: ' 确认不修改'
            },
            {
                id: 3,
                label: ' 确认已修改'
            }
        ];
        function getRoadType() {
            return '<div>{{grid.appScope.roadType[row.entity.roadType]}}</div>';
        }

        function getCheckRstType() {
            return '<div>{{grid.appScope.checkRstType[row.entity.rank]}}</div>';
        }
        /**
         * 展示编辑界面
         * @param pid
         * @param type
         */
        $scope.showDetail = function (id) {
            dsMeta.queryRdNByNameID(id).then(function (data) {
                if (data) {
                    $scope.openEditPanel(data);
                } else {
                    swal('提示', '未查询到数据', 'error');
                }
            });
        };

        function getOrignData(scope, row) {
            var html = '<img class="flat-btn" src="../../images/meta/origData.png" style="padding-bottom: 10px;" ng-click="grid.appScope.showDetail(row.entity.nameId)">';
            return html;
        }

        var paginationOptions = {
            pageNum: 1,
            pageSize: 20,
            sortBy: null,
            sortDir: null
        };

        // 初始化方法
        var getData = function () {
            var param = {
                tableName: App.Temp.currentTableName,
                pageNum: paginationOptions.pageNum,
                pageSize: paginationOptions.pageSize,
                sortby: paginationOptions.sortBy || '',
                taskName: $scope.taskName,
                params: {
                    name: $scope.filter.name,
                    nameId: $scope.filter.nameId,
                    namePhonetic: $scope.filter.namePhonetic,
                    adminId: $scope.filter.adminId,
                    ruleCode: $scope.filter.ruleCode,
                    information: $scope.filter.information
                }
            };
            $scope.loadingFlag = true;
            dsMeta.getCheckResultList(param).then(function (data) {
                for (var i = 0; i < data.result.length; i++) {
                    data.result[i].status = 0;
                }
                $scope.checkResultData = data.result;
                $scope.gridOptions.totalItems = data.totalCount;
                $scope.gridOptions.data = data.result;
                $scope.loadingFlag = false;
            }, function () { $scope.loadingFlag = false; });
        };

        // 刷新表格方法;
        var refreshData = function () {
            getData();
        };
        function modifyCheckRstStatus() {
            var html = "<div class='ui-grid-cell-contents'><select ng-model='row.entity.status' ng-options='value.id as value.label for value in grid.appScope.operateOptions' ng-change='grid.appScope.changeType(row.entity.status,row.entity.id,grid.appScope.taskName)'></select></div>";
            return html;
        }
        /**
         * 修改检查项状态
         * @param selectInd
         * @param rowid
         */
        $scope.changeType = function (selectInd, rowid, taskName) {
            dsMeta.updateRdNCheckType(rowid, selectInd, taskName).then(function (data) {
                if (data) {
                    refreshData();
                }
            });
        };

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
            //     width: '20px',
            //     show: true
            // },
            {
                field: 'nameId',
                displayName: '查看元数据',
                minWidth: 40,
                visible: true,
                cellTemplate: getOrignData
            },
            {
                field: 'ruleid',
                displayName: '检查规则号',
                minWidth: 40,
                enableSorting: true,
                visible: true
            },
            {
                field: 'information',
                displayName: '检查信息',
                minWidth: 40,
                enableSorting: true,
                visible: true
            },
            {
                field: 'typePhonetic',
                displayName: '检查补充信息',
                minWidth: 60,
                enableSorting: true,
                visible: true
            },
            {
                field: 'rank',
                displayName: '检查结果状态',
                minWidth: 40,
                visible: true,
                cellTemplate: getCheckRstType
            },
            {
                field: 'operate',
                displayName: '操作',
                minWidth: 40,
                visible: true,
                cellTemplate: modifyCheckRstStatus
            },
            {
                field: 'nameId',
                displayName: '道路名ID',
                minWidth: 30,
                enableSorting: true,
                visible: true
            },
            {
                field: 'namePhonetic',
                displayName: '名称拼音',
                minWidth: 40,
                enableSorting: true,
                visible: true
            },
            {
                field: 'roadType',
                displayName: '类型名称',
                minWidth: 40,
                enableSorting: true,
                visible: true,
                cellTemplate: getRoadType
            },
            {
                field: 'name',
                displayName: '基本名称',
                minWidth: 40,
                enableSorting: true,
                visible: true
            },
            {
                field: 'adminName',
                displayName: '行政区划',
                minWidth: 40,
                enableSorting: true,
                visible: true
            }
        ];

        // 表格配置搜索;
        $scope.filter = {
            name: '',
            nameGroupid: '',
            adminId: '',
            flag: 1
        };
        $scope.filter = {
            name: '',
            nameId: '',
            adminId: '',
            namePhonetic: '',
            ruleCode: '',
            information: ''
        };
        // 表格过滤查询
        $scope.filterName = '';
        $scope.filterNameId = '';
        $scope.filterNamePhonetic = '';
        $scope.filterRuleCode = '';
        $scope.filterInformation = '';
        $scope.filterAdminId = '';
        $scope.query = function () {
            $scope.filter.name = $scope.filterName;
            $scope.filter.nameId = $scope.filterNameId;
            if ($scope.filterAdminId) {
                $scope.filter.adminId = $scope.filterAdminId;
            }
            $scope.filter.namePhonetic = $scope.filterNamePhonetic;
            $scope.filter.ruleCode = $scope.filterRuleCode;
            $scope.filter.information = $scope.filterInformation;
            refreshData();
        };

        // 重置方法
        $scope.reset = function () {
            $scope.filter.name = '';
            $scope.filter.nameId = '';
            $scope.filter.adminId = '';
            $scope.filter.namePhonetic = '';
            $scope.filter.ruleCode = '';
            $scope.filter.information = '';

            $scope.filterName = '';
            $scope.filterNameId = '';
            $scope.filterAdminId = '';
            $scope.filterNamePhonetic = '';
            $scope.filterRuleCode = '';
            $scope.filterInformation = '';
            refreshData();
        };

        // 打开统计窗口
        $scope.openTotal = function () {
            $scope.subModal = true;
            $scope.subModalTitle = '检查结果统计';
            $ocLazyLoad.load(appPath.meta + 'rdName/rdNameTable/checkResult/checkResultTotalCtrl.js').then(function () {
                $scope.subModalTpl = appPath.meta + 'rdName/rdNameTable/checkResult/checkResultTotalTpl.html';
            });
        };

        // 编辑检查错误数据
        $scope.openEditPanel = function (data) {
            $scope.roadNameFlag = 'edit';
            $scope.subModal = true;
            $scope.subModalTitle = '编辑数据';
            data.geoLiveType = 'ROADNAME';
            $scope.roadName = data;

            objectCtrl.setCurrentObject('ROADNAME', data);
            $ocLazyLoad.load(appPath.meta + 'rdName/rdNameTable/rdNameEditCtrl.js').then(function () {
                $scope.subModalTpl = appPath.meta + 'rdName/rdNameTable/rdNameEditTpl.html';
            });
            // 目的：每次打开面板都重新加载子面板
            $timeout(function () {
                $scope.$broadcast('SubModalReload');
            }, 100);
        };

        // 关闭统计窗口
        $scope.closeSubModal = function () {
            $scope.subModal = false;
        };

        // 查询检查结果中的规则号
        var getRulesByTaskName = function () {
            var param = {
                // taskName: $scope.jobName,
                taskName: $scope.taskName,
                tableName: App.Temp.currentTableName
            };
            dsMeta.getRuleIdsByTaskName(param).then(function (data) {
                $scope.ruleOpt = [];
                if (data) {
                    if (data.data.length > 0) {
                        for (var i = 0; i < data.data.length; i++) {
                            $scope.ruleOpt.unshift({
                                id: data.data[i].ruleId,
                                label: data.data[i].ruleId
                            });
                        }
                        $scope.ruleOpt.unshift({
                            id: 0,
                            label: '请选择'
                        });
                    }
                }
            });
        };
        // jobName 切换后刷新检查结果列表
        $scope.$on('refreshCheckRestList', function (event, data) {
            $scope.taskName = data.taskName;
            refreshData();
        });

        // var formatRow = function () {
        //     var html = '<div ng-dblClick="grid.appScope.openEditPanel(row.entity)">' +
        //         '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ' +
        //         'class="ui-grid-cell grid-cell-diy" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
        //         '</div>';
        //     return html;
        // };

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
                // rowTemplate: formatRow(),
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
                        if (sortColumns.length == 0) {
                            paginationOptions.sort = null;
                        } else {
                            paginationOptions.sort = sortColumns[0].sort.direction;
                        }
                        getData();
                    });
                }
            };
            // 初始化表格;
            getData();
        };
        // 初始化
        initTable();
        var initialize = function () {
            // initCheckResultListTable();

            getRulesByTaskName();
        };

        var unbindHandler = $scope.$on('CheckResultTableReload', initialize);
        $scope.$on('$destroy', function () {
            unbindHandler = null;
        });
    }
]);
