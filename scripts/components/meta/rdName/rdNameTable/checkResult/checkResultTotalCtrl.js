/**
 * Created by mali on 2017/4/8.
 * 检查结果统计界面
 */
angular.module('app').controller('checkResultTotalCtrl', ['$scope', '$interval', 'dsMeta', 'NgTableParams', 'ngTableEventsChannel',
    function ($scope, $interval, dsMeta, NgTableParams, ngTableEventsChannel) {
        $scope.checkRuleList = [];
        $scope.pageSize = 10;
        $scope.page = 1;
        $scope.dataLoading = true;
        $scope.currentBoxIndex = 0;
        $scope.totalWay = {
            rule: '规则号',
            information: '描述',
            adminName: '行政区划',
            level: '重要等级'
        };
        $scope.filterParam = [];
        $scope.totalWayChange = function (event) {
            if (event.target.checked) {
                if ($scope.filter.filterParam.indexOf(event.target.value) == -1) {
                    $scope.filter.filterParam.push(event.target.value);
                }
            } else {
                for (var a = 0; a < $scope.filter.filterParam.length; a++) {
                    if ($scope.filter.filterParam[a] == event.target.value) {
                        $scope.filter.filterParam.splice(a, 1);
                    }
                }
            }
            for (var j = 0; j < $scope.cols.length; j++) {
                if ($scope.cols[j].field != 'selector' && $scope.cols[j].field != 'count') {
                    $scope.cols[j].show = false;
                }
                for (var i = 0; i < $scope.filter.filterParam.length; i++) {
                    if ($scope.cols[j].field == $scope.filter.filterParam[i] || $scope.cols[j].field.indexOf($scope.filter.filterParam[i]) > -1) {
                        $scope.cols[j].show = true;
                    }
                }
            }
        };


        $scope.cols = [
            {
                field: 'selector',
                title: '选择',
                headerTemplateURL: 'headerCheckbox.html',
                width: '20px',
                show: true
            },
            {
                field: 'ruleName',
                title: '检查项',
                width: '40px',
                show: false
            },
            {
                field: 'ruleid',
                title: '规则号',
                width: '40px',
                show: false
            },
            {
                field: 'information',
                title: '描述',
                width: '',
                show: false
            },
            {
                field: 'level',
                title: '重要等级',
                width: '60px',
                show: false
            },
            {
                field: 'adminName',
                title: '行政区划',
                width: '60px',
                show: false
            },
            {
                field: 'count',
                title: '数量',
                width: '40px',
                sortable: 'count',
                show: true
            }
        ];
        // 表格配置过滤条件
        $scope.filter = {
            filterParam: []
        };
        function initCheckResultStatisTable() {
            $scope.tableParams = new NgTableParams({
                page: 1,
                count: 20,
                filter: $scope.filter
            }, {
                counts: [],
                getData: function ($defer, params) {
                    var param = {
                        taskName: $scope.taskName,
                        data: params.filter().filterParam
                    };
                    $scope.loadingCheckRstTotalData = true;
                    dsMeta.checkResultsStatis(param).then(function (data) {
                        $scope.loadingCheckRstTotalData = false;
                        $defer.resolve(data.data);
                    });
                }
            });
        }

        // 给每条数据安排序号;
        ngTableEventsChannel.onAfterReloadData(function () {
            $scope.itemActive = -1;
            angular.forEach($scope.tableParams.data, function (data, index) {
                data.num_index = ($scope.tableParams.page() - 1) * $scope.tableParams.count() + index + 1;
                data.checked = false;
            });
        });

        initCheckResultStatisTable();
    }
]);
