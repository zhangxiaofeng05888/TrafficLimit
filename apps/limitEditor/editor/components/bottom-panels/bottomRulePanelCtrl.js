/**
 * 编辑策略表底面
 * @author zhaohang
 * @date   2017/10/11
 * @param  {object} $scope 作用域
 * @param  {object} $rootScope 底部作用域
 * @param  {object} dsLazyload 延时加载
 * @param  {object} appPath app路径
 * @param  {object} dsFcc 接口服务
 * @param  {object} $timeout 定时
 * @return {undefined}
 */
angular.module('app').controller('RuleBottomViewPanelCtrl', ['$scope', '$rootScope', 'dsLazyload', 'appPath', 'dsFcc', '$timeout',
    function ($scope, $rootScope, dsLazyload, appPath, dsFcc, $timeout) {
        $scope.searchModel = {
            pageNum: 1,
            pageSize: 20
        };
        /**
         * rule新增
         * @method addRule
         * @author zhangxiaofeng
         * @date   2018-07-21
         * @return {undefined}
         */
        $scope.addRule = function () {
            $scope.$emit('ShowInfoPage', {
                type: 'addRule'
            });
        };
        /**
         * 策略表编辑
         * @method editPolicy
         * @author Niuxinyi
         * @date   2017-11-20
         * @return {undefined}
         */
        $scope.editRule = function () {
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
                swal('提示', '请选择一个策略信息进行编辑操作', 'warning');
                return;
            }
            $scope.$emit('ShowInfoPage', {
                type: 'editRule',
                data: selectData
            });
        };
        $scope.vehicle = {
            1: '客车',
            2: '货车'
        };
        $scope.attribution = {
            1: '本地',
            2: '外埠'
        };
        /**
         * 根据实际的行高设置每行的height属性，主要处理grid高度改变后，canvas的高度没有自动变化的问题
         * @author Niuxinyi
         * @date   2017-11-20
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
         * 获取表格数据
         * @method getData
         * @author Niuxinyi
         * @date   2017-11-20
         * @return {undefined}
         */
        function getData() {
            var params = {
                type: 'SCPLATERESMANOEUVRE',
                condition: {
                    groupId: App.Temp.groupId
                }
            };
            dsFcc.getPolicyList(params).then(function (data) {
                var ret = [];
                var total = 0;
                if (data.data && data.data.length !== 0 && data != -1) {
                    for (var i = 0, len = data.data.length; i < len; i++) {
                        var temp = data.data[i];
                        temp.pageIndex = i + 1;
                        temp.checked = false;
                        temp.originVehicleName = FM.Util.clone(temp.vehicle);
                        temp.vehicleName = changeVehicle(temp.vehicle);
                        temp.originAttributionName = FM.Util.clone(temp.attribution);
                        temp.attributionName = changeAttribution(temp.attribution);
                        temp.originTailNumberName = FM.Util.clone(temp.tailNumber);
                        temp.tailNumberName = changeTailNumber(temp.tailNumber);
                        temp.originGasEmisstand = FM.Util.clone(temp.gasEmisstand);
                        temp.gasEmisstand = changeGasEmisstand(temp.gasEmisstand);
                        temp.originPlatecolorName = FM.Util.clone(temp.platecolor);
                        temp.platecolorName = changePlatecolor(temp.platecolor);
                        temp.originEnergyTypeName = FM.Util.clone(temp.energyType);
                        temp.energyTypeName = changeEnergyType(temp.energyType);
                        temp.originResDatetypeName = FM.Util.clone(temp.resDatetype);
                        temp.resDatetypeName = changeResDatetype(temp.resDatetype);
                        temp.originSpecFlagName = FM.Util.clone(temp.specFlag);
                        temp.specFlagName = changeSpecFlag(temp.specFlag);
                        ret.push(temp);
                    }
                    total = data.total;
                }
                $scope.gridOptions.totalItems = total;
                $scope.gridOptions.data = ret;
            });
        }
        /**
         * 关闭策略表
         * @method closePolicy
         * @author Niuxinyi
         * @date   2017-11-20
         * @return {undefined}
         */
        $scope.closePolicy = function () {
            $scope.$emit('CloseBottomPolicyPanel');
        };
        /**
         * 策略表中删除操作
         * @method deletePolicy
         * @author Niuxinyi
         * @date   2017-11-20
         * @return {undefined}
         */
        $scope.deletePolicy = function () {
            var groupIds = [];
            var data = $scope.gridOptions.data;
            for (var i = 0; i < data.length; i++) {
                if (data[i].checked) {
                    groupIds.push(data[i].manoeuvreId);
                }
            }
            if (groupIds.length === 0) {
                swal('提示', '请选择一个策略信息进行删除操作', 'warning');
                return;
            }
            var params = {
                command: 'DELETE',
                type: 'SCPLATERESMANOEUVRE',
                objId: groupIds,
                groupId: App.Temp.groupId
            };
            dsFcc.addGroup(params).then(function () {
                getData();
                swal('提示', '删除成功', 'success');
            });
        };
        /**
         * 策略表复制
         * @method editPolicy
         * @author Niuxinyi
         * @date   2017-11-20
         * @return {undefined}
         */
        $scope.copyPolicy = function () {
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
                swal('提示', '请选择一个策略信息进行复制操作', 'warning');
                return;
            }
            var params = {
                command: 'CREATE',
                type: 'SCPLATERESMANOEUVRE',
                data: {
                    groupId: App.Temp.groupId
                }
            };
            params.data.vehicle = selectData.originVehicleName;
            params.data.seatnum = selectData.seatnum;
            params.data.attribution = selectData.originAttributionName;
            params.data.tempPlate = selectData.tempPlate;
            if (selectData.tempPlate === 1) {
                params.data.tempPlateNum = selectData.tempPlateNum;
            }
            if (selectData.restrict) {
                params.data.restrict = selectData.restrict;
            }
            params.data.charSwitch = selectData.charSwitch;
            if (selectData.charSwitch === 1) {
                params.data.charToNum = selectData.charToNum;
            }
            params.data.tailNumber = selectData.originTailNumberName;
            params.data.energyType = selectData.originEnergyTypeName;
            params.data.gasEmisstand = selectData.originGasEmisstand;
            params.data.platecolor = selectData.originPlatecolorName;
            params.data.vehicleLength = selectData.vehicleLength;
            params.data.vehicleWidth = selectData.vehicleWidth;
            params.data.vehicleHigh = selectData.vehicleHigh;
            params.data.resWeigh = selectData.resWeigh;
            params.data.resAxleLoad = selectData.resAxleLoad;
            params.data.resAxleCount = selectData.resAxleCount;
            params.data.tempPlate = selectData.tempPlate;
            var startDate = selectData.startDate;
            var endDate = selectData.endDate;
            if (startDate) {
                params.data.startDate = startDate.replace(new RegExp(/(-)/g), '');
            }
            if (endDate) {
                params.data.endDate = endDate.replace(new RegExp(/(-)/g), '');
            }
            params.data.resDatetype = selectData.originResDatetypeName;
            if (selectData.time) {
                params.data.time = selectData.time;
            }
            if (selectData.originSpecFlagName.length !== 0) {
                params.data.specFlag = selectData.originSpecFlagName;
            }
            dsFcc.addGroup(params).then(function () {
                getData();
                swal('提示', '复制成功', 'success');
            });
        };
        /**
         * 策略表字段检查
         * @method checkPolicy
         * @author Wangchunmei
         * @date   2018-02-28
         * @return {undefined}
         */
        $scope.checkPolicy = function () {
            $scope.$emit('ShowInfoPage', {
                type: 'policyColumnCheck'
            });
        }
        $scope.lookCheckPolicy = function () {
            $scope.$emit('ShowInfoPage', {
                type: 'policyColumnCheckResult'
            });
        }
        /**
         * 初始化数据
         * @author Niuxinyi
         * @date   2017-11-20
         * @param {object} event 包括事件
         * @param {object} data 包括数据
         * @return {undefined}
         */
        var initialize = function (event, data) {
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
                        cellTemplate: '<div class="fm-stretch fm-center" style="height: 30px"><input type="checkbox" ng-model="row.entity.checked" class="fm-control blue"/></div>'
                    },
                    {
                        field: 'id',
                        displayName: '规则ID',
                        enableSorting: false,
                        width: 50
                    },
                    {
                        field: 'groupId',
                        displayName: '组号',
                        enableSorting: false,
                        minWidth: 80,
                        cellClass: 'center'
                    },
                    {
                        field: 'vehicleName',
                        displayName: '策略号',
                        enableSorting: false,
                        minWidth: 50,
                        cellClass: 'center'
                    },
                    {
                        field: 'seatnum',
                        displayName: '策略组号',
                        enableSorting: false,
                        minWidth: 100,
                        cellClass: 'center'
                    },
                    {
                        field: 'attributionName',
                        displayName: '行政区划',
                        enableSorting: false,
                        minWidth: 100,
                        cellClass: 'center'
                    },
                    {
                        field: 'restrict',
                        displayName: '车辆类型',
                        enableSorting: false,
                        minWidth: 100,
                        cellClass: 'center'
                    },
                    {
                        field: 'tempPlate',
                        displayName: '本外埠',
                        enableSorting: false,
                        minWidth: 100,
                        cellClass: 'center'
                    },
                    {
                        field: 'tempPlateNum',
                        displayName: '限行描述',
                        enableSorting: false,
                        minWidth: 100,
                        cellClass: 'center'
                    }
                ]
            };
            setTimeout(function () {
                getData();
                $scope.$apply();
            });
        };

        $scope.$on('BottomRulePanelReload', initialize);
        $scope.$on('refreshPolicyList', function () {
            getData();
        });

        $scope.$on('$destroy', function () {

        });
    }
]);
