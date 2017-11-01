/**
 * Created by zhaohang on 2017/9/21.
 */
angular.module('app').controller('groupListCtrl', ['$window', '$scope', '$timeout', 'NgTableParams', 'dsFcc', 'appPath', '$ocLazyLoad', 'dsManage',
    function ($window, $scope, $timeout, NgTableParams, dsFcc, appPath, $ocLazyLoad, dsManage) {
        $scope.searchModel = {
            pageNum: 1,
            pageSize: 20
        };
        $scope.backInfoList = function () {
            $scope.$emit('backInfoList');
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
        // 获取表格数据;
        function getData() {
            var params = {
                type: 'SCPLATERESGROUP',
                condition: {
                    infoIntelId: App.Temp.infoToGroupData.infoId
                }
            };
            dsFcc.getGroupList(params).then(function (data) {
                var ret = [];
                var total = 0;
                if (data.data && data.data.length !== 0 && data != -1) {
                    for (var i = 0, len = data.data.length; i < len; i++) {
                        var temp = data.data[i];
                        temp.pageIndex = i + 1;
                        temp.checked = false;
                        temp.cityName = App.Temp.infoToGroupData.cityName;
                        temp.cityId = App.Temp.infoToGroupData.cityId;
                        ret.push(temp);
                    }
                    total = data.total;
                }
                $scope.gridOptions.totalItems = total;
                $scope.gridOptions.data = ret;
            });
        }

        $scope.addGroupList = function () {
            $scope.$emit('openDialog', {
                panelName: 'addGroup'
            });
        };
        $scope.editGroupList = function () {
            var data = $scope.gridOptions.data;
            var selectNum = 0;
            var selectData = null;
            for (var i = 0; i < data.length; i++) {
                if (data[i].checked) {
                    selectNum += 1;
                    selectData = data[i];
                }
            }
            if (selectNum !== 1) {
                swal('提示', '请选择一个作业组进行编辑操作', 'warning');
                return;
            }
            $scope.$emit('openDialog', {
                panelName: 'editGroup',
                data: selectData
            });
        };
        $scope.correlationGroup = function () {
            var data = $scope.gridOptions.data;
            var groupIds = [];
            for (var i = 0; i < data.length; i++) {
                groupIds.push(data[i].groupId);
            }
            $scope.$emit('openDialog', {
                panelName: 'correlationGroup',
                data: {
                    adminCode: App.Temp.infoToGroupData.cityId,
                    cityName: App.Temp.infoToGroupData.cityName,
                    infoIntelId: App.Temp.infoToGroupData.infoId,
                    existGroupIds: groupIds
                }
            });
        };
        $scope.deleteGroup = function () {
            var groupIds = [];
            var data = $scope.gridOptions.data;
            for (var i = 0; i < data.length; i++) {
                if (data[i].checked) {
                    groupIds.push(data[i].groupId);
                }
            }
            if (groupIds.length === 0) {
                swal('提示', '请选择一个作业组进行删除操作', 'warning');
                return;
            }
            var params = {
                command: 'DELETE',
                type: 'SCPLATERESGROUP',
                objIds: groupIds
            };
            dsFcc.addGroup(params).then(function () {
                getData();
                swal('提示', '删除成功', 'success');
            });
        };
        $scope.openMap = function (row) {
            var params = {
                adminCode: App.Temp.infoToGroupData.cityId
            };
            dsFcc.getCityGeometry(params).then(function (data) {
                if (data) {
                    App.Temp.dbId = data.dbId;
                    App.Temp.groupId = row.entity.groupId;
                    App.Temp.cityGeometry = data.geometry;
                    var sessionData = {
                        dbId: data.dbId,
                        groupId: row.entity.groupId,
                        cityGeometry: data.geometry
                    };
                    window.location.href = '#/editor';
                    App.Util.setSessionStorage('DbId', sessionData);
                }
            });
        };
        // 显示序号;
        function getIndex() {
            var html = '<div class="ui-grid-cell-contents">{{(grid.appScope.searchModel.pageNum - 1) * grid.appScope.searchModel.pageSize + row.entity.pageIndex}}</div>';
            return html;
        }

        function formatRow() {
            var html = '<div class="ui-grid-cell-contents" ng-click="grid.appScope.openMap(row)">{{row.entity.groupId}}</div>';
            return html;
        }

        function groupType() {
            var html = '<div class="ui-grid-cell-contents">{{row.entity.groupType === 1 ? "新增" : row.entity.groupType === 2 ? "删除" : row.entity.groupType === 3 ? "修改" : "已制作"}}</div>';
            return html;
        }

        // 初始化表格;
        var initialize = function () {
            $scope.gridOptions = {
                useExternalSorting: true,
                enableColumnMenus: false,
                useExternalPagination: false,
                enableFullRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect: false,
                modifierKeysToMultiSelect: false,
                noUnselect: false,
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    // 处理改变列表高度后，滚动条跳动的问题
                    gridApi.grid.registerRowsProcessor(myRowProc, 200);
                },
                columnDefs: [
                    {
                        field: 'selector',
                        displayName: '选择',
                        width: 50,
                        visible: true,
                        cellTemplate: '<div class="fm-stretch fm-center" style="height: 30px"><input type="checkbox" ng-model="row.entity.checked" class="tableList blue"/></div>'
                    },
                    {
                        field: 'id',
                        displayName: '序号',
                        enableSorting: false,
                        maxWidth: 50,
                        cellTemplate: getIndex()
                    },
                    {
                        field: 'groupId',
                        displayName: '组号',
                        enableSorting: false,
                        minWidth: 100,
                        cellClass: 'center',
                        cellTemplate: formatRow()
                    },
                    {
                        field: 'cityName',
                        displayName: '行政区划',
                        enableSorting: false,
                        minWidth: 50,
                        cellClass: 'center'
                    },
                    {
                        field: 'groupType',
                        displayName: '类型',
                        enableSorting: false,
                        minWidth: 100,
                        cellClass: 'center',
                        cellTemplate: groupType()
                    },
                    {
                        field: 'principle',
                        displayName: '限制规定',
                        enableSorting: false,
                        minWidth: 100,
                        cellClass: 'center'
                    },
                    {
                        field: 'uDate',
                        displayName: '更新时间',
                        enableSorting: false,
                        minWidth: 50,
                        cellClass: 'center'
                    }
                ]
            };
            getData();
        };

        initialize();
        $scope.$on('refreshGroupList', function () {
            getData();
        });
        $scope.$on('$destroy', function () {

        });
    }
]);
