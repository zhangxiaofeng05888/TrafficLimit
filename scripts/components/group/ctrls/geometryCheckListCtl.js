/**
 * 批量删除
 * @author zhaohang
 * @date   2017/11/1
 * @param  {object} $window 窗口
 * @param  {object} $scope 作用域
 * @param  {object} $timeout 定时
 * @param  {object} NgTableParams 构造函数
 * @param  {object} dsFcc 接口服务
 * @param  {object} appPath app路径
 * @param  {object} $ocLazyLoad 延时加载
 * @return {undefined}
 */
angular.module('app').controller('geometryCheckCtrl', ['$window', '$scope', '$timeout', 'NgTableParams', 'dsFcc', 'appPath', 'dsEdit', '$ocLazyLoad', '$compile',
    function ($window, $scope, $timeout, NgTableParams, dsFcc, appPath, dsEdit, $ocLazyLoad, $compile) {
        var eventCtrl = new fastmap.uikit.EventController();
        var feedbackCtrl = fastmap.mapApi.FeedbackController.getInstance();
        var symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();
        var linkSymbol = symbolFactory.getSymbol('ls_link_selected');
        var faceSymbol = symbolFactory.getSymbol('pt_face');
        var pointSymbol = symbolFactory.getSymbol('pt_selectPoint');
        var feedback = new fastmap.mapApi.Feedback();
        feedbackCtrl.add(feedback);
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
        var clearFeedback = function () {
            feedback.clear();
            feedbackCtrl.refresh();
        };
        // 策略表检查项

        // 几何检查项
        var geometryRuleIds = ['GLM90345', 'GLM90346', 'GLM90347', 'GLM90348'];
        $scope.searchModel = {
            pageNum: 1,
            pageSize: 20,
            infoId: '',
            sPublicTime: '',
            ePublicTime: '',
            status: [false, false, false],
            period: [false, false],
            project: [false, false, false, false],
            sortype: '',
            sortord: ''
        };
        // 获取数据
        $scope.lookGeometryResult = function () {
            var requestData = {
                type: 'NIVALEXCEPTION',
                condition: {
                    groupid: App.Temp.groupId,
                    pageSize: $scope.searchModel.pageSize,
                    pageNum: $scope.searchModel.pageNum,
                    sortype: $scope.searchModel.sortype,
                    sortord: $scope.searchModel.sortord,
                    ruleids: geometryRuleIds
                }
            };
            dsFcc.getCheckResult(requestData).then(function (checkRes) {
                if (checkRes.data && checkRes.data.length !== 0 && checkRes != -1) {
                    for (var i = 0; i < checkRes.data.length; i++) {
                        checkRes.data[i].pageIndex = i + 1;
                        var targets = checkRes.data[i].targets;
                        checkRes.data[i].geometryId = targets.substring(0, targets.length - 1).split(',')[1];
                    }
                    $scope.loadingFlag = false;
                    $scope.gridOptions.data = checkRes.data;
                    $scope.gridOptions.totalItems = checkRes.total;
                }
            });
        };
        // 执行检查并且获取表格数据
        var getTableData = function () {
            $scope.loadingFlag = true;
            var params = {
                command: 'CREATE',
                type: 'NIVALEXCEPTION',
                dbId: App.Temp.dbId,
                data: {
                    infoIntelId: App.Temp.infoToGroupData.infoId,
                    groupid: App.Temp.groupId,
                    worker: App.Temp.userId,
                    provinceName: App.Temp.infoToGroupData.cityId,
                    checkType: 2,
                    ruleIds: geometryRuleIds
                }
            };
            dsFcc.doCheck(params).then(function (checkFlag) {
                $scope.lookGeometryResult();
            });
        };

        /**
         * 显示序号;
         * @method getIndex
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {object} html 包括序号，显示在页面
         */
        function getIndex() {
            var html = '<div class="ui-grid-cell-contents">{{(grid.appScope.searchModel.pageNum - 1) * grid.appScope.searchModel.pageSize + row.entity.pageIndex}}</div>';
            return html;
        }
        /**
         * 操作
         * @method operations
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {object} html 包括序号，显示在页面
         */
        function operations() {
            var html = '<div class="ui-grid-cell-contents" style="cursor:pointer;">' +
                '<a ng-if="row.entity.status !== 1 && row.entity.status !== 3" ng-click="grid.appScope.ignoreInfo(row.entity.valExceptionId)" style="display:inline-block;width: 50px;">忽略</a>' +
                '<a ng-if="row.entity.status === 1" style="color: #333333;text-decoration-line: none;display:inline-block;width: 50px;">已忽略</a></div>' +
                '<a ng-if="row.entity.status === 3" style="color: #333333;text-decoration-line: none;display:inline-block;width: 50px;">已处理</a></div>';
            return html;
        }
        /**
         * 格式化row(为了给row绑定事件)
         * @author Niuxinyi
         * @date   2017-11-20
         * @return {object} html 返回页面
         */
        function formatRow() {
            var html = '<div ng-click="grid.appScope.locationGeometry(row)">' +
                '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ' +
                'class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
                '</div>';
            return html;
        }
        /**
         * 定位并高亮显示要素
         * @author Niuxinyi
         * @date   2017-11-20
         * @param  {object} row 包括获取的数据的行
         * @return {undefined}
         */
        $scope.locationGeometry = function (row) {
            $scope.$emit('LocateObject', { feature: row.entity.location });  //  定位
            var symbol = '';
            switch (row.entity.location.type) {
                case 'LineString':
                    symbol = linkSymbol;
                    break;
                case 'Point':
                    symbol = pointSymbol;
                    break;
                case 'Polygon':
                    symbol = faceSymbol;
                    break;
                default:
                    break;
            }
            feedback.clear();
            feedback.add(row.entity.location, symbol);
            feedbackCtrl.refresh();
        };
        $scope.ignoreInfo = function (valExceptionId) {
            var params = {
                command: 'UPDATE',
                type: 'NIVALEXCEPTION',
                dbId: App.Temp.dbId,
                objIds: [valExceptionId],
                data: {
                    status: 1
                }
            };
            dsFcc.ignoreCheckInfo(params).then(function (result) {
                getTableData();
            });
        };
        /**
         * 初始化数据
         * @author Niuxinyi
         * @date   2017-11-20
         * @param  {object} event 包括事件
         * @param  {object} data 包括数据
         * @return {undefined}
         */
        var initialize = function () {
            clearFeedback();
            $scope.groupID = App.Temp.groupId;
            // 初始化表格;
            $scope.gridOptions = {
                useExternalSorting: true,
                enableColumnMenus: false,
                useExternalPagination: true,
                paginationPageSizes: [10, 20, 50], // 每页显示个数选项
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
                    // 处理改变列表高度后，滚动条跳动的问题
                    gridApi.grid.registerRowsProcessor(myRowProc, 200);
                    // 分页事件;
                    gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                        $scope.searchModel.pageNum = newPage;
                        $scope.searchModel.pageSize = pageSize;
                        $scope.lookGeometryResult();
                        $scope.lookGeometryResult(function (data) {
                            // 翻页后自动滚动到第一条数据
                            $timeout(function () {
                                gridApi.core.scrollTo(data[0]);
                            });
                        });
                    });
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (sortColumns.length) {
                            var sortord = sortColumns[0].sort.direction;
                            var sortype = sortColumns[0].field;
                            $scope.searchModel.sortord = sortord;
                            $scope.searchModel.sortype = sortype;
                            $scope.lookGeometryResult();
                        }
                    });
                },
                columnDefs: [
                    {
                        field: 'pageIndex',
                        displayName: '序号',
                        enableSorting: false,
                        maxWidth: 50,
                        cellClass: 'center',
                        cellTemplate: getIndex()
                    },
                    {
                        field: 'geometryId',
                        displayName: 'ID',
                        enableSorting: false,
                        minWidth: 50,
                        cellClass: 'center'
                    },
                    {
                        field: 'ruleid',
                        displayName: '规则号',
                        enableSorting: false,
                        minWidth: 50,
                        cellClass: 'center'
                    },
                    {
                        field: 'information',
                        displayName: '错误描述',
                        enableSorting: false,
                        minWidth: 200,
                        cellClass: 'center'
                    },
                    {
                        field: 'isCurrent',
                        displayName: '当前情报当前组',
                        enableSorting: false,
                        minWidth: 50,
                        cellClass: 'center'
                    },
                    {
                        field: 'operations',
                        displayName: '操作',
                        enableSorting: false,
                        minWidth: 50,
                        cellClass: 'center',
                        cellTemplate: operations()
                    }
                ]
            };
        };
        initialize();
        $scope.$on('ReloadData-geometryCheck', getTableData);
        $scope.$on('ReloadData-geometryCheckResult', $scope.lookGeometryResult);

        $scope.$on('$destroy', function (event, data) {
            clearFeedback();
            feedbackCtrl.del(feedback);
        });
    }
]);
