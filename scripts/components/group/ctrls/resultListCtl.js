/**
 * 几何成果列表
 * @author zhaohang
 * @date   2017/10/12
 * @param  {object} $window 窗口
 * @param  {object} $scope 作用域
 * @param  {object} $timeout 定时
 * @param  {object} NgTableParams 构造函数
 * @param  {object} dsFcc 接口服务
 * @param  {object} appPath app路径
 * @param  {object} dsEdit 编辑
 * @return {undefined}
 */
angular.module('app').controller('resultListCtl', ['$window', '$scope', '$timeout', 'NgTableParams', 'dsFcc', 'appPath', 'dsEdit',
    function ($window, $scope, $timeout, NgTableParams, dsFcc, appPath, dsEdit) {
        var feedbackCtrl = fastmap.mapApi.FeedbackController.getInstance();
        var symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();
        var linkSymbol = symbolFactory.getSymbol('ls_link_selected');
        var faceSymbol = symbolFactory.getSymbol('pt_face');

        var feedback = new fastmap.mapApi.Feedback();
        feedbackCtrl.add(feedback);

        var clearFeedback = function () {
            feedback.clear();
            feedbackCtrl.refresh();
        };
        /**
         * 定位并高亮显示要素
         * @author Niuxinyi
         * @date   2017-11-20
         * @param  {object} row 包括获取的数据的行
         * @return {undefined}
         */
        $scope.showOnMap = function (row) {
            if (!row.isSelected) {
                return;
            }
            var feature = row.entity;
            feature.pid = row.entity.pid ? row.entity.pid : row.entity.geometryId;
            feature.id = row.entity.pid ? row.entity.pid : row.entity.geometryId;
            feature.geoLiveType = row.entity.geometry.type === 'LineString' ? 'GEOMETRYLINE' : 'GEOMETRYPOLYGON';
            $scope.$emit('ObjectSelected', {
                feature: feature
            });
            feedbackCtrl.refresh();
        };
        /**
         * 格式化row(为了给row绑定事件)
         * @author Niuxinyi
         * @date   2017-11-20
         * @return {object} html 返回页面
         */
        function formatRow() {
            var html = '<div ng-click="grid.appScope.showOnMap(row)">' +
                '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ' +
                'class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
                '</div>';
            return html;
        }
        /**
         * 显示序号
         * @author Niuxinyi
         * @date   2017-11-20
         * @return {object} html  返回页面
         */
        function getIndex() {
            var html = '<div class="ui-grid-cell-contents">{{(grid.appScope.searchModel.pageNum - 1) * grid.appScope.searchModel.pageSize + row.entity.pageIndex}}</div>';
            return html;
        }
        /**
         * 显示几何形状
         * @author Niuxinyi
         * @date   2017-11-20
         * @return {object} html  返回页面
         */
        function getGeometry() {
            var html = '<div class="ui-grid-cell-contents">{{row.entity.geometry.type === "LineString" ? "线" : "面"}}</div>';
            return html;
        }
        /**
         * 边界是否限行
         * @author Niuxinyi
         * @date   2017-11-20
         * @return {object} html  返回页面
         */
        function getBoundaryLike() {
            var html = '<div class="ui-grid-cell-contents">{{row.entity.boundaryLink === "1" ? "限行" : "不限行"}}</div>';
            return html;
        }
        /**
         * 获取表格数据;
         * @author Niuxinyi
         * @date   2017-11-20
         * @param  {object} options 包括选项
         * @param  {object} callBack 包括回调
         * @return {undefined}
         */
        function getData(options, callBack) {
            var param = {
                pageSize: 15,
                pageNum: 1
            };
            var params = $.extend(param, options);
            $scope.loadingFlag = true;
            dsEdit.getResultList(params).then(function (data) {
                var ret = [];
                var total = 0;

                if (data !== -1) {
                    for (var i = 0, len = data.data.length; i < len; i++) {
                        data.data[i].pageIndex = i + 1;
                    }
                    total = data.total;
                    ret = data.data;
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
         * 初始化数据
         * @author Niuxinyi
         * @date   2017-11-20
         * @return {undefined}
         */
        var initialize = function () {
            clearFeedback();
            $scope.groupID = App.Temp.groupId;
            $scope.searchModel = {
                pageNum: 1,
                pageSize: 15,
                sortby: ''
            };
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
                            clearFeedback();
                        });
                    });
                },
                columnDefs: [
                    { field: 'worker', displayName: '序号', enableSorting: false, minWidth: 50, cellTemplate: getIndex() },
                    { field: 'geometry', displayName: '几何形状', enableSorting: false, minWidth: 100, cellTemplate: getGeometry() },
                    { field: 'boundaryLike', displayName: '边界是否限行', enableSorting: false, minWidth: 150, cellTemplate: getBoundaryLike() }
                ]
            };
            // 初始化表格;
            getData($scope.searchModel);
        };
        $scope.$on('Refresh-Result-List', function (event, data) {
            $scope.searchModel.pageNum = 1;
            $scope.gridOptions.paginationCurrentPage = 1;
            var param = {
                pageSize: $scope.searchModel.pageSize,
                pageNum: 1
            };
            getData(param);
        });

        var unbindHandler = $scope.$on('ReloadData', initialize);

        $scope.$on('$destroy', function () {
            clearFeedback();
            feedbackCtrl.del(feedback);
            unbindHandler = null;
        });
    }
]);
