/**
 * Created by mali on 2017/4/19.
 * 模式图匹配表
 */
angular.module('app').controller('modelMatchMainCtrl', ['$scope', '$ocLazyLoad', 'uibButtonConfig', '$sce', 'dsEdit', '$document', 'appPath', '$interval', '$timeout', 'dsMeta', 'ngDialog', 'uiGridConstants',
    function ($scope, $ocLazyLoad, uibBtnCfg, $sce, dsEdit, $document, appPath, $interval, $timeout, dsMeta, ngDialog, uiGridConstants) {
        var objectCtrl = fastmap.uikit.ObjectEditController();
        var _self = $scope;
        var height = document.documentElement.clientHeight - 225;
        $scope.rightTableHeight = {
            height: height + 'px'
        };
        $scope.tableContentHeight = {
            height: height - 40 + 'px'
        };
        $scope.checkboxes = { checked: false };
        var eventCtrl = fastmap.uikit.EventController();
        // 监控全选;
        $scope.$watch(function () {
            return $scope.checkboxes.checked;
        }, function (value) {
            angular.forEach($scope.modelMatchGList, function (item) {
                item.checked = value;
            });
        });
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
        $ocLazyLoad.load(appPath.meta + 'graphMetaData/showImageCtrl.js');

        $scope.showImg = function (row) {
            $scope.url = App.Config.serviceUrl + '/metadata/metadataEdit/patternImage/getImage/?parameter={"tableName":"' + App.Temp.currentTableName + '",id:' + row.fileId + '}';
            var imgUrl = {
                url: $scope.url
            };
            ngDialog.open({
                template: appPath.meta + 'graphMetaData/showImageTpl.html',
                controller: 'showImageCtrl',
                className: 'ngdialog-theme-default ngdialog-theme-plain dialog-edit image-left',
                width: '100%',
                height: '100%',
                closeByDocument: false,
                overlay: false,
                data: imgUrl,
                preCloseCallback: function () {
                }
            });
        };

        function getImg() {
            return '<div><a class="cursor-point" style="color: #636ef5" ng-click="grid.appScope.showImg(row.entity)">图片查看</a></div>';
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
                field: 'fileId',
                displayName: '图形文件',
                minWidth: 50,
                visible: true,
                cellTemplate: getImg,
                type: 'number'
            },
            {
                field: 'fileId',
                displayName: '文件ID',
                minWidth: 50,
                enableSorting: true,
                visible: true
            },
            {
                field: 'productLine',
                displayName: '产品线',
                minWidth: 40,
                enableSorting: true,
                visible: true
            },
            {
                field: 'version',
                displayName: '文件版本',
                minWidth: 50,
                enableSorting: true,
                visible: true
            },
            {
                field: 'projectNm',
                displayName: '项目名称',
                minWidth: 50,
                enableSorting: true,
                visible: true
            },
            {
                field: 'specification',
                displayName: '规格',
                minWidth: 40,
                enableSorting: true,
                visible: false
            },
            {
                field: 'bType',
                displayName: '大文件类型',
                minWidth: 40,
                enableSorting: true,
                visible: true
            },
            {
                field: 'mType',
                displayName: '中文件类型',
                minWidth: 40,
                enableSorting: true,
                visible: true
            },
            {
                field: 'sType',
                displayName: '小文件类型',
                minWidth: 40,
                enableSorting: true,
                visible: true
            },
            {
                field: 'urlFile',
                displayName: '相对路径',
                minWidth: 40,
                visible: true
            },
            {
                field: 'fileName',
                displayName: '文件名称',
                minWidth: 40,
                enableSorting: true,
                visible: true
            },
            {
                field: 'size',
                displayName: '文件尺寸',
                minWidth: 40,
                enableSorting: true,
                visible: true
            },
            {
                field: 'format',
                displayName: '文件后缀',
                minWidth: 40,
                enableSorting: true,
                visible: true
            },
            {
                field: 'impWorker',
                displayName: '导入人员',
                minWidth: 40,
                enableSorting: true,
                visible: false
            },
            {
                field: 'impDate',
                displayName: '导入日期',
                minWidth: 40,
                enableSorting: true,
                visible: false
            },
            {
                field: 'urlDb',
                displayName: '路径名称',
                minWidth: 40,
                enableSorting: true,
                visible: false
            },
            {
                field: 'memo',
                displayName: '备注',
                minWidth: 40,
                enableSorting: true,
                visible: false
            }
        ];

        // 表格配置过滤条件
        $scope.filter = {
            projectNm: '',
            bType: '',
            mType: '',
            fileName: ''
        };

        // 表格过滤查询
        $scope.filterProjectNm = '';
        $scope.filterBType = '';
        $scope.filterMType = '';
        $scope.filterFileName = '';
        $scope.query = function () {
            $scope.filter.projectNm = $scope.filterProjectNm;
            $scope.filter.bType = $scope.filterBType;
            $scope.filter.mType = $scope.filterMType;
            $scope.filter.fileName = $scope.filterFileName;
            $scope.refreshData();
        };

        // 重置方法
        $scope.reset = function () {
            $scope.filter.projectNm = '';
            $scope.filter.bType = '';
            $scope.filter.mType = '';
            $scope.filter.fileName = '';
            $scope.filterProjectNm = '';
            $scope.filterBType = '';
            $scope.filterMType = '';
            $scope.filterFileName = '';
            $scope.refreshData();
        };

        /** *
         * 弹出编辑面板
         */
        $scope.openEditPanel = function (data, index) {
            $scope.modelMatchGFlag = 'edit';
            $scope.subModal = true;
            $scope.subModalTitle = '编辑数据';
            data.geoLiveType = 'SCMODELMATCHG';
            $scope.modelMatchGData = data;

            objectCtrl.setCurrentObject('SCMODELMATCHG', data);
            $ocLazyLoad.load(appPath.meta + 'graphMetaData/modelMatch/modelMatchEditCtrl.js').then(function () {
                $scope.subModalTpl = appPath.meta + 'graphMetaData/modelMatch/modelMatchEditTpl.html';
            });
            // 目的：每次打开面板都重新加载子面板
            $timeout(function () {
                $scope.$broadcast('SubModalReload');
            }, 100);
        };

        // 弹窗modal title
        $scope.subModalTitle = '新增记录';
        /** *
         * 弹出新增、拆分、检查面板
         */
        $scope.subModal = false;
        $scope.openSubModal = function (type) {
            $scope.subModal = true;
            if (type == 'add') {
                $scope.modelMatchGFlag = 'add';
                $scope.subModalTitle = '新增记录';
                $ocLazyLoad.load(appPath.meta + 'graphMetaData/modelMatch/modelMatchEditCtrl.js').then(function () {
                    $scope.subModalTpl = appPath.meta + 'graphMetaData/modelMatch/modelMatchEditTpl.html';
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
        };

        // 获取表格的勾选数据
        $scope.getSelectedData = function () {
            var selectedList = [];
            for (var i = 0; i < $scope.modelMatchGList.length; i++) {
                if ($scope.modelMatchGList[i].checked) {
                    selectedList.push($scope.modelMatchGList[i].fileId);
                }
            }
            return selectedList;
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
                        $scope.closeSubModal();
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
            dsMeta.graphMetaDataDelete(param).then(function (data) {
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
                            $scope.closeSubModal();
                            $scope.$emit('freshload', { flag: false });
                        }
                    });
                }
            });
        };
        // 高级查询
        $scope.advancedModal = false;
        $scope.advancedQuery = function () {
            $scope.advancedModal = !$scope.advancedModal;
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
        var getData = function () {
            var param = {
                tableName: App.Temp.currentTableName,
                pageNum: paginationOptions.pageNum,
                pageSize: paginationOptions.pageSize,
                sortby: paginationOptions.sortby || '',
                data: {
                    projectNm: $scope.filter.projectNm,
                    bType: $scope.filter.bType,
                    mType: $scope.filter.mType,
                    fileName: $scope.filter.fileName
                }
            };
            $scope.loadingFlag = true;
            dsMeta.getGraphMetaDataList(param).then(function (data) {
                $scope.modelMatchGList = data.result;
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
