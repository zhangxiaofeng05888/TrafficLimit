/**
 * Created by zhaohang on 2017/10/11.
 */
angular.module('app').controller('PolicyBottomViewPanelCtrl', ['$scope', '$rootScope', 'dsLazyload', 'appPath', 'dsFcc', '$timeout',
    function ($scope, $rootScope, dsLazyload, appPath, dsFcc, $timeout) {
        $scope.searchModel = {
            pageNum: 1,
            pageSize: 20
        };
        $scope.addPolicy = function () {
            $scope.$emit('ShowInfoPage', {
                type: 'addPolicy'
            });
        };
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
        // 显示序号;
        function getIndex() {
            var html = '<div class="ui-grid-cell-contents">{{(grid.appScope.searchModel.pageNum - 1) * grid.appScope.searchModel.pageSize + row.entity.pageIndex}}</div>';
            return html;
        }

        // 转换车辆类型
        function changeVehicle(vehicle) {
            var vehicleIds = vehicle.split('|');
            var vehicleName = [];
            for (var i = 0; i < vehicleIds.length; i++) {
                vehicleName.push($scope.vehicle[vehicleIds[i]]);
            }
            return vehicleName.join('|');
        }

        // 转换本外地
        function changeAttribution(attribution) {
            var attributionIds = attribution.split('|');
            var attributionName = [];
            for (var i = 0; i < attributionIds.length; i++) {
                attributionName.push($scope.attribution[attributionIds[i]]);
            }
            return attributionName.join('|');
        }
        // 转换限行尾号
        function changeTailNumber(tailNumber) {
            var tailNumberIds = tailNumber.split('|');
            var tailNumberName = [];
            for (var i = 0; i < tailNumberIds.length; i++) {
                tailNumberName.push($scope.tailNumber[tailNumberIds[i]]);
            }
            return tailNumberName.join('|');
        }
        // 转换油气排放标准
        function changeGasEmisstand(gasEmisstand) {
            var gasEmisstandIds = gasEmisstand.split('|');
            var gasEmisstandName = [];
            for (var i = 0; i < gasEmisstandIds.length; i++) {
                gasEmisstandName.push($scope.gasEmisstand[gasEmisstandIds[i]]);
            }
            return gasEmisstandName.join('|');
        }
        // 转换车牌颜色
        function changePlatecolor(platecolor) {
            var platecolorIds = platecolor.split('|');
            var platecolorName = [];
            for (var i = 0; i < platecolorIds.length; i++) {
                platecolorName.push($scope.platecolor[platecolorIds[i]]);
            }
            return platecolorName.join('|');
        }
        // 转换能源类型
        function changeEnergyType(energyType) {
            var energyTypeIds = energyType.split('|');
            var energyTypeName = [];
            for (var i = 0; i < energyTypeIds.length; i++) {
                energyTypeName.push($scope.energyType[energyTypeIds[i]]);
            }
            return energyTypeName.join('|');
        }
        // 转换限行时间类型
        function changeResDatetype(resDatetype) {
            var resDatetypeIds = resDatetype.split('|');
            var resDatetypeName = [];
            for (var i = 0; i < resDatetypeIds.length; i++) {
                resDatetypeName.push($scope.resDatetype[resDatetypeIds[i]]);
            }
            return resDatetypeName.join('|');
        }
        // 转换限行时间类型
        function changeSpecFlag(specFlag) {
            var specFlagIds = specFlag.split('|');
            var specFlagName = [];
            for (var i = 0; i < specFlagIds.length; i++) {
                specFlagName.push($scope.specFlag[specFlagIds[i]]);
            }
            return specFlagName.join('|');
        }
        // 临牌转换原则
        function getTempPlate() {
            var html = '<div class="ui-grid-cell-contents">{{row.entity.tempPlate === 1 ? "转换为固定数字" : row.entity.tempPlate === 2 ? "视为常规车牌" : "不转换"}}</div>';
            return html;
        }
        // 字母转换原则
        function getCharSwitch() {
            var html = '<div class="ui-grid-cell-contents">{{row.entity.charSwitch === 1 ? "转换为固定数字" : row.entity.charSwitch === 2 ? "以字母前一位阿拉伯数字为准" : "原值转出"}}</div>';
            return html;
        }
        // 获取表格数据;
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
                        temp.vehicleName = changeVehicle(temp.vehicle);
                        temp.attributionName = changeAttribution(temp.attribution);
                        temp.tailNumberName = changeTailNumber(temp.tailNumber);
                        temp.gasEmisstand = changeGasEmisstand(temp.gasEmisstand);
                        temp.platecolorName = changePlatecolor(temp.platecolor);
                        temp.energyTypeName = changeEnergyType(temp.energyType);
                        temp.resDatetypeName = changeResDatetype(temp.resDatetype);
                        temp.specFlagName = changeSpecFlag(temp.specFlag);
                        ret.push(temp);
                    }
                    total = data.total;
                }
                $scope.gridOptions.totalItems = total;
                $scope.gridOptions.data = ret;
            });
        }

        $scope.closePolicy = function () {
            $scope.$emit('CloseBottomPolicyPanel');
        };
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
                    gridApi.grid.registerRowsProcessor(myRowProc, 200);
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
