/**
 * Created by zhaohang on 2017/9/27.
 */
angular.module('app').controller('correlationGroupCtrl', ['$window', '$scope', '$timeout', 'NgTableParams', 'dsFcc', 'appPath',
    function ($window, $scope, $timeout, NgTableParams, dsFcc, appPath) {
        $scope.searchModel = {
            pageNum: 1,
            pageSize: 20
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
        // 获取表格数据;
        function getData() {
            var groupTypeData = [];
            for (var j = 0; j < $scope.groupData.groupType.length; j++) {
                if ($scope.groupData.groupType[0]) {
                    groupTypeData.push(1);
                }
                if ($scope.groupData.groupType[1]) {
                    groupTypeData.push(2);
                }
                if ($scope.groupData.groupType[2]) {
                    groupTypeData.push(3);
                }
                if ($scope.groupData.groupType[3]) {
                    groupTypeData.push(4);
                }
            }
            var params = {
                type: 'SCPLATERESGROUP',
                condition: {
                    adminArea: $scope.groupData.adminCode,
                    infoCode: $scope.groupData.infoCode,
                    groupId: $scope.groupData.groupId,
                    groupType: groupTypeData
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
                        temp.disable = ($scope.groupData.existGroupIds.indexOf(temp.groupId) !== -1);
                        ret.push(temp);
                    }
                    total = data.total;
                }
                $scope.gridOptions.totalItems = total;
                $scope.gridOptions.data = ret;
            });
        }
        // 显示序号;
        function getIndex() {
            var html = '<div class="ui-grid-cell-contents">{{(grid.appScope.searchModel.pageNum - 1) * grid.appScope.searchModel.pageSize + row.entity.pageIndex}}</div>';
            return html;
        }
        function groupType() {
            var html = '<div class="ui-grid-cell-contents">{{row.entity.groupType === 1 ? "新增" : row.entity.groupType === 2 ? "删除" : row.entity.groupType === 3 ? "修改" : "已制作"}}</div>';
            return html;
        }
        function formatRow() {
            var html = '<div>' +
              '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ' +
              'class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell"></div>' +
              '</div>';
            return html;
        }
        $scope.searchList = function () {
            getData();
        };
        $scope.connectGroup = function () {
            var groupIds = [];
            var data = $scope.gridOptions.data;
            for (var i = 0; i < data.length; i++) {
                if (data[i].checked) {
                    groupIds.push(data[i].groupId);
                }
            }
            if (groupIds.length === 0) {
                swal('提示', '请选择一个作业组进行关联操作', 'warning');
                return;
            }
            var params = {
                command: 'RELATION',
                type: 'SCPLATERESGROUP',
                objIds: groupIds,
                infoIntelId: $scope.groupData.infoIntelId
            };
            dsFcc.addGroup(params).then(function () {
                $scope.$emit('closeGroupDialog', 'correlationGroup');
                swal('提示', '关联成功', 'success');
            });
        };
        var initialize = function (event, data) {
            $scope.groupData = Object.assign({}, data.data);
            $scope.groupData.infoCode = '';
            $scope.groupData.groupId = '';
            $scope.groupData.groupType = [false, false, false, false];
            $scope.gridOptions = {
                useExternalSorting: true,
                enableColumnMenus: false,
                useExternalPagination: false,
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
                },
                columnDefs: [
                    {
                        field: 'selector',
                        displayName: '选择',
                        width: 50,
                        visible: true,
                        cellTemplate: '<div class="fm-stretch fm-center" style="height: 30px"><input type="checkbox" ng-model="row.entity.checked" class="tableList blue" ng-disabled="row.entity.disable"/></div>'
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
                        cellClass: 'center'
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

        var unbindHandler = $scope.$on('ReloadData-correlationGroup', initialize);
        $scope.$on('$destroy', function (event, data) {

        });
    }
]);
