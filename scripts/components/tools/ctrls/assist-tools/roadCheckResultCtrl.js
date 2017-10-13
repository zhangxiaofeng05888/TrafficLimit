angular.module('app').controller('roadCheckResultCtrl', ['$window', '$scope', '$timeout', 'NgTableParams', 'dsEdit', 'appPath', '$sce', 'dsLazyload',
    function ($window, $scope, $timeout, NgTableParams, dsEdit, appPath, $sce, dsLazyload) {
        var objectEditCtrl = new fastmap.uikit.ObjectEditController();
        var geometryAlgorithm = fastmap.mapApi.geometry.GeometryAlgorithm.getInstance();

        $scope.loadingFlag = false;
        $scope.checkTypeOptions = [
            { id: 0, label: '服务后检查' },
            { id: 1, label: '道路自定义检查' }
        ];
        $scope.levelFilterOptions = [
            { id: 0, label: '全部' },
            { id: 1, label: '错误' },
            { id: 2, label: '警告' },
            { id: 3, label: '提示' }
        ];
        $scope.resultStatusOptions = [
            { id: 0, label: '全部' },
            { id: 1, label: '待处理' },
            { id: 2, label: '确认修改' },
            { id: 3, label: '确认不修改 ' },
            { id: 4, label: '例外' }
        ];
        if (App.Temp.qcTaskFlag) {
            $scope.resultStatusOptions = $scope.resultStatusOptions.concat([
                { id: 5, label: '未质检' },
                { id: 6, label: '已质检' }
            ]);
        }
        $scope.searchModel = {
            level: 0,
            flag: 1,
            checkType: 1,
            ruleId: '',
            pageNum: 1,
            pageSize: 15,
            sortby: ''
        };
        // 记录当前选中高亮的对象;
        $scope.currentSelectedData = {
            pid: null,
            geoLiveType: null,
            uid: null
        };
        var marker = null;
        var createMarker = function (latlon) {
            var myIcon = L.icon({
                iconUrl: '../../images/webEditor/map/cross.svg',
                iconSize: [10, 10]
            });
            marker = L.marker(latlon, {
                icon: myIcon
            }).addTo(map);
        };

        var clearMarker = function () {
            if (marker) {
                map.removeLayer(marker);
                marker = null;
            }
        };
        // 定位;
        function goLocation(geometry) {
            if (geometry) {
                var lbs = geometry.replace(/\(|\)/g, '').split(',');
                var zoom = map.getZoom() < 17 ? 17 : map.getZoom();
                // 处理检查返回的坐标为 (0.0, 0.0) 的情况，为0时会导致图幅图层的结算出错
                if (parseFloat(lbs[1]) > 10 && parseFloat(lbs[0]) > 10) {
                    map.setView([parseFloat(lbs[1]), parseFloat(lbs[0])], zoom);
                    clearMarker();
                    createMarker([parseFloat(lbs[1]), parseFloat(lbs[0])]);
                }
            } else {
                throw Error('缺少几何无法定位!');
            }
        }

        // 定位并高亮显示要素
        $scope.showOnMap = function (e, row) {
            var rowData = row.entity;
            var target = e.target.dataset;
            $scope.currentSelectedData.pid = target.pid;
            $scope.currentSelectedData.geoLiveType = target.type;
            $scope.currentSelectedData.uid = row.uid;
            // 查询并高亮对应的元素;
            $scope.$emit('ObjectSelected', { feature: $scope.currentSelectedData });
        };
        // 错误定位;
        $scope.showError = function (e, row) {
            e.stopPropagation();
            if (e.target.nodeName === 'A') {
                $scope.showOnMap(e, row);
            }
        };

        // 格式化等级
        function getLevel() {
            var html = '<div class="ui-grid-cell-contents"><span ng-class="{0: \'text-muted\',1: \'text-danger\',2: \'text-warning\',3: \'text-info\'}[row.entity.rank]">{{{0: \'--\',1: \'错误\',2: \'警告\',3: \'提示\'}[row.entity.rank]}}</span></div>';
            return html;
        }

        $scope.formatErrorList = function (datas) {
            var htmlArray = [];
            for (var i = 0; i < datas.length; i++) {
                htmlArray.push('[<a style="cursor: pointer;" class="check-target text-primary" data-type="' + datas[i].featType + '" data-pid="' + datas[i].pid + '">' + datas[i].featType + ',' + datas[i].pid + '</a>]');
            }
            return $sce.trustAsHtml(htmlArray.join(', '));
        };


        // 格式化错误对象;
        function getErrorObj() {
            var html = '<div ng-click="grid.appScope.showError($event, row)" class="ui-grid-cell-contents" ng-bind-html="grid.appScope.formatErrorList(row.entity.targets)"></div>';
            return html;
        }
        // 格式化检查状态;
        function getCheckStatusTpl() {
            var html = '<div class="ui-grid-cell-contents"><button class="btn al" ng-class="{3: \'active\'}[row.entity.status]" data-type="" data-pid="" ng-click="grid.appScope.changeStatus($event, row, 3)"></button>' +
                '<button class="btn no" ng-class="{2: \'active\'}[row.entity.status]" ng-click="grid.appScope.changeStatus($event, row, 2)"></button>' +
                '<button class="btn ex" ng-class="{1: \'active\'}[row.entity.status]" ng-click="grid.appScope.changeStatus($event, row, 1)"></button></div>';
            return html;
        }
        // 格式化质检状态;
        function getQcStatusTpl() {
            var html = '<div class="ui-grid-cell-contents"><button ng-class="{1: \'active\'}[row.entity.qaStatus]" ng-click="grid.appScope.upDateRoadQualityStatus($event, row, 1)" class="btn al"></button></div>';
            return html;
        }

        // 获取表格数据;
        function getData(options, callBack) {
            var param = {
                pageSize: 15,
                pageNum: 1,
                level: 0,
                ruleId: '',
                flag: 1,
                sortby: $scope.searchModel.sortby || ''
            };
            var params = $.extend(param, options);
            $scope.loadingFlag = true;
            dsEdit.getCheckData(params).then(function (data) {
                var ret = [];
                var total = 0;
                if (data != -1) {
                    total = data.totalCount;
                    for (var i = 0, len = data.result.length; i < len; i++) {
                        ret.push(new FM.dataApi.IxCheckResult(data.result[i]));
                    }
                }
                $scope.gridOptions.totalItems = total;
                $scope.gridOptions.data = ret;
                $scope.gridOptions.paginationCurrentPage = $scope.searchModel.pageNum;
                if (callBack) {
                    callBack($scope.gridOptions.data);
                }
            }).finally(function () {
                $scope.loadingFlag = false;
            });
        }

        $scope.convertToPixel = function (map, tileInfo, coordinates) {
            var x = coordinates[0];
            var y = coordinates[1];
            var point = map.project([
                y,
                x
            ]);
            return [
                point.x,
                point.y
            ];
        };

        $scope.convertToGeography = function (map, tileInfo, coordinates) {
            var x = coordinates[0];
            var y = coordinates[1];
            var lnglat = map.unproject([
                x,
                y
            ]);
            return [
                lnglat.lng,
                lnglat.lat
            ];
        };
        // 根据错误对象的几何集找到其中心位置定位;
        $scope.reLocation = function (geometry) {
            if (geometry.coordinates.length === 0) {
                return;
            }
            var centerPoint = geometryAlgorithm.centroid(geometry);
            var newGeo = '(' + centerPoint.coordinates[0] + ',' + centerPoint.coordinates[1] + ')';
            goLocation(newGeo);
        };

        $scope.showObjHighLight = function ($event, row, targets) {
            var topoEditFactory = fastmap.uikit.topoEdit.TopoEditFactory.getInstance();
            var promises = [];
            targets.forEach(function (item) {
                item.pid = parseInt(item.pid, 10);
                item.geoLiveType = item.featType;
                var topoEditor = topoEditFactory.createTopoEditor(item.geoLiveType, null);
                if (topoEditor) {
                    var promise = topoEditor.query(item);
                    promises.push(promise);
                }
            });
            Promise.all(promises)
                .then(function (res) {
                    var datas = [];
                    var geometry = {
                        type: 'MultiPoint',
                        coordinates: []
                    };
                    res.forEach(function (item) {
                        objectEditCtrl.setData(item);
                        datas.push(objectEditCtrl.data);
                        var tempStr = JSON.stringify(item.geometry.coordinates).replace(/\[+/g, '[').replace(/\]+,*/g, ']#');
                        tempStr = tempStr.substring(0, tempStr.length - 1);
                        var tempArr = tempStr.split('#');
                        tempArr.forEach(function (loopList) {
                            geometry.coordinates.push(JSON.parse(loopList));
                        });
                    });
                    $scope.reLocation(geometry);
                    $scope.$emit('Multi-Highlight', datas);
                });
        };

        // 格式化row(为了给row绑定事件)
        function formatRow() {
            var html = '<div ng-click="grid.appScope.showObjHighLight($event, row, row.entity.targets)">' +
                '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ' +
                'class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
                '</div>';
            return html;
        }
        // 获取作业员
        function getUser() {
            return '<div ng-if="row.entity.worker">{{row.entity.worker}}</div><div ng-if="!row.entity.worker">--</div>';
        }
        // 获得张三;
        function getQcUser() {
            return '<div ng-if="row.entity.qaWorker">{{row.entity.qaWorker}}</div><div ng-if="!row.entity.qaWorker">--</div>';
        }
        // 获得问题;
        function getProblem() {
            return '<div class="ui-grid-cell-contents"><button ng-if="row.entity.status==3" ng-click="grid.appScope.showQaProblem($event, row)" class="qaProblem">查看</button><span ng-if="row.entity.status!=3">--</span></div>';
        }
        // 过滤数据;
        $scope.filterData = function () {
            $scope.searchModel.pageNum = 1;
            getData($scope.searchModel);
        };

        // 修改状态后定位下一条;
        $scope.autoNext = function (e, row, newStatus, data) {
            if (data !== -1) {
                var nextIndex = 0;
                var isNextPage = false;
                $scope.gridOptions.data.forEach(function (item, index) {
                    if (row.entity.pid === item.pid) {
                        // 全部
                        var nextRowNum = index + 1;
                        var currentIndex = ($scope.searchModel.pageNum - 1) * $scope.searchModel.pageSize + index + 1;
                        if (!$scope.searchModel.flag) {
                            // 当为本页最后一条或总共只有一条数据的情况下index值不变;
                            isNextPage = nextRowNum == $scope.searchModel.pageSize || currentIndex === $scope.gridOptions.totalItems;
                            nextIndex = isNextPage ? index : nextRowNum;
                        } else {
                            var isLastData = currentIndex === $scope.gridOptions.totalItems;
                            nextIndex = isLastData ? index - 1 : index;
                        }
                    }
                });
                getData($scope.searchModel, function (res) {
                    if (res.length) {
                        $timeout(function () {
                            if (nextIndex < 0) return;
                            $scope.showObjHighLight(e, $scope.gridApi.core.getVisibleRows()[nextIndex], res[nextIndex].targets);
                            $scope.gridApi.selection.selectRowByVisibleIndex(nextIndex, e);
                        });
                    }
                });
            }
        };

        $scope.loadDepFiles = function (fn) {
            var ctrl = appPath.root + 'scripts/components/tools/ctrls/assist-tools/roadCheckResultQualityCtrl.js';
            var tmpl = appPath.root + 'scripts/components/tools/tpls/assist-tools/roadCheckResultQualityTpl.html';
            dsLazyload.loadInclude($scope, 'roadCheckResultQualityModal', ctrl, tmpl)
                .then(function () {
                    if (fn) {
                        fn();
                    }
                });
        };

        // 查看道路质检问题：
        $scope.showQaProblem = function (e, row) {
            e.stopPropagation();
            $scope.loadDepFiles(function () {
                $scope.qualityWrapper = true;
                $scope.$broadcast('refreshRoadCheckBox', {
                    data: row.entity,
                    flag: 'show',
                    param: { event: e, tableRow: row }
                });
            });
        };

        // 修改检查项状态
        $scope.changeStatus = function (e, row, newStatus) {
            e.stopPropagation();
            if (row.entity.status === newStatus) { newStatus = 0; }
            if (App.Temp.qcTaskFlag && newStatus === 3) {
                $scope.loadDepFiles(function () {
                    $scope.qualityWrapper = true;
                    $scope.$broadcast('refreshRoadCheckBox', {
                        data: row.entity,
                        flag: 'add',
                        status: newStatus,
                        param: { event: e, tableRow: row }
                    });
                });
            } else {
                dsEdit.updateCheckStatus(row.entity.pid, row.entity.status, newStatus).then(function (data) {
                    $scope.autoNext(e, row, newStatus, data);
                });
            }
        };
        // 关闭质检窗口;
        $scope.$on('closeRoadCheckBox', function () {
            $scope.qualityWrapper = false;
        });

        // 更新质检状态;
        $scope.upDateRoadQualityStatus = function (e, row, newStatus) {
            e.stopPropagation();
            if (row.entity.qaStatus == newStatus) {
                newStatus = 2;
            }
            dsEdit.updateRoadQualityStatus(row.entity, newStatus)
                .then(function (data) {
                    $scope.autoNext(e, row, newStatus, data);
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
                rowTemplate: formatRow(),
                columnDefs: [
                    { field: 'rank', displayName: '等级', enableSorting: false, minWidth: 40, cellTemplate: getLevel() },
                    { field: 'ruleId', displayName: '规则号', enableSorting: true, minWidth: 50 },
                    { field: 'information', displayName: '错误信息', enableSorting: false, minWidth: 120 },
                    { field: 'targets', displayName: '错误对象', enableSorting: false, minWidth: 100, cellTemplate: getErrorObj() },
                    { field: 'status', displayName: '确认状态', enableSorting: false, minWidth: 90, cellTemplate: getCheckStatusTpl() },
                    { field: 'worker', displayName: '作业员', enableSorting: false, minWidth: 50, cellTemplate: getUser() }
                ],
                onRegisterApi: function (gridApi) {
                    if (App.Temp.qcTaskFlag) {  //  质检任务才显示这两个字段。相关需求：1934，十二迭代
                        var qaStatus = { field: 'qaStatus', displayName: '质检', enableSorting: false, minWidth: 50, cellTemplate: getQcStatusTpl() };
                        var qaWorker = { field: 'qaWorker', displayName: '质检员', enableSorting: false, minWidth: 50, cellTemplate: getQcUser() };
                        var qaProblem = { field: 'problem', displayName: '问题', enableSorting: false, minWidth: 70, cellTemplate: getProblem() };
                        $scope.gridOptions.columnDefs.push(qaStatus);
                        $scope.gridOptions.columnDefs.push(qaWorker);
                        $scope.gridOptions.columnDefs.push(qaProblem);
                    }
                    
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

                    // 处理改变列表高度后，滚动条跳动的问题
                    gridApi.grid.registerRowsProcessor(myRowProc, 200);

                    // 排序事件
                    gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (sortColumns.length) {
                            var direct = sortColumns[0].sort.direction;
                            var sortName = sortColumns[0].field.toLowerCase();
                            $scope.searchModel.sortby = direct == 'desc' ? '-' + sortName : '+' + sortName;
                            getData($scope.searchModel);
                        }
                    });
                }
            };
            // 初始化表格;
            getData($scope.searchModel);
        };

        function afterSaveQuality(data) {
            $scope.autoNext(data.data.event, data.data.tableRow, data.status, data.res);
        }

        $scope.$on('onSaveRoadCheckQuality', function (e, data) {
            afterSaveQuality(data);
        });
        $scope.$on('ReloadData-roadCheckResult', initialize);

        $scope.$on('$destroy', function (event, data) {
            clearMarker();
        });
    }
]);
