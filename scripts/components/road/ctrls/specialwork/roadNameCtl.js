/**
 * Created by mali on 2016-08-09
 */
angular.module('app').controller('RoadNameCtl', ['$scope', '$ocLazyLoad', '$timeout',
    'appPath', 'dsEdit', 'dsMeta', 'dsLazyload', 'uiGridConstants',
    function ($scope, $ocLazyLoad, $timeout, appPath, dsEdit, dsMeta, dsLazyload, uiGridConstants) {
        var objectCtrl = fastmap.uikit.ObjectEditController();
        $scope.hasCheckResult = false;
        $scope.checkboxes = {
            checked: false
        };
        var eventCtrl = fastmap.uikit.EventController();

        $scope.wHeight = document.documentElement.clientHeight;

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
        $scope.$on('check-running', function (event, data) {
            $scope.checkRunning = data.checkRunning;
        });
        $scope.closeCheckRunning = function () {
            $scope.checkRunning = false;
        };
        // 设置检查结果禁用初始值
        $scope.param = {
            name: '',
            nameGroupid: '',
            adminId: 0,
            flag: 1
        };
        $scope.admin = '';
        $scope.doSearch = function () {
            $scope.filterTableData();
        };

        // 刷新功能，增加变量控制搜索条件达到刷新效果
        $scope.doResetFlag = false;
        $scope.doReset = function () {
            $scope.doResetFlag = true;
            $scope.resetActive = true;
            $scope.filterTableData();
        };

        $scope.adminOpt = [{
            id: 0,
            label: '---请选择行政区划---'
        }, {
            id: 214,
            label: '全国'
        }, {
            id: 110000,
            label: '北京'
        }, {
            id: 120000,
            label: '天津'
        }, {
            id: 130000,
            label: '河北'
        }, {
            id: 140000,
            label: '山西'
        }, {
            id: 150000,
            label: '内蒙古'
        }, {
            id: 210000,
            label: '辽宁'
        }, {
            id: 220000,
            label: '吉林'
        }, {
            id: 230000,
            label: '黑龙江'
        }, {
            id: 310000,
            label: '上海'
        }, {
            id: 320000,
            label: '江苏'
        }, {
            id: 330000,
            label: '浙江'
        }, {
            id: 340000,
            label: '安徽'
        }, {
            id: 350000,
            label: '福建'
        }, {
            id: 360000,
            label: '江西'
        }, {
            id: 370000,
            label: '山东'
        }, {
            id: 410000,
            label: '河南'
        }, {
            id: 420000,
            label: '湖北'
        }, {
            id: 430000,
            label: '湖南'
        }, {
            id: 440000,
            label: '广东'
        }, {
            id: 450000,
            label: '广西'
        }, {
            id: 460000,
            label: '海南'
        }, {
            id: 500000,
            label: '重庆'
        }, {
            id: 510000,
            label: '四川'
        }, {
            id: 520000,
            label: '贵州'
        }, {
            id: 530000,
            label: '云南'
        }, {
            id: 540000,
            label: '西藏'
        }, {
            id: 610000,
            label: '陕西'
        }, {
            id: 620000,
            label: '甘肃'
        }, {
            id: 630000,
            label: '青海'
        }, {
            id: 640000,
            label: '宁夏'
        }, {
            id: 650000,
            label: '新疆'
        }, {
            id: 810000,
            label: '香港'
        }, {
            id: 820000,
            label: '澳门'
        }];

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

        function getCodeName() {
            return '<div>{{grid.appScope.codeTypeName[row.entity.codeType]}}</div>';
        }

        var paginationOptions = {
            pageNum: 1,
            pageSize: 25,
            sortBy: ''
        };

        var formatRow = function () {
            var html = '<div ng-dblClick="grid.appScope.openEditPanel(row)">' +
                '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ' +
                'class="ui-grid-cell grid-cell-diy" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
                '</div>';
            return html;
        };

        var getData = function (pageNum, pageSize) {
            var param = {
                subtaskId: App.Temp.subTaskId,
                pageNum: paginationOptions.pageNum,
                pageSize: paginationOptions.pageSize,
                sortby: paginationOptions.sortby || '',
                flag: $scope.filter.flag,
                params: {
                    name: $scope.filter.name,
                    nameGroupid: $scope.filter.nameGroupid,
                    adminId: $scope.filter.adminId
                }
            };
            dsMeta.roadNameList(param).then(function (data) {
                $scope.roadNameList = data.data;
                $scope.gridOptions.totalItems = data.total;
                $scope.gridOptions.data = data.data;
            });
        };

        $scope.toggleVisible = function () {
            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        };

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
                field: 'selector',
                displayName: '选择',
                width: 30,
                visible: true,
                headerCellTemplate: '<div class="fm-stretch fm-center"><input type="checkbox" ng-model="grid.appScope.checkboxes.checked" class="fm-control blue"/></div>',
                cellTemplate: '<div class="fm-stretch fm-center"><input type="checkbox" ng-model="row.entity.checked" class="fm-control blue"/></div>'
            }, {
                field: 'processFlag',
                displayName: '作业状态',
                minWidth: 98,
                enableSorting: true,
                visible: true
            }, {
                field: 'adminName',
                displayName: '行政区划',
                minWidth: 100,
                visible: true,
                enableSorting: false
            }, {
                field: 'nameGroupid',
                displayName: '组ID',
                enableSorting: true,
                minWidth: 100,
                visible: true,
                type: 'number'
            }, {
                field: 'name',
                displayName: '道路名',
                minWidth: 140,
                enableSorting: true,
                visible: true
            }, {
                field: 'namePhonetic',
                displayName: '道路名发音',
                minWidth: 160,
                enableSorting: true,
                visible: true
            }, {
                field: 'type',
                displayName: '类型名',
                minWidth: 100,
                enableSorting: true,
                visible: true
            }, {
                field: 'base',
                displayName: '基本名',
                minWidth: 100,
                enableSorting: true,
                visible: true
            }, {
                field: 'basePhonetic',
                displayName: '基本名发音',
                minWidth: 130,
                enableSorting: true,
                visible: true
            }, {
                field: 'prefix',
                displayName: '前缀名',
                minWidth: 100,
                enableSorting: true,
                visible: true
            }, {
                field: 'prefixPhonetic',
                displayName: '前缀名发音',
                minWidth: 100,
                enableSorting: true,
                visible: true
            }, {
                field: 'infix',
                displayName: '中缀名',
                minWidth: 100,
                enableSorting: true,
                visible: true
            }, {
                field: 'infixPhonetic',
                displayName: '中缀名发音',
                minWidth: 100,
                enableSorting: true,
                visible: true
            }, {
                field: 'suffix',
                displayName: '后缀名',
                minWidth: 100,
                enableSorting: true,
                visible: true
            }, {
                field: 'suffixPhonetic',
                displayName: '后缀名发音',
                minWidth: 100,
                enableSorting: true,
                visible: true
            }, {
                field: 'nameId',
                displayName: '道路名ID',
                minWidth: 60,
                enableSorting: true,
                visible: false,
                type: 'number'
            }, {
                field: 'langCode',
                displayName: '语言代码',
                minWidth: 60,
                enableSorting: true,
                visible: false
            }, {
                field: 'srcFlag',
                displayName: '名称来源',
                minWidth: 60,
                enableSorting: true,
                visible: false,
                type: 'number'
            }, {
                field: 'roadType',
                displayName: '道路类型',
                minWidth: 60,
                enableSorting: true,
                visible: false,
                type: 'number'
            }, {
                field: 'codeType',
                displayName: '国家编号',
                minWidth: 60,
                enableSorting: true,
                visible: false,
                cellTemplate: getCodeName,
                type: 'number'
            }, {
                field: 'voiceFile',
                displayName: '名称语音',
                minWidth: 60,
                enableSorting: true,
                visible: false
            }, {
                field: 'paRegionId',
                displayName: '点门牌区划代码',
                minWidth: 105,
                enableSorting: true,
                visible: false
            }, {
                field: 'splitFlag',
                displayName: '拆分标识',
                minWidth: 60,
                enableSorting: true,
                visible: false
            }, {
                field: 'routeId',
                displayName: '路线号码',
                minWidth: 60,
                enableSorting: true,
                visible: false
            }, {
                field: 'city',
                displayName: '地级市名称',
                minWidth: 75,
                enableSorting: true,
                visible: false
            }, {
                field: 'srcResume',
                displayName: '道路名来源履历',
                minWidth: 105,
                enableSorting: true,
                visible: false
            }],
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

        $scope.searchType = 'name';

        // 刷新表格方法;
        var refreshData = function () {
            getData();
        };

        // 表格配置搜索;
        $scope.filter = {
            name: '',
            nameGroupid: '',
            adminId: '',
            flag: 1
        };

        // 接收高级查询过滤条件
        $scope.$on('FITERPARAMSCHANGE', function (event, data) {
            $scope.filter.name = data.name;
            $scope.filter.nameGroupid = data.nameGroupid;
            // 重置
            if ($scope.doResetFlag) {
                data.adminId = 0;
                data.nameGroupid = '';
                data.name = '';
                data.flag = 1;
                $scope.filter.adminId = '';
                $scope.filter.nameGroupid = '';
                $scope.filter.name = '';
                $scope.filter.flag = 1;
                $scope.doResetFlag = false;
            } else { // 查询
                if (data.adminId == 0) {
                    $scope.filter.adminId = '';
                } else {
                    $scope.filter.adminId = data.adminId;
                    $scope.resetActive = false;
                }
            }
            $scope.filter.flag = data.flag;
            getData();
        });
        // 接收高级查询过滤条件
        $scope.filterTableData = function () {
            $scope.filter.name = $scope.param.name;
            $scope.filter.nameGroupid = $scope.param.nameGroupid;
            // 重置
            if ($scope.doResetFlag) {
                $scope.param.adminId = 0;
                $scope.param.nameGroupid = '';
                $scope.param.name = '';
                $scope.param.flag = 1;
                $scope.filter.adminId = '';
                $scope.filter.nameGroupid = '';
                $scope.filter.name = '';
                $scope.filter.flag = 1;
                $scope.doResetFlag = false;
            } else { // 查询
                if ($scope.param.adminId == 0) {
                    $scope.filter.adminId = '';
                } else {
                    $scope.filter.adminId = $scope.param.adminId;
                    $scope.resetActive = false;
                }
            }
            $scope.filter.flag = $scope.param.flag;
            getData();
        };

        function initRoadNameTable() {
            getData();
        }

        /** *
         * 弹出编辑面板
         */
        // 判断编辑还是详情
        $scope.flagOfEdit = true;
        $scope.editPanel = false;
        $scope.openEditPanel = function (row, flag) {
            var data;
            if (flag) {
                data = row;
            } else {
                data = row.entity;
            }
            $scope.flagOfEdit = true;
            $scope.roadNameFlag = 'edit';
            $scope.editPanel = true;
            data.geoLiveType = 'ROADNAME';
            $scope.roadName = data;

            objectCtrl.setCurrentObject('ROADNAME', data);
            $scope.advancedToolPanelTpl = appPath.root + appPath.tool + 'tpls/assist-tools/searchPanelTpl.html';
            $ocLazyLoad.load(appPath.root + 'scripts/components/road/ctrls/specialwork/roadNameEditPanelCtl.js').then(function () {
                $scope.roadNameEditPanelTpl = appPath.root + 'scripts/components/road/tpls/specialwork/roadNameEditPanelTpl.htm';
            });
        };

        $scope.$on('openEditPanel', function (event, data) {
            $scope.openEditPanel(data, 1);
        });
        /**
         * 道路名详情
         */
        $scope.DetailsModal = false;
        $scope.openDetailsPanel = function (data, index) {
            $scope.flagOfEdit = false;
            $scope.roadNameFlag = 'edit';
            $scope.DetailsModal = true;
            data.geoLiveType = 'ROADNAME';
            $scope.roadName = data;
            objectCtrl.setCurrentObject('ROADNAME', data);
            $scope.advancedToolPanelTpl = appPath.root + appPath.tool + 'tpls/assist-tools/searchPanelTpl.html';
            $ocLazyLoad.load(appPath.root + 'scripts/components/road/ctrls/specialwork/roadNameEditPanelCtl.js').then(function () {
                $scope.roadNameEditPanelTpl = appPath.root + 'scripts/components/road/tpls/specialwork/detailsOfRoadTpl.htm';
            });
        };
        $scope.$on('openDetailsPanel', function (event, data) {
            $scope.openDetailsPanel(data);
        });
        $scope.detailsOprate = function () {
            if ($scope.getSelectedData().length == 0) {
                swal({
                    title: '请先选择要查看的数据',
                    type: 'info',
                    showCancelButton: false,
                    closeOnConfirm: true,
                    confirmButtonText: '确定'
                });
                return;
            } else if ($scope.getSelectedData().length > 1) {
                swal({
                    title: '请选择一项进行查看操作',
                    type: 'info',
                    showCancelButton: false,
                    closeOnConfirm: true,
                    confirmButtonText: '确定'
                });
                return;
            }

            var data = $scope.getSelectedDataOfDetails();
            $scope.openDetailsPanel(data);
        };

        $scope.getSelectedDataOfDetails = function () {
            var selectedRoadNameList = {};
            for (var i = 0; i < $scope.roadNameList.length; i++) {
                if ($scope.roadNameList[i].checked) {
                    selectedRoadNameList = $scope.roadNameList[i];
                }
            }
            return selectedRoadNameList;
        };
        // 退出,恢复到登录状态
        $scope.closeDialog = function () {
            for (var i = 0, l = document.querySelectorAll('.ngdialog-theme-default').length; i < l; i++) {
                document.querySelectorAll('.ngdialog-theme-default')[i].style.display = 'none';
            }
        };
        /** *
         * 关闭编辑面板
         */
        $scope.closeEditPanel = function () {
            $scope.editPanel = false;
        };
        $scope.closeDetailsPanel = function () {
            $scope.DetailsModal = false;
        };
        $scope.$on('CLOSEDETAILSPANEL', function (event, data) {
            $scope.closeDetailsPanel();
        });
        $scope.$on('CLOSEEDITPANEL', function (event, data) {
            $scope.closeSubModal();
            $scope.closeEditPanel();
            $scope.closeDetailsPanel();
        });
        // 控制按钮状态
        $scope.addActive = false;
        $scope.resetActive = false;
        /** *
         * 对应弹出查询、新增、拆分、检查面板
         */
        $scope.subModal = false;
        $scope.openSubModal = function (type) {
            $scope.subModal = true;
            if (type == 'add') {
                $scope.addActive = true;
                $scope.roadNameFlag = 'add';
                $ocLazyLoad.load(appPath.root + 'scripts/components/road/ctrls/specialwork/roadNameEditPanelCtl.js').then(function () {
                    $scope.subModalTpl = appPath.root + 'scripts/components/road/tpls/specialwork/roadNameEditPanelTpl.htm';
                });
                eventCtrl.fire(eventCtrl.eventTypes.SELECTEDFEATURECHANGE);
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
            $scope.addActive = false;
        };
        $scope.$on('CLOSECURRENTPANEL', function (event, data) {
            $scope.subModal = false;
            $scope.addActive = false;
        });
        /** *
         * 编辑界面保存后，列表界面刷新，并关闭编辑界面
         */
        $scope.$on('REFRESHROADNAMELIST', function (event, data) {
            refreshData();
        });
        $scope.getSelectedData = function () {
            var selectedRoadNameList = [];
            if ($scope.roadNameList) {
                for (var i = 0; i < $scope.roadNameList.length; i++) {
                    if ($scope.roadNameList[i].checked) {
                        selectedRoadNameList.push({
                            nameId: $scope.roadNameList[i].nameId,
                            nameGroupid: $scope.roadNameList[i].nameGroupid,
                            langCode: $scope.roadNameList[i].langCode,
                            roadType: $scope.roadNameList[i].roadType
                        });
                    }
                }
            }
            return selectedRoadNameList;
        };

        var hasCheckResult = function () {
            dsEdit.getRoadNameCheckResult(1).then(function (data) {
                if (data == -1) {
                    return;
                }
                if (data && data.totalCount > 0) {
                    $scope.hasCheckResult = true;
                } else {
                    $scope.hasCheckResult = false;
                }
            });
        };

        // 页面的中心点像素坐标，用于固定宽/高页面元素的设置
        $scope.PageViewPoint = {
            x: document.documentElement.clientWidth / 2,
            y: document.documentElement.clientHeight / 2
        };
        // 检查和检查结果弹窗管理
        $scope.dialogManager = {};
        var defaultDialogOptions = {
            position: {
                x: $scope.PageViewPoint.x - 400,
                y: $scope.PageViewPoint.y - 200
            },
            size: {
                width: 800,
                height: 400
            },
            container: 'roadNameEditor',
            viewport: 'roadNameEditor',
            minimizable: true,
            closable: true,
            modal: false
        };
        /**
         * 根据界面类型创建弹窗
         * @param data
         * @returns {{}}
         */
        var createDialog = function (data) {
            var item = {};
            var tmplFile = FM.uikit.Config.getUtilityTemplate(data.type);
            item.title = FM.uikit.Config.getUtilityName(data.type);
            item.ctrl = appPath.scripts + tmplFile.ctrl;
            item.tmpl = appPath.scripts + tmplFile.tmpl;
            item.options = FM.Util.clone(defaultDialogOptions);
            return item;
        };
        /**
         * 打开窗口
         * @param dlg
         * @param dlgKey
         */
        $scope.openDialog = function (dlg, dlgKey) {
            $scope.dialogManager[dlgKey].handler = dlg;
        };
        /**
         * 关闭窗口
         * @param dlgKey
         */
        $scope.closeDialog = function (dlgKey) {
            delete $scope.dialogManager[dlgKey];
        };
        /**
         * 根据界面类型显示窗口
         * @param type
         */
        $scope.showInDialog = function (type) {
            var dlgKey = type;
            if ($scope.dialogManager[dlgKey]) {
                $scope.$broadcast('ReloadData-' + dlgKey, { type: type });
                $scope.dialogManager[dlgKey].handler.selectWindow();
            } else {
                var item = createDialog({ type: type });
                $ocLazyLoad.load([item.ctrl, item.tmpl]).then(function () {
                    $scope.dialogManager[dlgKey] = item;
                    dsLazyload.testHtmlLoad($scope, item.tmpl).then(function () {
                        $scope.$broadcast('ReloadData-' + dlgKey, { type: type });
                    });
                });
            }
        };

        $scope.showCheckRunningInfo = function () {
            swal({
                title: '道路名检查正在执行...',
                type: 'info',
                showCancelButton: false,
                closeOnConfirm: true,
                confirmButtonText: '确定'
            });
            return;
        };

        var initPage = function () {
            /* 初始化方法*/
            initRoadNameTable();
            hasCheckResult();
        };

        initPage();
    }
]);
