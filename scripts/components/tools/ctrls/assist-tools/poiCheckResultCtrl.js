angular.module('app').controller('poiCheckResultCtrl', ['$window', '$scope', '$timeout', 'NgTableParams', 'dsEdit', 'appPath',
    function ($window, $scope, $timeout, NgTableParams, dsEdit, appPath) {
        var objectEditCtrl = new fastmap.uikit.ObjectEditController();
        $scope.isShowRelateTable = false;
        $scope.loadingFlag = false;
        $scope.searchModel = {
            pageNum: 1,
            pageSize: 15,
            sortby: ''
        };
        // 获得所有关联poi详情;
        var getAllRelatePoi = function (pidArray, callback) {
            var tempArray = [];
            for (var i = 0; i < pidArray.length; i++) {
                (function (num) {
                    dsEdit.getByPid(pidArray[num], 'IXPOI').then(function (res) {
                        res.pageIndex = num + 1;
                        tempArray.push(res);
                        if (num === pidArray.length - 1) {
                            if (callback) {
                                callback(tempArray);
                            }
                        }
                    });
                }(i));
            }
        };
        $scope.goBack = function () {
            $scope.isShowRelateTable = false;
        };
        // 定位并高亮显示要素
        $scope.showOnMap = function (row) {
            var rowdata = row.entity;
            var checkStatus = row.isSelected;
            if (!checkStatus) return;
            if (rowdata.geometry) {
                var coord = rowdata.geometry.replace(/\(|\)/g, '').split(',');
                var zoom = map.getZoom() < 17 ? 17 : map.getZoom();
                // 处理检查返回的坐标为 (0.0, 0.0) 的情况，为0时会导致图幅图层的结算出错
                if (parseFloat(coord[1]) > 10 && parseFloat(coord[0]) > 10) {
                    map.setView([parseFloat(coord[1]), parseFloat(coord[0])], zoom);
                }
            }
            var target = rowdata.targets[0];
            $scope.$emit('ObjectSelected', {
                feature: {
                    pid: target.pid,
                    geoLiveType: target.featType
                }
            });
        };
        // 关联poi定位;
        $scope.showRelateOnMap = function (row) {
            var rowdata = row.entity;
            var checkStatus = row.isSelected;
            if (!checkStatus) return;
            if (rowdata.geometry) {
                var coord = rowdata.geometry.coordinates;
                var zoom = map.getZoom() < 17 ? 17 : map.getZoom();
                // 处理检查返回的坐标为 (0.0, 0.0) 的情况，为0时会导致图幅图层的结算出错
                if (parseFloat(coord[1]) > 10 && parseFloat(coord[0]) > 10) {
                    map.setView([parseFloat(coord[1]), parseFloat(coord[0])], zoom);
                }
            }
            $scope.$emit('ObjectSelected', {
                feature: {
                    pid: rowdata.pid,
                    geoLiveType: rowdata.geoLiveType
                }
            });
        };
        // 格式化关联poi表格行;
        function formatRelateRow() {
            var html = '<div ng-click="grid.appScope.showRelateOnMap(row)">' +
                '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ' +
                'class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
                '</div>';
            return html;
        }
        // 格式化关联poi状态;
        function formatRelateStatus() {
            var html = '<div ng-if="row.entity.status===3" class="ui-grid-cell-contents">新增</div>' +
                '<div ng-if="row.entity.status===2" class="ui-grid-cell-contents">修改</div>' +
                '<div ng-if="row.entity.status===1" class="ui-grid-cell-contents">删除</div>' +
                '<div ng-if="row.entity.status===0" class="ui-grid-cell-contents">无</div>';
            return html;
        }
        $scope.getRelatePoiName = function (names) {
            var name = '无';
            names.forEach(function (item) {
                if (item.nameClass == 1 && item.nameType == 2 && item.langCode == 'CHI') {
                    name = item.name;
                    return;
                }
            });
            return name;
        };
        // 格式化关联poi名称;
        function formatRelateName() {
            var html = '<div class="ui-grid-cell-contents">{{grid.appScope.getRelatePoiName(row.entity.names)}}</div>';
            return html;
        }
        // 格式化关联poi地址;
        function formatRelateAddress() {
            var html = '<div ng-if="row.entity.oldAddress" class="ui-grid-cell-contents">{{row.entity.oldAddress}}</div>' +
                '<div ng-if="!row.entity.oldAddress" class="ui-grid-cell-contents">无</div>';
            return html;
        }
        // 查看关联poi;
        $scope.showRelatePoi = function (e, data) {
            e.stopPropagation();
            var pidArray = data.refFeatures.map(function (item) {
                return item.pid;
            });
            getAllRelatePoi(pidArray, function (res) {
                // 初始化关联poi表格;
                $scope.relateTableOptions = {
                    enableColumnMenus: false,
                    enableFullRowSelection: true,
                    enableRowHeaderSelection: false,
                    multiSelect: false,
                    data: res,
                    modifierKeysToMultiSelect: false,
                    noUnselect: false,
                    rowTemplate: formatRelateRow(),
                    onRegisterApi: function (gridApi) {
                        $scope.grid2Api = gridApi;
                    },
                    columnDefs: [
                        { field: 'pid', displayName: '序号', enableSorting: false, minWidth: 50 },
                        { field: 'status', displayName: '状态', enableSorting: false, minWidth: 70, cellTemplate: formatRelateStatus() },
                        { field: 'oldName', displayName: '名称', enableSorting: false, minWidth: 150, cellTemplate: formatRelateName() },
                        { field: 'oldAddress', displayName: '地址', enableSorting: false, minWidth: 230, cellTemplate: formatRelateAddress() },
                        { field: 'kindCode', displayName: '分类', enableSorting: false, minWidth: 100 }
                    ]
                };
                // 放到上面无法初始化表格;
                $scope.isShowRelateTable = true;
            });
        };
        // 格式关联POI
        function formatRelatePoi() {
            var html = '<div class="ui-grid-cell-contents"><span ng-if="row.entity.refFeatures.length === 0" class="opt">无</span>' +
                '<a ng-if="row.entity.refFeatures.length > 0" href="javascript:void(0);"  data-placement="bottom-right" ng-click="grid.appScope.showRelatePoi($event, row.entity)">{{row.entity.refFeatures.length}}</a></div>';
            return html;
        }
        // 格式化操作;
        function formatHandle() {
            var html = '<div class="ui-grid-cell-contents"><span ng-if="row.entity.rank == 1" class="opt">不可忽略</span>' +
                '<a ng-if="row.entity.rank != 1" href="javascript:void(0);" ng-click="grid.appScope.doIgnoreCheckResult(row.entity)">忽略</a></div>';
            return html;
        }
        // 显示序号;
        function getIndex() {
            var html = '<div class="ui-grid-cell-contents">{{(grid.appScope.searchModel.pageNum - 1) * grid.appScope.searchModel.pageSize + row.entity.pageIndex}}</div>';
            return html;
        }
        // 获取表格数据;
        function getData(options, callBack) {
            var param = {
                pageSize: 15,
                pageNum: 1,
                sortby: '-ruleid'
            };
            var params = $.extend(param, options);
            $scope.loadingFlag = true;
            dsEdit.getPoiCheckListData(params).then(function (data) {
                var ret = [];
                var total = 0;
                if (data != -1 && data) {
                    for (var i = 0, len = data.result.length; i < len; i++) {
                        var temp = new FM.dataApi.IxCheckResult(data.result[i]);
                        temp.pageIndex = i + 1;
                        ret.push(temp);
                    }
                    total = data.totalCount;
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
        // 格式化row(为了给row绑定事件)
        function formatRow() {
            var html = '<div ng-click="grid.appScope.showOnMap(row)">' +
                '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ' +
                'class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
                '</div>';
            return html;
        }
        // 忽略操作;
        $scope.doIgnoreCheckResult = function (row) {
            dsEdit.updateCheckStatus(row.pid, 0, 2).then(function (data) {
                if (data !== -1) {
                    getData($scope.searchModel);
                }
            });
        };

        // 根据实际的行高设置每行的height属性，主要处理grid高度改变后，canvas的高度没有自动变化的问题
        var myRowProc = function (rows, columns) {
            if (rows.length > 0) {
                $timeout(function () {
                    var rowElems = rows[0].grid.element.find('.ui-grid-canvas').children();
                    rows.forEach(function (item, i) {
                        var t = angular.element(rowElems[i]);
                        item.height = t.height();
                    });
                });
            }
            return rows;
        };

        // 初始化表格;
        var initialize = function () {
            $scope.gridOptions = {
                useExternalSorting: true,
                enableColumnMenus: false,
                useExternalPagination: true,
                paginationPageSizes: [15, 25, 50], // 每页显示个数选项
                paginationCurrentPage: $scope.searchModel.pageNum, // 当前的页码
                paginationPageSize: $scope.searchModel.pageSize, // 每页显示个数
                paginationTemplate: appPath.tool + 'uiGridPager/uiGridPagerTmpl.htm',
                enableFullRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect: false,
                modifierKeysToMultiSelect: false,
                noUnselect: false,
                rowTemplate: formatRow(),
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    // 分页事件;
                    gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                        $scope.searchModel.pageNum = newPage;
                        $scope.searchModel.pageSize = pageSize;
                        getData($scope.searchModel, function (data) {
                            // 翻页后自动滚动到第一条数据
                            $timeout(function () {
                                gridApi.core.scrollTo(data[0]);
                            });
                        });
                    });
                    // 排序事件;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (sortColumns.length) {
                            var direct = sortColumns[0].sort.direction;
                            var sortName = sortColumns[0].field.toLowerCase();
                            $scope.searchModel.sortby = direct == 'desc' ? '-' + sortName : '+' + sortName;
                            getData($scope.searchModel);
                        }
                    });
                    // 处理改变列表高度后，滚动条跳动的问题
                    gridApi.grid.registerRowsProcessor(myRowProc, 200);
                },
                columnDefs: [
                    { field: 'worker', displayName: '序号', enableSorting: false, minWidth: 50, maxWidth: 70, cellTemplate: getIndex() },
                    { field: 'ruleId', displayName: '规则号', enableSorting: true, minWidth: 70, cellClass: 'center' },
                    { field: 'information', displayName: '错误描述', enableSorting: false, minWidth: 150 },
                    { field: 'rank', displayName: '操作', enableSorting: false, minWidth: 100, cellTemplate: formatHandle() },
                    { field: 'refFeatures', displayName: '关联POI', enableSorting: false, minWidth: 35, maxWidth: 70, cellTemplate: formatRelatePoi() }
                ]
            };
            // 初始化表格;
            getData($scope.searchModel);
        };
        var unbindHandler = $scope.$on('ReloadData-poiCheckResult', initialize);
        $scope.$on('$destroy', function (event, data) {
            unbindHandler = null;
        });
    }
]);
