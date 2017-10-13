/**
 * Created by mali on 2017/3/28.
 * 道路名表主界面ctrl
 */
angular.module('app').controller('RoadNameMainCtl', ['$scope', '$ocLazyLoad', 'NgTableParams', 'ngTableEventsChannel', 'uibButtonConfig', '$sce', 'dsEdit', '$document', 'appPath', '$interval', '$timeout', 'dsMeta', 'ngDialog', 'uiGridConstants',
    function ($scope, $ocLazyLoad, NgTableParams, ngTableEventsChannel, uibBtnCfg, $sce, dsEdit, $document, appPath, $interval, $timeout, dsMeta, ngDialog, uiGridConstants) {
        var objectCtrl = fastmap.uikit.ObjectEditController();
        var _self = $scope;
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
            angular.forEach($scope.roadNameList, function (item) {
                item.checked = value;
            });
        });
        /* 控制检查按钮是否可用*/
        $scope.checkRunning = false;
        $scope.$on('check-run', function (event, data) {
            $scope.checkRunning = data.checkRunning;
        });
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
        $scope.codeTypeName = {
            0: '非国家编号',
            1: '国家高速编号',
            2: '国道编号',
            3: '省道编号',
            4: '县道编号',
            5: '乡道编号',
            6: '专用道编号',
            7: '省级高速编号'
        };
        $scope.roadType = {
            0: '未区分',
            1: '高速',
            2: '国道',
            3: '铁路',
            4: '出口编号'
        };
        $scope.processFlag = {
            0: '无',
            1: '外业采集',
            2: '未验证'
        };
        $scope.srcFlag = {
            0: '未定义',
            1: '按规则翻译(程序赋值)',
            2: '来自出典(手工录入)',
            3: '现场标牌'
        };
        $scope.splitFlag = {
            0: '无（默认值）',
            1: '人工拆分',
            2: '程序拆分'
        };

        $scope.checkDisable = false;
        $scope.$on('REFRESHCHECKBTN', function (event, data) {
            $scope.checkDisable = data;
        });
        function getCodeName() {
            return '<div>{{grid.appScope.codeTypeName[row.entity.codeType]}}</div>';
        }

        function getRoadType() {
            return '<div>{{grid.appScope.roadType[row.entity.roadType]}}</div>';
        }

        function getProcessFlagName() {
            return '<div>{{grid.appScope.processFlag[row.entity.processFlag]}}</div>';
        }

        function getSrcFlagName() {
            return '<div>{{grid.appScope.srcFlag[row.entity.srcFlag]}}</div>';
        }

        function getSplitFlagName() {
            return '<div>{{grid.appScope.splitFlag[row.entity.splitFlag]}}</div>';
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
            //     width: '20px',
            //     show: true
            // },
            {
                field: 'nameGroupid',
                displayName: '组ID',
                enableSorting: true,
                minWidth: 50,
                visible: true,
                type: 'number'
            },
            {
                field: 'name',
                displayName: '道路名称',
                minWidth: 50,
                enableSorting: true,
                visible: true
            },
            {
                field: 'type',
                displayName: '类型名称',
                minWidth: 40,
                enableSorting: true,
                visible: true
            },
            {
                field: 'typePhonetic',
                displayName: '类型名发音',
                minWidth: 60,
                enableSorting: true,
                visible: false
            },
            {
                field: 'base',
                displayName: '基本名称',
                minWidth: 50,
                enableSorting: true,
                visible: true
            },
            {
                field: 'prefix',
                displayName: '前缀名',
                minWidth: 40,
                enableSorting: true,
                visible: true
            },
            {
                field: 'infix',
                displayName: '中缀名',
                minWidth: 40,
                enableSorting: true,
                visible: true
            },
            {
                field: 'suffix',
                displayName: '后缀名',
                minWidth: 40,
                enableSorting: true,
                visible: true
            },
            {
                field: 'namePhonetic',
                displayName: '道路名发音',
                minWidth: 40,
                enableSorting: true,
                visible: true
            },
            {
                field: 'basePhonetic',
                displayName: '基本名发音',
                minWidth: 50,
                enableSorting: true,
                visible: true
            },
            {
                field: 'prefixPhonetic',
                displayName: '前缀发音',
                minWidth: 60,
                enableSorting: true,
                visible: true
            },
            {
                field: 'infixPhonetic',
                displayName: '中缀发音',
                minWidth: 60,
                enableSorting: true,
                visible: true
            },
            {
                field: 'suffixPhonetic',
                displayName: '后缀发音',
                minWidth: 60,
                enableSorting: true,
                visible: true
            },
            {
                field: 'nameId',
                displayName: '名称号码',
                minWidth: 60,
                enableSorting: true,
                visible: false,
                type: 'number'
            },
            {
                field: 'langCode',
                displayName: '语言代码',
                minWidth: 60,
                enableSorting: true,
                visible: false
            },
            {
                field: 'srcFlag',
                displayName: '名称来源',
                minWidth: 60,
                enableSorting: true,
                visible: false,
                cellTemplate: getSrcFlagName,
                type: 'number'
            },
            {
                field: 'roadType',
                displayName: '道路类型',
                minWidth: 60,
                enableSorting: true,
                visible: false,
                cellTemplate: getRoadType,
                type: 'number'
            },
            {
                field: 'adminName',
                displayName: '行政区划',
                minWidth: 60,
                enableSorting: false,
                visible: false
            },
            {
                field: 'codeType',
                displayName: '国家编号',
                minWidth: 60,
                enableSorting: true,
                visible: false,
                cellTemplate: getCodeName,
                type: 'number'
            },
            {
                field: 'voiceFile',
                displayName: '名称语音',
                minWidth: 60,
                enableSorting: true,
                visible: false
            },
            {
                field: 'paRegionId',
                displayName: '点门牌区划代码',
                minWidth: 100,
                enableSorting: true,
                visible: false
            },
            {
                field: 'processFlag',
                displayName: '作业状态',
                minWidth: 60,
                enableSorting: true,
                visible: false,
                cellTemplate: getProcessFlagName
            },
            {
                field: 'splitFlag',
                displayName: '拆分标识',
                minWidth: 60,
                enableSorting: true,
                visible: false,
                cellTemplate: getSplitFlagName
            },
            {
                field: 'routeId',
                displayName: '路线号码',
                minWidth: 40,
                enableSorting: true,
                visible: false
            },
            {
                field: 'city',
                displayName: '地级市名称',
                minWidth: 40,
                enableSorting: true,
                visible: false
            },
            {
                field: 'srcResume',
                displayName: '道路名来源履历',
                minWidth: 60,
                enableSorting: true,
                visible: false
            },
            {
                field: 'memo',
                displayName: '备注',
                minWidth: 60,
                enableSorting: true,
                visible: false
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
            name: '',
            nameGroupid: '',
            adminId: '',
            roadTypes: []
        };

        // 高级查询中道路类型默认值处理
        $scope.roadTypeVal = {
            0: false,
            1: false,
            2: false,
            3: false,
            4: false
        };
        
        // 行政区划切换时，触发查询条件修改
        $scope.modifyFilter = function (event, obj) {
            if (!obj.filterAdminId) {
                $scope.filter.adminId = '';
            } else {
                $scope.filter.adminId = obj.filterAdminId;
            }
        };
        // 表格过滤查询
        $scope.filterName = '';
        $scope.filterNameGroupid = '';
        $scope.filterAdminId = 0;
        $scope.query = function () {
            $scope.filter.roadTypes = [];

            $scope.filter.name = $scope.filterName;
            $scope.filter.nameGroupid = $scope.filterNameGroupid;
            if ($scope.filterAdminId) {
                $scope.filter.adminId = $scope.filterAdminId;
            }
            for (var p in $scope.roadTypeVal) {
                if ($scope.roadTypeVal[p]) {
                    $scope.filter.roadTypes.push(parseInt(p, 10));
                }
            }
            $scope.refreshData();
        };

        // 重置方法
        $scope.reset = function () {
            // 对象初始化错误，重新指向了新的内存！！！！
            // $scope.filter = {
            //     name: '',
            //     nameGroupid: '',
            //     adminId: '',
            //     roadTypes: []
            // };
            $scope.filter.name = '';
            $scope.filter.nameGroupid = '';
            $scope.filter.adminId = '';
            $scope.filter.roadTypes = [];
            $scope.filterName = '';
            $scope.filterNameGroupid = '';
            $scope.filterAdminId = '';
            $scope.roadTypeVal = {
                0: false,
                1: false,
                2: false,
                3: false,
                4: false
            };
            $scope.refreshData();
        };

        /** *
         * 弹出编辑面板
         */
        $scope.openEditPanel = function (data, index) {
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

        $scope.$on('openEditPanel', function (event, data) {
            $scope.openEditPanel(data);
        });

        // 弹窗modal title
        $scope.subModalTitle = '新增记录';
        /** *
         * 对应弹出查询、新增、拆分、检查面板
         */
        $scope.subModal = false;
        $scope.openSubModal = function (type) {
            $scope.subModal = true;
            if (type == 'add') {
                $scope.roadNameFlag = 'add';
                $scope.subModalTitle = '新增记录';
                $ocLazyLoad.load(appPath.meta + 'rdName/rdNameTable/rdNameEditCtrl.js').then(function () {
                    $scope.subModalTpl = appPath.meta + 'rdName/rdNameTable/rdNameEditTpl.html';
                });
            } else if (type == 'split') {
                $scope.subModalTitle = '道路名拆分';
                $ocLazyLoad.load(appPath.meta + 'rdName/rdNameTable/rdNameSplitCtrl.js').then(function () {
                    $scope.subModalTpl = appPath.meta + 'rdName/rdNameTable/rdNameSplitTpl.html';
                });
            } else if (type == 'check') {
                $scope.subModalTitle = '执行检查';
                $ocLazyLoad.load(appPath.meta + 'rdName/rdNameTable/rdNameCheckCtrl.js').then(function () {
                    $scope.subModalTpl = appPath.meta + 'rdName/rdNameTable/rdNameCheckTpl.html';
                });
            } else if (type == 'checkResult') {
                $scope.subModalTitle = '检查结果';
                // $ocLazyLoad.load(appPath.meta + 'rdName/rdNameTable/checkResult/checkResultCtrl.js').then(function () {
                //     $scope.subModalTpl = appPath.meta + 'rdName/rdNameTable/checkResult/checkResultTpl.html';
                // });
                $ocLazyLoad.load(appPath.meta + 'rdName/rdNameTable/checkResult/checkResultDetailCtrl.js');
                window.location.href = '#/checkResultDetail?access_token=' + App.Temp.accessToken;
            }
            // 目的：每次打开面板都重新加载子面板
            $timeout(function () {
                $scope.$broadcast('SubModalReload');
            }, 100);
        };
        /** *
         * 关闭子面板
         */
        $scope.closeSubModal = function () {
            $scope.subModal = false;
        };
        $scope.$on('CLOSECURRENTPANEL', function (event, data) {
            $scope.subModal = false;
        });
        /** *
         * 编辑界面保存后，列表界面刷新，并关闭编辑界面
         */
        $scope.$on('REFRESHROADNAMELIST', function (event, data) {
            $scope.refreshData();
        });

        // 获取表格的勾选数据
        $scope.getSelectedData = function () {
            var selectedRoadNameList = [];
            for (var i = 0; i < $scope.roadNameList.length; i++) {
                if ($scope.roadNameList[i].checked) {
                    selectedRoadNameList.push({
                        nameId: $scope.roadNameList[i].nameId,
                        nameGroupid: $scope.roadNameList[i].nameGroupid,
                        langCode: $scope.roadNameList[i].langCode,
                        roadType: $scope.roadNameList[i].roadType,
                        splitFlag: $scope.roadNameList[i].splitFlag
                    });
                }
            }
            return selectedRoadNameList;
        };

        // 高级查询
        $scope.advancedModal = false;
        $scope.advancedQuery = function () {
            $scope.advancedModal = !$scope.advancedModal;
        };
        var paginationOptions = {
            pageNum: 1,
            pageSize: 20,
            sortby: '',
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
                flag: 0,
                params: {
                    name: $scope.filter.name,
                    nameGroupid: $scope.filter.nameGroupid,
                    adminId: $scope.filter.adminId,
                    roadTypes: $scope.filter.roadTypes
                }
            };
            $scope.loadingFlag = true;
            dsMeta.roadNameList(param).then(function (data) {
                $scope.roadNameList = data.data;
                $scope.gridOptions.totalItems = data.total;
                $scope.gridOptions.data = data.data;
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
                            if (sortName != 'adminName') {
                                paginationOptions.sortby = direct == 'desc' ? '-' + sortName : '+' + sortName;
                                getData();
                            }
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
