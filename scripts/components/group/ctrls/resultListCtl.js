/**
 * Created by zhaohang on 2017/10/12.
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

        // 定位并高亮显示要素
        $scope.showOnMap = function (row) {
            if (!row.isSelected) {
                return;
            }

            $scope.$emit('LocateObject', { feature: row.entity });  //  定位

            var symbol = row.entity.geometry.type === 'LineString' ? linkSymbol : faceSymbol;
            feedback.clear();
            feedback.add(row.entity.geometry, symbol);
            feedbackCtrl.refresh();
        };
        // 格式化row(为了给row绑定事件)
        function formatRow() {
            var html = '<div ng-click="grid.appScope.showOnMap(row)">' +
                '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ' +
                'class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
                '</div>';
            return html;
        }

        // 显示序号
        function getIndex() {
            var html = '<div class="ui-grid-cell-contents">{{(grid.appScope.searchModel.pageNum - 1) * grid.appScope.searchModel.pageSize + row.entity.pageIndex}}</div>';
            return html;
        }

        // 显示几何形状
        function getGeometry() {
            var html = '<div class="ui-grid-cell-contents">{{row.entity.geometry.type === "LineString" ? "线" : "面"}}</div>';
            return html;
        }

        // 边界是否限行
        function getBoundaryLike() {
            var html = '<div class="ui-grid-cell-contents">{{row.entity.boundaryLike === "1" ? "限行" : "不限行"}}</div>';
            return html;
        }

        // 获取表格数据;
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

        var unbindHandler = $scope.$on('ReloadData', initialize);

        $scope.$on('$destroy', function () {
            clearFeedback();
            feedbackCtrl.del(feedback);
            unbindHandler = null;
        });
    }
]);
