/**
 * Created by zhongxiaoming on 2017/5/17.
 */
/**
 * Created by mali on 2016/8/15.
 */
angular.module('app').controller('checkInfoTipsCtl', ['$scope', '$ocLazyLoad', 'NgTableParams', 'ngTableEventsChannel', 'appPath', '$interval',
    function ($scope, $ocLazyLoad, NgTableParams, ngTableEventsChannel, appPath, $interval) {
        $scope.loadTableDataMsg = '数据加载中...';

        $scope.dealError = function (value) {
            alert(value);
        };
        var dsTips = fastmap.service.DataServiceTips.getInstance();
        $scope.operateOptions = [
            {
                id: 0,
                label: ' 未修改'
            },
            {
                id: 1,
                label: ' 例外'
            },
            {
                id: 2,
                label: ' 确认不修改'
            },
            {
                id: 3,
                label: ' 确认已修改'
            }
        ];

        $scope.initType = 0;
        function htmlValue(self, row) {
            var html = '';
            if (row.severity == 0 && row.status == 0) {
                html = '<a ng-click="dealError(row)"><em>忽略</em></a>';
            } else if (row.severity == 1) {
                html = '<span ">不可忽略</span>';
            } else if (row.status == 1) {
                html = '<span ">已忽略</span>';
            }
            return html;
        }

        $scope.dealError = function (row) {
            dsTips.dealCheckResult(row.id, 1, 1).then(function () {
                $scope.refreshData();
            });
        };

        $scope.location = function (row) {
            $scope.$emit('locationError', row);
        };

        $scope.confirmResult = function (row) {
            $scope.$emit('confirmResult', row);
        };

        // 初始化ng-table表头
        $scope.nameGroupTableCols = [
            {
                field: 'num_index',
                title: '序号',
                width: '35',
                show: true
            },
            {
                field: 'errLevel',
                title: '等级',
                width: '35',
                show: true
            },
            {
                field: 'ruleId',
                title: '规则代码',
                width: '35',
                show: true
            },
            {
                field: 'errMsg',
                title: '错误描述',
                width: '200',
                show: true
            },
            {
                field: '',
                title: '操作',
                width: '35',
                show: true,
                html: true,
                getValue: htmlValue
            }
        ];


        // 表格配置搜索;
        $scope.filters = {
            name: ''
        };
        // 初始化ng-table表格
        function initNameGroupTable() {
            $scope.nameGroupTableParams = new NgTableParams({
                page: 1,
                count: 10,
                filter: $scope.filters
            }, {
                counts: [10, 15, 20, 25],
                paginationMaxBlocks: 5,
                paginationMinBlocks: 2,
                getData: function ($defer, params) {
                    dsTips.getCheckResult(parseInt(App.Temp.subTaskId, 10), params.page(), params.count()).then(function (data) {
                        $scope.loadTableDataMsg = '列表无数据';
                        $scope.nameGroupList = data.result;
                        $scope.nameGroupTableParams.total(data.total);
                        $defer.resolve(data.result);
                    });
                }
            });
        }
        initNameGroupTable();
        // 刷新表格方法;
        $scope.refreshData = function () {
            $scope.nameGroupTableParams.reload();
        };
        // 给每条数据安排序号;
        ngTableEventsChannel.onAfterReloadData(function () {
            $scope.itemActive = -1;
            angular.forEach($scope.nameGroupTableParams.data, function (data, index) {
                data.num_index = ($scope.nameGroupTableParams.page() - 1) * $scope.nameGroupTableParams.count() + index + 1;
            });
        });
        // 向主界面发送当前查询的子界面类型
        $scope.selectVal = function (row, index, type) {
            $scope.$emit('SUBCTLTYPECHANGE', { flag: $scope.roadNameFlag, data: row });
        };

        $scope.$on('refreshCheckResultTable', function () {
            $scope.refreshData();
        });
    }
]);
