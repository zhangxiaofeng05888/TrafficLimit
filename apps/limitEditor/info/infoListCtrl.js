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
        $scope.PageViewPoint = {
            x: document.documentElement.clientWidth / 2,
            y: document.documentElement.clientHeight / 2
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
            $scope.showFlag = false;
        };
        $ocLazyLoad.load('./info/groupListCtrl.js').then(function () {
            $scope.groupUrl = './info/groupListTpl.html';
        });
        $scope.updateInfo = function (index, row) {
            var params = {
                command: 'UPDATE',
                type: 'SCPLATERESINFO',
                infoIntelId: row.entity.infoIntelId,
                data: {
                    objStatus: 'UPDATE'
                }
            };
            var params1 = [{
                infoIntelId: row.entity.infoIntelId,
                condition: row.entity.condition,
                complete: row.entity.complete,
                memo: row.entity.memo
            }];
            if (index === 1) {
                params.data.condition = row.entity.condition;
            } else {
                params.data.complete = row.entity.complete;
            }
            dsFcc.updateToInfoDepartments(params1).then(function (data) {
                dsFcc.updateInfoList(params).then(function (data1) {
                    getData();
                });
            });
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
            var html = '<div class="ui-grid-cell-contents"><select class="tl_list_select_small" ng-options="value.id as value.label for value in grid.appScope.statusData" ng-model="row.entity.complete" ng-change="grid.appScope.updateInfo(2, row)"></select></div>';
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

        $scope.dialogManager = {};
        var defaultDialogOptions = {
            position: {
                x: $scope.PageViewPoint.x - 300,
                y: $scope.PageViewPoint.y - 150
            },
            size: {
                width: 600,
                height: 300
            },
            container: 'infoListContainer',
            viewport: 'infoListContainer',
            minimizable: false,
            closable: true,
            modal: false
        };

        // 弹出框大小设置
        var getDlgOption = function (dlgOption, width, height, model) {
            dlgOption.modal = model;
            dlgOption.size.width = width;
            dlgOption.size.height = height;
            dlgOption.position.x = $scope.PageViewPoint.x - width / 2;
            dlgOption.position.y = $scope.PageViewPoint.y - height / 2;
        };

        // 对于不同种类弹框大小区分
        var getDlgOptions = function (type, dlgOption) {
            switch (type) {
                case 'addGroup':
                    getDlgOption(dlgOption, 400, 220, true);
                    break;
                case 'editGroup':
                    getDlgOption(dlgOption, 400, 250, true);
                    break;
                case 'correlationGroup':
                    getDlgOption(dlgOption, 900, 500, true);
                    break;
                default:
                    break;
            }
        };

        /**
         * 根据的窗口的选项，创建弹出窗口对象
         * @method createDialog
         * @author ChenXiao
         * @date   2017-09-11
         * @param  {object} data 窗口选项，主要为要显示的信息类型
         * @return {object} 包含窗口标题、页面片段的信息的窗口对象
         */
        var createDialog = function (data) {
            var item = {};
            var tmplFile = FM.uikit.Config.getUtilityTemplate(data.type);
            item.title = FM.uikit.Config.getUtilityName(data.type);
            item.ctrl = appPath.scripts + tmplFile.ctrl;
            item.tmpl = appPath.scripts + tmplFile.tmpl;
            item.options = FM.Util.clone(defaultDialogOptions);
            getDlgOptions(data.type, item.options);

            return item;
        };

        $scope.openDialog = function (dlg, dlgKey) {
            $scope.dialogManager[dlgKey].handler = dlg;
        };

        $scope.closeDialog = function (dlgKey) {
            delete $scope.dialogManager[dlgKey];
        };

        var showInDialog = function (data) {
            var dlgKey = data.type;
            if ($scope.dialogManager[dlgKey]) {
                $scope.$broadcast('ReloadData-' + dlgKey, data);
                $scope.dialogManager[dlgKey].handler.selectWindow();
            } else {
                var item = createDialog(data);
                $ocLazyLoad.load([item.ctrl, item.tmpl]).then(function () {
                    $scope.dialogManager[dlgKey] = item;
                    dsLazyload.testHtmlLoad($scope, item.tmpl).then(function () {
                        $scope.$broadcast('ReloadData-' + dlgKey, data);
                    });
                });
            }
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
        };
        initialize();
        $scope.$on('backInfoList', function (event, data) {
            $scope.showFlag = true;
        });
        $scope.$on('closeGroupDialog', function (event, data) {
            $scope.closeDialog(data);
            $scope.$broadcast('refreshGroupList');
        });
        $scope.$on('openDialog', function (event, data) {
            showInDialog({
                type: data.panelName,
                data: data.data
            });
        });
        $scope.$on('$destroy', function () {

        });
    }
]);
