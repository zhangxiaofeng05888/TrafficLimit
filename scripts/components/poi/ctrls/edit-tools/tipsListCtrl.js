angular.module('app').controller('tipsListCtrl', ['$window', '$scope', '$timeout', 'NgTableParams', 'dsFcc', 'appPath',
    function ($window, $scope, $timeout, NgTableParams, dsFcc, appPath) {
        var objectEditCtrl = new fastmap.uikit.ObjectEditController();
        var feedbackController = fastmap.mapApi.FeedbackController.getInstance();
        var symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();
        var defaultFeedback = new fastmap.mapApi.Feedback();
        var geometryAlgorithm = fastmap.mapApi.geometry.GeometryAlgorithm.getInstance();
        var geometryTransform = fastmap.mapApi.GeometryTransform.getInstance();
        var proj4Transform = fastmap.mapApi.Proj4Transform.getInstance();
        var eventCtrl = new fastmap.uikit.EventController();
        feedbackController.add(defaultFeedback);
        $scope.rowData = {};
        $scope.loadingFlag = false;
        $scope.searchModel = {
            pageNum: 1,
            pageSize: 20,
            order: '',
            beginTime: '',
            endTime: ''
        };

        function getBuffer(geometry, buffer) {
            var mecatorTranform = new fastmap.mapApi.MecatorTranform();
            var func = function (map, tile, coordinates) {
                return map.lonLat2Mercator(coordinates[0], coordinates[1]);
            };
            geometryTransform.setEnviroment(mecatorTranform, null, func);
            var lineGeometry = geometryTransform.convertGeometry(geometry);
            var polygonBuffer = geometryAlgorithm.buffer(lineGeometry, buffer);
            geometryTransform.setEnviroment(mecatorTranform, null, function (map, tile, coordinates) {
                return map.mer2lonlat(coordinates[0], coordinates[1]);
            });
            return geometryTransform.convertGeometry(polygonBuffer);
        }

        // 定位并高亮显示要素
        $scope.showOnMap = function (row) {
            $scope.rowData = row;
            var rowdata = row.entity;
            var params = {
                buffer: 30,
                id: rowdata.rowkey
            };
            var zoom = map.getZoom() < 17 ? 17 : map.getZoom();
            map.setView([parseFloat(rowdata.location.coordinates[1]), parseFloat(rowdata.location.coordinates[0])], zoom);
            var lineSymbol = symbolFactory.getSymbol('link_move_poi');
            var pointSymbol = symbolFactory.getSymbol('point_move_poi');
            var polygonSymbol = symbolFactory.getSymbol('polygon_move_poi');
            defaultFeedback.clear();
            defaultFeedback.add(rowdata.relateInfo, lineSymbol);
            var polygonGeometry = getBuffer(rowdata.relateInfo, 30);
            defaultFeedback.add(polygonGeometry, polygonSymbol);
            dsFcc.getPoiDataByTips(params).then(function (data) {
                for (var i = 0; i < data.length; i++) {
                    defaultFeedback.add(data[i].geometry, pointSymbol);
                    feedbackController.refresh();
                }
            });
            feedbackController.refresh();
        };
        $scope.changeTime = function (time) {
            return Utils.dateFormat(time);
        };
        // 显示序号;
        function getIndex() {
            var html = '<div class="ui-grid-cell-contents">{{(grid.appScope.searchModel.pageNum - 1) * grid.appScope.searchModel.pageSize + row.entity.pageIndex}}</div>';
            return html;
        }

        // 显示状态;
        function getStatus() {
            var html = '<div class="ui-grid-cell-contents">{{row.entity.status === 0 ? "无" : row.entity.status === 1 ? "删除" : row.entity.status === 2 ? "修改" : "新增"}}</div>';
            return html;
        }

        // 显示类型
        function getType() {
            var html = '<div class="ui-grid-cell-contents">{{row.entity.type == 2001 ? "测线" : "删除标记" }}</div>';
            return html;
        }

        // 显示时间
        function getTime() {
            var html = '<div class="ui-grid-cell-contents">{{grid.appScope.changeTime(row.entity.date)}}</div>';
            return html;
        }

        // 获取表格数据;
        function getData(options) {
            var param = {
                pageSize: 20,
                pageNum: 1,
                order: ''
            };
            var params = $.extend(param, options);
            $scope.loadingFlag = true;
            dsFcc.getTipsListData(params).then(function (data) {
                var ret = [];
                var total = 0;
                if (data && data.length !== 0 && data != -1) {
                    for (var i = 0, len = data.tips.length; i < len; i++) {
                        var temp = data.tips[i];
                        temp.pageIndex = i + 1;
                        ret.push(temp);
                    }
                    total = data.total;
                }
                $scope.gridOptions.totalItems = total;
                $scope.gridOptions.data = ret;
                $scope.loadingFlag = false;
            }, function () {
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

        $scope.searchTipList = function () {
            getData($scope.searchModel);
        };

        // 初始化表格;
        var initialize = function () {
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            if (month < 10) {
                month = '0' + month.toString();
            } else {
                month = month.toString();
            }
            var day = date.getDate();
            if (day < 10) {
                day = '0' + day.toString();
            } else {
                day = day.toString();
            }
            var time = year.toString() + '-' + month + '-' + day.toString();
            $scope.searchModel.beginTime = time;
            $scope.searchModel.endTime = time;
            $scope.gridOptions = {
                useExternalSorting: true,
                enableColumnMenus: false,
                useExternalPagination: true,
                paginationPageSizes: [20], // 每页显示个数选项
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
                        getData($scope.searchModel);
                    });
                    // 排序事件;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (sortColumns.length) {
                            var direct = sortColumns[0].sort.direction;
                            var sortName = sortColumns[0].field.toLowerCase();
                            if (sortName === 'date') {
                                sortName = 'time';
                            } else if (sortName === 'status') {
                                sortName = 'lifecycle';
                            }
                            $scope.searchModel.order = sortName + '-' + direct;
                            getData($scope.searchModel);
                        } else if (sortColumns.length === 0) {
                            $scope.searchModel.order = '';
                            getData($scope.searchModel);
                        }
                    });
                },
                columnDefs: [
                    {
                        field: 'id',
                        displayName: '序号',
                        enableSorting: false,
                        minWidth: 50,
                        maxWidth: 70,
                        cellTemplate: getIndex()
                    },
                    {
                        field: 'status',
                        displayName: '状态',
                        enableSorting: true,
                        minWidth: 50,
                        cellClass: 'center',
                        cellTemplate: getStatus()
                    },
                    { field: 'type', displayName: '类型', enableSorting: true, minWidth: 60, cellTemplate: getType() },
                    { field: 'date', displayName: '时间', enableSorting: true, minWidth: 150, cellTemplate: getTime() }
                ]
            };
            // 初始化表格;
            getData($scope.searchModel);
        };
        eventCtrl.on(eventCtrl.eventTypes.REFRESHPOIHIGHLIGHT, function () {
            $scope.showOnMap($scope.rowData);
        });

        var unbindHandler = $scope.$on('ReloadData-tipListPanel', initialize);
        $scope.$on('$destroy', function (event, data) {
            unbindHandler = null;
            eventCtrl.off(eventCtrl.eventTypes.REFRESHPOIHIGHLIGHT);
            defaultFeedback.clear();
            feedbackController.refresh();
        });
    }
]);
