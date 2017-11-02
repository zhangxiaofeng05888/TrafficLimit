/**
 * Created by zhaohang on 2017/9/15.
 */
angular.module('app').controller('infoListCtrl', ['$window', '$scope', '$timeout', 'NgTableParams', 'dsFcc', 'appPath', '$ocLazyLoad', 'dsLazyload',
    function ($window, $scope, $timeout, NgTableParams, dsFcc, appPath, $ocLazyLoad, dsLazyload) {
        if (!$scope.testLogin()) {
            return;
        }
        $scope.childListFlag = true; // 当前作业项折叠flag;
        $scope.showFlag = true;
        $scope.selectId = true;
        $scope.openChildList = function () {
            $scope.childListFlag = !$scope.childListFlag;
        };
        $scope.searchModel = {
            pageNum: 1,
            pageSize: 20,
            infoId: '',
            beginTime: '',
            endTime: '',
            status: [false, false, false],
            period: [false, false]
        };
        $scope.cityId = 110099;
        $scope.cityList = CityList;
        $scope.statusData = [
            {
                id: 2,
                label: '已处理'
            },
            {
                id: 1,
                label: '未处理'
            },
            {
                id: 3,
                label: '无法处理'
            }
        ];
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
        // 获取表格数据;
        function getData() {
            var status = [];
            var period = [];
            var startTime = $scope.searchModel.beginTime;
            var endTime = $scope.searchModel.endTime;
            if (startTime) {
                startTime = startTime.replace(new RegExp(/(-)/g), '');
            }
            if (endTime) {
                endTime = endTime.replace(new RegExp(/(-)/g), '');
            }
            if ($scope.searchModel.status[0]) {
                status.push(1);
            }
            if ($scope.searchModel.status[1]) {
                status.push(2);
            }
            if ($scope.searchModel.status[2]) {
                status.push(3);
            }
            if ($scope.searchModel.period[0]) {
                period.push('S');
            }
            if ($scope.searchModel.period[1]) {
                period.push('D');
            }
            var params = {
                type: 'SCPLATERESINFO',
                condition: {
                    adminArea: $scope.cityId,
                    infoCode: $scope.searchModel.infoId,
                    startTime: startTime,
                    endTime: endTime,
                    complete: status,
                    condition: period,
                    pageSize: $scope.searchModel.pageSize,
                    pageNum: $scope.searchModel.pageNum
                }
            };
            dsFcc.getInfoListData(params).then(function (data) {
                var ret = [];
                var total = 0;
                if (data.data && data.data.length !== 0 && data != -1) {
                    for (var i = 0, len = data.data.length; i < len; i++) {
                        var temp = data.data[i];
                        temp.pageIndex = i + 1;
                        for (var j = 0; j < $scope.cityList.length; j++) {
                            if ($scope.cityId == $scope.cityList[j].id) {
                                temp.cityName = $scope.cityList[j].name;
                            }
                        }
                        ret.push(temp);
                    }
                    total = data.total;
                }
                $scope.gridOptions.totalItems = total;
                $scope.gridOptions.data = ret;
            });
        }
        $scope.changeCityId = function (value) {
            $scope.cityId = value;
        };
        $scope.searchList = function () {
            getData();
        };
        $scope.searchGroupList = function (row) {
            App.Temp.infoToGroupData = {
                infoId: row.entity.infoIntelId,
                cityId: $scope.cityId,
                cityName: row.entity.cityName,
                condition: row.entity.condition
            };
            var sessionData = {
                infoToGroupData: App.Temp.infoToGroupData
            };
            App.Util.setSessionStorage('infoData', sessionData);
            window.location.href = '#/group?access_token=' + App.Temp.accessToken + '&random=' + Math.floor(Math.random() * 100);
        };
        // 显示序号;
        function getIndex() {
            var html = '<div class="ui-grid-cell-contents">{{(grid.appScope.searchModel.pageNum - 1) * grid.appScope.searchModel.pageSize + row.entity.pageIndex}}</div>';
            return html;
        }
        function getUrl() {
            var html = '<div class="ui-grid-cell-contents"><a href="{{row.entity.url}}" target="_blank">{{row.entity.url}}</a></div>';
            return html;
        }
        function getPeriod() {
            var html = '<div class="ui-grid-cell-contents">{{row.entity.condition === "S" ? "长期" : "短期"}}</div>';
            return html;
        }
        function getStatus() {
            var html = '<div class="ui-grid-cell-contents">{{row.entity.complete === 1 ? "未处理" : row.entity.complete === 2 ? "已处理" : " "}}</div>';
            return html;
        }
        function getContent() {
            var html = '<div class="ui-grid-cell-contents" title="{{row.entity.infoContent}}">{{row.entity.infoContent.substring(0, 19)}}</div>';
            return html;
        }
        function more() {
            var html = '<div class="ui-grid-cell-contents">' +
                '<div class="search-icon" title="查看" ng-click="grid.appScope.searchGroupList(row)"></div></div>';
            return html;
        }

        $scope.showLoading = function () {
            if (!$scope.loading.flag) {
                $scope.loading.flag = true;
            }
        };

        $scope.hideLoading = function () {
            if ($scope.loading.flag) {
                $scope.loading.flag = false;
            }
        };

        // 初始化表格;
        var initialize = function () {
            var date = new Date();
            var preDate = new Date();
            preDate.setDate(new Date().getDate() - 30);
            var year = date.getFullYear();
            var preYear = preDate.getFullYear();
            var month = date.getMonth() + 1;
            var preMonth = preDate.getMonth() + 1;
            if (month < 10) {
                month = '0' + month.toString();
            } else {
                month = month.toString();
            }
            if (preMonth < 10) {
                preMonth = '0' + preMonth.toString();
            } else {
                preMonth = preMonth.toString();
            }
            var day = date.getDate();
            var preDay = preDate.getDate();
            if (day < 10) {
                day = '0' + day.toString();
            } else {
                day = day.toString();
            }
            if (preDay < 10) {
                preDay = '0' + preDay.toString();
            } else {
                preDay = preDay.toString();
            }
            var time = year.toString() + '-' + month + '-' + day.toString();
            var preTime = preYear.toString() + '-' + preMonth + '-' + preDay.toString();
            $scope.searchModel.beginTime = preTime;
            $scope.searchModel.endTime = time;
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
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    // 处理改变列表高度后，滚动条跳动的问题
                    gridApi.grid.registerRowsProcessor(myRowProc, 200);
                    // 分页事件;
                    gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                        $scope.searchModel.pageNum = newPage;
                        $scope.searchModel.pageSize = pageSize;
                        getData();
                        getData(function (data) {
                            // 翻页后自动滚动到第一条数据
                            $timeout(function () {
                                gridApi.core.scrollTo(data[0]);
                            });
                        });
                    });
                },
                columnDefs: [
                    {
                        field: 'id',
                        displayName: '序号',
                        enableSorting: false,
                        maxWidth: 50,
                        cellTemplate: getIndex()
                    },
                    {
                        field: 'infoCode',
                        displayName: '情报编码',
                        enableSorting: false,
                        minWidth: 100,
                        cellClass: 'center'
                    },
                    {
                        field: 'adminCode',
                        displayName: '行政区划',
                        enableSorting: false,
                        minWidth: 50,
                        cellClass: 'center'
                    },
                    {
                        field: 'url',
                        displayName: '来源网址',
                        enableSorting: false,
                        minWidth: 100,
                        cellClass: 'center',
                        cellTemplate: getUrl()
                    },
                    {
                        field: 'infoContent',
                        displayName: '新闻内容',
                        enableSorting: false,
                        minWidth: 100,
                        cellClass: 'center',
                        cellTemplate: getContent()
                    },
                    {
                        field: 'newsTime',
                        displayName: '发布日期',
                        enableSorting: false,
                        minWidth: 50,
                        cellClass: 'center'
                    },
                    {
                        field: 'condition',
                        displayName: '限行长短期',
                        enableSorting: false,
                        minWidth: 50,
                        maxWidth: 100,
                        cellClass: 'center',
                        cellTemplate: getPeriod()
                    },
                    {
                        field: 'complete',
                        displayName: '完成状态',
                        enableSorting: false,
                        minWidth: 50,
                        cellClass: 'center',
                        maxWidth: 100,
                        cellTemplate: getStatus()
                    },
                    {
                        field: 'more',
                        displayName: '查看',
                        enableSorting: false,
                        minWidth: 30,
                        cellClass: 'center',
                        cellTemplate: more()
                    },
                    {
                        field: 'memo',
                        displayName: '备注',
                        enableSorting: false,
                        minWidth: 30,
                        cellClass: 'center'
                    }
                ]
            };
            getData();
        };
        initialize();
        $scope.$on('$destroy', function () {

        });
    }
]);
