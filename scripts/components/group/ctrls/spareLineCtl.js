/**
 * 编辑线列表
 * @author zhaohang
 * @date   2017/11/8
 * @param  {object} $window 窗口
 * @param  {object} $scope 作用域
 * @param  {object} $timeout 定时
 * @param  {object} NgTableParams 构造函数
 * @param  {object} dsFcc 接口服务
 * @param  {object} appPath app路径
 * @param  {object} dsEdit 编辑
 * @return {undefined}
 */
angular.module('app').controller('spareLineListCtl', ['$window', '$scope', '$timeout', 'NgTableParams', 'dsFcc', 'appPath', 'dsEdit',
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
        /**
         * 定位并高亮显示要素
         * @author Niuxinyi
         * @date   2017-11-20
         * @param  {object} row 包括获取数据的行
         * @return {undefined}
         */
        $scope.showOnMap = function (row) {
            if (!row.isSelected) {
                return;
            }

            $scope.$emit('LocateObject', { feature: row.entity });  //  定位

            var symbol = linkSymbol;
            feedback.clear();
            feedback.add(row.entity.geometry, symbol);
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
            var html = '<div class="ui-grid-cell-contents">{{row.entity.boundaryLink === "1" ? "限行" : "不限行"}}</div>';
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
                type: 'SCPLATERESFACE',
                condition: {
                    groupId: $scope.groupID,
                    gtype: 2002
                }
            };
            $scope.loadingFlag = true;
            dsFcc.getSpareLineListData(params).then(function (data) {
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
        /**
         * 初始化数据
         * @author Niuxinyi
         * @date   2017-11-20
         * @return {undefined}
         */
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
                    { field: 'worker', displayName: '序号', enableSorting: false, minWidth: 50, cellTemplate: getIndex() },
                    { field: 'geometryId', displayName: '几何Id', enableSorting: false, minWidth: 150 },
                    { field: 'boundaryLike', displayName: '边界是否限行', enableSorting: false, minWidth: 100, cellTemplate: getBoundaryLike() }
                ]
            };
            // 初始化表格;
            getData();
        };

        var unbindHandler = $scope.$on('ReloadData', initialize);

        $scope.$on('refresh-spareLine', function () {
            getData();
        });
        $scope.$on('$destroy', function () {
            clearFeedback();
            feedbackCtrl.del(feedback);
            unbindHandler = null;
        });
    }
]);
