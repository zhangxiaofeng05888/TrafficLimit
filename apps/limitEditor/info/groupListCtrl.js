/**
 * 返回情报列表界面
 * @author zhaohang
 * @date   2017/9/21
 * @param  {object} $window 窗口
 * @param  {object} $scope 作用域
 * @param  {object} $timeout 定时
 * @param  {object} NgTableParams 构造函数
 * @param  {object} dsFcc 接口服务
 * @param  {object} appPath app路径
 * @param  {object} $ocLazyLoad 延迟加载
 * @param  {object} dsManage 管理
 * @param  {object} dsLazyload 延迟加载
 * @return {undefined}
 */
angular.module('app').controller('groupListCtrl', ['$window', '$scope', '$timeout', 'NgTableParams', 'dsFcc', 'appPath', '$ocLazyLoad', 'dsManage', 'dsLazyload',
    function ($window, $scope, $timeout, NgTableParams, dsFcc, appPath, $ocLazyLoad, dsManage, dsLazyload) {
        if (!$scope.testLogin()) {
            return;
        }
        $scope.searchModel = {
            pageNum: 1,
            pageSize: 20
        };
        $scope.PageViewPoint = {
            x: document.documentElement.clientWidth / 2,
            y: document.documentElement.clientHeight / 2
        };
        /**
         * 调用地址返回情报列表
         * @method backInfoList
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {undefined}
         */
        $scope.backInfoList = function () {
            window.location.href = '#/main?access_token=' + App.Temp.accessToken + '&random=' + Math.floor(Math.random() * 100);
        };
        /**
         * 根据实际的行高设置每行的height属性，主要处理grid高度改变后，canvas的高度没有自动变化的问题
         * @author Niuxinyi
         * @date   2017-11-16
         * @param  {object} rows 主要为要显示的信息行列
         * @return {object} rows 包含行高
         */
        var myRowProc = function (rows) {
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
        /**
         * 对弹出框进行位置、大小、视口、最小化、关闭、模态框等进行基本的管理设置
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {undefined}
         */
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
            container: 'groupListContainer',
            viewport: 'groupListContainer',
            minimizable: false,
            closable: true,
            modal: false
        };
        /**
         * 对弹出框大小、位置进行设置
         * @author Niuxinyi
         * @date   2017-11-16
         * @param  {object} dlgOption 包含弹出框选项
         * @param  {object} width 包含宽度
         * @param  {object} height 包含高度
         * @param  {object} model 包含模型
         * @return {undefined}
         */
        var getDlgOption = function (dlgOption, width, height, model) {
            dlgOption.modal = model;
            dlgOption.size.width = width;
            dlgOption.size.height = height;
            dlgOption.position.x = $scope.PageViewPoint.x - width / 2;
            dlgOption.position.y = $scope.PageViewPoint.y - height / 2;
        };
        /**
         * 对于不同种类弹框大小区分
         * @author Niuxinyi
         * @date   2017-11-16
         * @param  {object} type 包含弹出框类型
         * @param  {object} dlgOption 包含弹出框选项
         * @return {undefined}
         */
        var getDlgOptions = function (type, dlgOption) {
            switch (type) {
                case 'addGroup':
                    getDlgOption(dlgOption, 400, 300, true);
                    break;
                case 'editGroup':
                    getDlgOption(dlgOption, 400, 300, true);
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
         * @return {item} 包含窗口标题、页面片段的信息的窗口对象
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
        /**
         * 打开弹出窗口对象
         * @method openDialog
         * @author Niuxinyi
         * @date   2017-11-16
         * @param  {object} dlg 弹出框消息,主要为要显示的弹出框信息
         * @param  {object} dlgKey 对应的键值，主要为要显示的弹出框信息
         * @return {undefined}
         */
        $scope.openDialog = function (dlg, dlgKey) {
            $scope.dialogManager[dlgKey].handler = dlg;
        };
        /**
         * 关闭弹出窗口对象
         * @method closeDialog
         * @author Niuxinyi
         * @date   2017-11-16
         * @param  {object} dlgKey 弹出框对应的键值，主要为要关闭弹出框
         * @return {undefined}
         */
        $scope.closeDialog = function (dlgKey) {
            delete $scope.dialogManager[dlgKey];
        };
        /**
         * 显示弹出窗口对象
         * @method showInDialog
         * @author Niuxinyi
         * @date   2017-11-16
         * @param  {object} data 窗口数据
         * @return {undefined}
         */
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
        /**
         * 获取表格数据
         * @method getData
         * @author Niuxinyi
         * @date   2017-11-16
         * @param  {object} data 表格数据
         * @return {undefined}
         */
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
                    let cityName = '';
                    let adAdmin = data.data[0].adAdmin;
                    for (let i = 0; i < CityList.length; i++) {
                        for (let j = 0; j < CityList[i].city.length; j++) {
                            if (CityList[i].city[j].id == adAdmin) {
                                cityName = CityList[i].city[j].name;
                                break;
                            }
                        }
                    }
                    for (var i = 0, len = data.data.length; i < len; i++) {
                        var temp = data.data[i];
                        temp.pageIndex = i + 1;
                        temp.checked = false;
                        temp.cityName = cityName;
                        temp.cityId = App.Temp.infoToGroupData.cityId;
                        ret.push(temp);
                    }
                    total = data.total;
                }
                $scope.gridOptions.totalItems = total;
                $scope.gridOptions.data = ret;
            });
        }
        /**
         * 新增弹出框显示新增记录
         * @method addGroupList
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {undefined}
         */
        $scope.addGroupList = function () {
            showInDialog({ type: 'addGroup' });
        };
        /**
         * 对数据进行编辑及编辑弹出框显示编辑记录
         * @method editGroupList
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {undefined}
         */
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
            if (selectNum > 1) {
                swal('提示', '只能对一条作业组进行编辑', 'warning');
                return;
            }
            if (selectNum === 0) {
                swal('提示', '请选择一条作业组进行编辑', 'warning');
                return;
            }
            showInDialog({ type: 'editGroup', data: selectData });
        };
        /**
         * 对数据进行关联操作
         * @method correlationGroup
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {undefined}
         */
        $scope.correlationGroup = function () {
            var data = $scope.gridOptions.data;
            var groupIds = [];
            for (var i = 0; i < data.length; i++) {
                groupIds.push(data[i].groupId);
            }
            showInDialog({ type: 'correlationGroup',
                data: {
                    adminCode: App.Temp.infoToGroupData.cityId,
                    cityName: App.Temp.infoToGroupData.cityName,
                    infoIntelId: App.Temp.infoToGroupData.infoId,
                    existGroupIds: groupIds
                } });
        };
        /**
         * 对数据进行删除操作判断，提示删除成功
         * @method deleteGroup
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {undefined}
         */
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
        /**
         * 数据的详细地图界面的打开操作，进入单条数据的地图界面
         * @method openMap
         * @author Niuxinyi
         * @date   2017-11-16
         * @param  {object} row 每条数据的行 data 包括数据的id、数据的几何
         * @return {undefined}
         */
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
                    window.location.href = '#/editor?access_token=' + App.Temp.accessToken + '&random=' + Math.floor(Math.random() * 100);
                    App.Util.setSessionStorage('DbId', sessionData);
                }
            });
        };
        /**
         * 获取序号
         * @method getIndex
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {object} html 包含序号，显示在页面
         */
        function getIndex() {
            var html = '<div class="ui-grid-cell-contents">{{(grid.appScope.searchModel.pageNum - 1) * grid.appScope.searchModel.pageSize + row.entity.pageIndex}}</div>';
            return html;
        }
        /**
         * 获取组号，点击组号，进入对应的地图界面
         * @method formatRow
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {object} html 包含组号，显示在页面
         */
        function formatRow() {
            var html = '<div class="ui-grid-cell-contents" ng-click="grid.appScope.openMap(row)">{{row.entity.groupId}}</div>';
            return html;
        }
        /**
         * 获取类型，根据row.entity.groupType的值进行判断
         * @method groupType
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {object} html 包含类型，显示在页面
         */
        function groupType() {
            var html = '<div class="ui-grid-cell-contents">{{row.entity.groupType === 1 ? "新增" : row.entity.groupType === 2 ? "删除" : row.entity.groupType === 3 ? "修改" : "已制作"}}</div>';
            return html;
        }
        /**
         * 获取限制规定，内容截取0至24显示
         * @method getRule
         * @author Niuxinyi
         * @date   2017-11-16
         *@return {object} html 包含限制规定，显示在页面
         */
        function getRule() {
            var html = '<div class="ui-grid-cell-contents" title="{{row.entity.principle}}">{{row.entity.principle.substring(0, 24)}}</div>';
            return html;
        }
        /**
         * 初始化表格;
         * @method initialize
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {undefined}
         */
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
                    gridApi.grid.registerRowsProcessor(myRowProc);
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
                        cellClass: 'center',
                        cellTemplate: getRule()
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
        $scope.$on('closeGroupDialog', function (event, data) {
            $scope.closeDialog(data);
            getData();
        });
        $scope.$on('$destroy', function () {

        });
    }
]);
