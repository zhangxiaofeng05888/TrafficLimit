/**
 * 相交列表
 * @author zhaohang
 * @date   2017/11/16
 * @param  {object} $window 窗口
 * @param  {object} $scope 作用域
 * @param  {object} $timeout 定时
 * @param  {object} NgTableParams 构造函数
 * @param  {object} dsFcc 接口服务
 * @param  {object} appPath app路径
 * @param  {object} dsEdit 编辑
 * @return {undefined}
 */
angular.module('app').controller('intersectLineListCtl', ['$window', '$scope', '$timeout', 'NgTableParams', 'dsFcc', 'appPath', 'dsEdit',
    function ($window, $scope, $timeout, NgTableParams, dsFcc, appPath, dsEdit) {
        var feedbackCtrl = fastmap.mapApi.FeedbackController.getInstance();
        var symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();
        var linkSymbol = symbolFactory.getSymbol('ls_link_selected');

        var feedback = new fastmap.mapApi.Feedback();
        feedbackCtrl.add(feedback);

        var clearFeedback = function () {
            feedback.clear();
            feedbackCtrl.refresh();
        };

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

        // 定位并高亮显示要素
        $scope.showOnMap = function (row) {
            if (!row.isSelected) {
                return;
            }
            var feature = row.entity;
            feature.pid = row.entity.linkPid;
            feature.geometry = row.entity.geometryRdlink;
            feature.geoLiveType = 'LIMITLINE';
            feature.groupId = row.entity.groupId ? row.entity.groupId : row.entity.geometryId.split('_')[0];
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
         * @return {object} html 返回页面
         */
        function getIndex() {
            var html = '<div class="ui-grid-cell-contents">{{row.entity.pageIndex}}</div>';
            return html;
        }

        /**
         * 边界是否限行
         * @author Niuxinyi
         * @date   2017-11-20
         * @return {object} html 返回页面
         */
        function getBoundaryLike() {
            var html = '<div class="ui-grid-cell-contents">{{row.entity.linkDir === 0 ? "未限制" : row.entity.linkDir === 1 ? "双方向限行" : row.entity.linkDir === 2 ? "顺方向限行" : "逆方向限行"}}</div>';
            return html;
        }

        /**
         * 获取表格数据;
         * @author Niuxinyi
         * @date   2017-11-20
         * @return {undefined}
         */
        function getData() {
            clearFeedback();
            var params = {
                type: 'SCPLATERESRDLINK',
                condition: {
                    groupId: $scope.groupID,
                    isInter: true
                }
            };
            $scope.loadingFlag = true;
            dsFcc.getIntersectLineListData(params).then(function (data) {
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
            }).finally(function () {
                $scope.loadingFlag = false;
            });
        }

        var initialize = function () {
            clearFeedback();
            $scope.groupID = App.Temp.groupId;
            $scope.gridOptions = {
                useExternalSorting: true,
                enableColumnMenus: false,
                useExternalPagination: false,
                paginationTemplate: appPath.tool + 'uiGridPager/uiGridPagerTmpl.htm',
                enableFullRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect: false,
                modifierKeysToMultiSelect: false,
                noUnselect: false,
                rowTemplate: formatRow(),
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                },
                columnDefs: [
                    { field: 'worker', displayName: '序号', enableSorting: false, minWidth: 45, cellTemplate: getIndex() },
                    { field: 'linkPid', displayName: '道路Id', enableSorting: false, minWidth: 70 },
                    { field: 'geometryId', displayName: '几何Id', enableSorting: false, minWidth: 100 },
                    { field: 'linkDir', displayName: '限制方向', enableSorting: false, minWidth: 75, cellTemplate: getBoundaryLike() }
                ]
            };
            // 初始化表格;
            setTimeout(function () {
                getData();
            }, 100);
        };

        var unbindHandler = $scope.$on('ReloadData', initialize);

        $scope.$on('refresh-intersectLine', function () {
            getData();
        });
        $scope.$on('$destroy', function () {
            clearFeedback();
            feedbackCtrl.del(feedback);
            unbindHandler = null;
        });
    }
]);
