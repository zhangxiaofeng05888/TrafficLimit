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
angular.module('app').controller('PolicyBottomViewPanelCtrl', ['$scope', '$rootScope', 'dsLazyload', 'appPath', 'dsFcc', '$timeout',
    function ($scope, $rootScope, dsLazyload, appPath, dsFcc, $timeout) {
        $scope.searchModel = {
            pageNum: 1,
            pageSize: 20
        };
        /**
         * 策略表新增
         * @method addPolicy
         * @author Niuxinyi
         * @date   2017-11-20
         * @return {undefined}
         */
        $scope.addPolicy = function () {
            $scope.$emit('ShowInfoPage', {
                type: 'addPolicy'
            });
        };
        /**
         * 策略表编辑
         * @method editPolicy
         * @author Niuxinyi
         * @date   2017-11-20
         * @return {undefined}
         */
        $scope.editPolicy = function () {
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
                type: 'editPolicy',
                data: selectData
            });
        };
        $scope.vehicle = {
            1: '客车',
            2: '微型货车',
            3: '轻型货车',
            4: '中型货车',
            5: '重型货车',
            6: '全挂牵引车',
            7: '半挂牵引车',
            8: '半挂车',
            9: '全挂车',
            10: '专用汽车',
            11: '其他货车'
        };
        $scope.attribution = {
            1: '外地车(有通行证)',
            2: '外地车(无通行证)',
            3: '本地车(有通行证)',
            4: '本地车(无通行证)',
            5: '受限本地车(如京G)',
            6: '非香港车辆(含粤牌)',
            7: '非澳门车辆(含粤牌)'
        };
        $scope.tailNumber = {
            0: '0',
            1: '1',
            2: '2',
            3: '3',
            4: '4',
            5: '5',
            6: '6',
            7: '7',
            8: '8',
            9: '9',
            '26个字母': '26个英文字母'
        };
        $scope.gasEmisstand = {
            0: '未限制',
            1: '国Ⅰ',
            2: '国Ⅱ',
            3: '国Ⅲ',
            4: '国Ⅳ',
            5: '国Ⅴ'
        };
        $scope.platecolor = {
            1: '蓝牌',
            2: '黄牌',
            3: '黑牌',
            4: '白牌',
            5: '绿牌(新能源、农用车)',
            6: '预留'
        };
        $scope.energyType = {
            1: '燃油',
            2: '油电',
            3: '纯电'
        };
        $scope.resDatetype = {
            1: '连续时间',
            2: '星期一',
            3: '星期二',
            4: '星期三',
            5: '星期四',
            6: '星期五',
            7: '星期六',
            8: '星期日',
            9: '单日',
            10: '双日',
            11: '日期以0结尾',
            12: '日期以1结尾',
            13: '日期以2结尾',
            14: '日期以3结尾',
            15: '日期以4结尾',
            16: '日期以5结尾',
            17: '日期以6结尾',
            18: '日期以7结尾',
            19: '日期以8结尾',
            20: '日期以9结尾'
        };
        $scope.specFlag = {
            1: '星期六',
            2: '星期日',
            3: '节假日',
            4: '特定日期'
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
         * 显示序号
         * @method getIndex
         * @author Niuxinyi
         * @date   2017-11-20
         * @return {object} html 包括序号，显示在页面
         */
        function getIndex() {
            var html = '<div class="ui-grid-cell-contents">{{(grid.appScope.searchModel.pageNum - 1) * grid.appScope.searchModel.pageSize + row.entity.pageIndex}}</div>';
            return html;
        }
        /**
         * 转换车辆类型
         * @method changeVehicle
         * @author Niuxinyi
         * @date   2017-11-20
         * @param {object} vehicle 车辆
         * @return {object} vehicleName 包括车辆数组
         */
        function changeVehicle(vehicle) {
            var vehicleIds = vehicle.split('|');
            var vehicleName = [];
            for (var i = 0; i < vehicleIds.length; i++) {
                vehicleName.push($scope.vehicle[vehicleIds[i]]);
            }
            return vehicleName.join('|');
        }
        /**
         * 转换本外地
         * @method changeAttribution
         * @author Niuxinyi
         * @date   2017-11-20
         * @param {object} attribution 本外地
         * @return {object} attributionName 本外地数组
         */
        function changeAttribution(attribution) {
            var attributionIds = attribution.split('|');
            var attributionName = [];
            for (var i = 0; i < attributionIds.length; i++) {
                attributionName.push($scope.attribution[attributionIds[i]]);
            }
            return attributionName.join('|');
        }
        /**
         * 转换限行尾号
         * @method changeTailNumber
         * @author Niuxinyi
         * @date   2017-11-20
         * @param {object} tailNumber 限行尾号
         * @return {object} tailNumberName 限行尾号数组
         */
        function changeTailNumber(tailNumber) {
            var tailNumberIds = tailNumber.split('|');
            var tailNumberName = [];
            for (var i = 0; i < tailNumberIds.length; i++) {
                tailNumberName.push($scope.tailNumber[tailNumberIds[i]]);
            }
            return tailNumberName.join('|');
        }
        /**
         * 转换油气排放标准
         * @method changeGasEmisstand
         * @author Niuxinyi
         * @date   2017-11-20
         * @param {object} gasEmisstand 油气排放标准
         * @return {object} gasEmisstandName 油气排放标准数组
         */
        function changeGasEmisstand(gasEmisstand) {
            var gasEmisstandIds = gasEmisstand.split('|');
            var gasEmisstandName = [];
            for (var i = 0; i < gasEmisstandIds.length; i++) {
                gasEmisstandName.push($scope.gasEmisstand[gasEmisstandIds[i]]);
            }
            return gasEmisstandName.join('|');
        }
        /**
         * 转换车牌颜色
         * @method changePlatecolor
         * @author Niuxinyi
         * @date   2017-11-20
         * @param {object} platecolor 车牌颜色
         * @return {object} platecolorName 车牌颜色数组
         */
        function changePlatecolor(platecolor) {
            var platecolorIds = platecolor.split('|');
            var platecolorName = [];
            for (var i = 0; i < platecolorIds.length; i++) {
                platecolorName.push($scope.platecolor[platecolorIds[i]]);
            }
            return platecolorName.join('|');
        }
        /**
         * 转换能源类型
         * @method changeEnergyType
         * @author Niuxinyi
         * @date   2017-11-20
         * @param {object} energyType 能源类型
         * @return {object} energyTypeName 能源类型数组
         */
        function changeEnergyType(energyType) {
            var energyTypeIds = energyType.split('|');
            var energyTypeName = [];
            for (var i = 0; i < energyTypeIds.length; i++) {
                energyTypeName.push($scope.energyType[energyTypeIds[i]]);
            }
            return energyTypeName.join('|');
        }
        /**
         * 转换限行时间类型
         * @method changeResDatetype
         * @author Niuxinyi
         * @date   2017-11-20
         * @param {object} resDatetype 限行时间类型
         * @return {object} resDatetypeName 限行时间类型数组
         */
        function changeResDatetype(resDatetype) {
            var resDatetypeIds = resDatetype.split('|');
            var resDatetypeName = [];
            for (var i = 0; i < resDatetypeIds.length; i++) {
                resDatetypeName.push($scope.resDatetype[resDatetypeIds[i]]);
            }
            return resDatetypeName.join('|');
        }
        /**
         * 转换排除日期
         * @method changeSpecFlag
         * @author Niuxinyi
         * @date   2017-11-20
         * @param {object} specFlag 排除日期
         * @return {object} specFlagName 排除日期数组
         */
        function changeSpecFlag(specFlag) {
            var specFlagIds = specFlag.split('|');
            var specFlagName = [];
            for (var i = 0; i < specFlagIds.length; i++) {
                specFlagName.push($scope.specFlag[specFlagIds[i]]);
            }
            return specFlagName.join('|');
        }
        /**
         * 临牌转换原则
         * @method getTempPlate
         * @author Niuxinyi
         * @date   2017-11-20
         * @return {object} html 返回页面
         */
        function getTempPlate() {
            var html = '<div class="ui-grid-cell-contents">{{row.entity.tempPlate === 1 ? "转换为固定数字" : row.entity.tempPlate === 2 ? "视为常规车牌" : "不转换"}}</div>';
            return html;
        }
        /**
         * 字母转换原则
         * @method getCharSwitch
         * @author Niuxinyi
         * @date   2017-11-20
         * @return {object} html 返回页面
         */
        function getCharSwitch() {
            var html = '<div class="ui-grid-cell-contents">{{row.entity.charSwitch === 1 ? "转换为固定数字" : row.entity.charSwitch === 2 ? "以字母前一位阿拉伯数字为准" : "原值转出"}}</div>';
            return html;
        }
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
            console.log(selectData);
            var params = {
                command: 'CREATE',
                type: 'SCPLATERESMANOEUVRE',
                data: {
                    groupId: App.Temp.groupId
                }
            };
            console.log(selectData.gasEmisstand);
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
            params.data.resWeigh = selectData.resWeigh;
            params.data.resAxleLoad = selectData.resAxleLoad;
            params.data.resAxleCount = selectData.resAxleCount;
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
                        displayName: '序号',
                        enableSorting: false,
                        width: 50,
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
                        field: 'vehicleName',
                        displayName: '车辆类型',
                        enableSorting: false,
                        minWidth: 100,
                        cellClass: 'center'
                    },
                    {
                        field: 'seatnum',
                        displayName: '车座限制',
                        enableSorting: false,
                        minWidth: 100,
                        cellClass: 'center'
                    },
                    {
                        field: 'attributionName',
                        displayName: '本外地',
                        enableSorting: false,
                        minWidth: 100,
                        cellClass: 'center'
                    },
                    {
                        field: 'restrict',
                        displayName: '受限本地车',
                        enableSorting: false,
                        minWidth: 100,
                        cellClass: 'center'
                    },
                    {
                        field: 'tempPlate',
                        displayName: '临牌转换原则',
                        enableSorting: false,
                        minWidth: 100,
                        cellClass: 'center',
                        cellTemplate: getTempPlate()
                    },
                    {
                        field: 'tempPlateNum',
                        displayName: '临牌对应数字',
                        enableSorting: false,
                        minWidth: 100,
                        cellClass: 'center'
                    },
                    {
                        field: 'charSwitch',
                        displayName: '字母转换原则',
                        enableSorting: false,
                        minWidth: 100,
                        cellClass: 'center',
                        cellTemplate: getCharSwitch()
                    },
                    {
                        field: 'charToNum',
                        displayName: '字母对应数字',
                        enableSorting: false,
                        minWidth: 100,
                        cellClass: 'center'
                    },
                    {
                        field: 'tailNumberName',
                        displayName: '限行尾号',
                        enableSorting: false,
                        minWidth: 100,
                        cellClass: 'center'
                    },
                    {
                        field: 'platecolorName',
                        displayName: '车牌颜色',
                        enableSorting: false,
                        minWidth: 100,
                        cellClass: 'center'
                    },
                    {
                        field: 'energyTypeName',
                        displayName: '能源类型',
                        enableSorting: false,
                        minWidth: 100,
                        cellClass: 'center'
                    },
                    {
                        field: 'gasEmisstand',
                        displayName: '油气排放标准',
                        enableSorting: false,
                        minWidth: 100,
                        cellClass: 'center'
                    },
                    {
                        field: 'vehicleLength',
                        displayName: '车长限制',
                        enableSorting: false,
                        minWidth: 100,
                        cellClass: 'center'
                    },
                    {
                        field: 'resWeigh',
                        displayName: '限制载重',
                        enableSorting: false,
                        minWidth: 100,
                        cellClass: 'center'
                    },
                    {
                        field: 'resAxleLoad',
                        displayName: '限制轴重',
                        enableSorting: false,
                        minWidth: 100,
                        cellClass: 'center'
                    },
                    {
                        field: 'resAxleCount',
                        displayName: '限制轴数',
                        enableSorting: false,
                        minWidth: 100,
                        cellClass: 'center'
                    },
                    {
                        field: 'startDate',
                        displayName: '开始日期',
                        enableSorting: false,
                        minWidth: 100,
                        cellClass: 'center'
                    },
                    {
                        field: 'endDate',
                        displayName: '结束日期',
                        enableSorting: false,
                        minWidth: 100,
                        cellClass: 'center'
                    },
                    {
                        field: 'resDatetypeName',
                        displayName: '限行时间类型',
                        enableSorting: false,
                        minWidth: 100,
                        cellClass: 'center'
                    },
                    {
                        field: 'time',
                        displayName: '限行时间',
                        enableSorting: false,
                        minWidth: 100,
                        cellClass: 'center'
                    },
                    {
                        field: 'specFlagName',
                        displayName: '排除日期',
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

        $scope.$on('BottomPolicyPanelReload', initialize);
        $scope.$on('refreshPolicyList', function () {
            getData();
        });

        $scope.$on('$destroy', function () {

        });
    }
]);
