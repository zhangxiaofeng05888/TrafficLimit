/**
 * 批量删除
 * @author zhaohang
 * @date   2017/11/1
 * @param  {object} $window 窗口
 * @param  {object} $scope 作用域
 * @param  {object} $timeout 定时
 * @param  {object} NgTableParams 构造函数
 * @param  {object} dsFcc 接口服务
 * @param  {object} appPath app路径
 * @param  {object} $ocLazyLoad 延时加载
 * @return {undefined}
 */
angular.module('app').controller('policyCheckCtrl', ['$window', '$scope', '$timeout', 'NgTableParams', 'dsFcc', 'appPath', 'dsEdit', '$ocLazyLoad', '$compile',
    function ($window, $scope, $timeout, NgTableParams, dsFcc, appPath, dsEdit, $ocLazyLoad, $compile) {
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
        $scope.valExceptionId = '';
        // 策略表检查项
        var policyRuleIds = ['GLM90304', 'GLM90306', 'GLM90308', 'GLM90310', 'GLM90314', 'GLM90316', 'GLM90318', 'GLM90320',
            'GLM90324', 'GLM90326', 'GLM90328', 'GLM90330', 'GLM90332', 'GLM90334', 'GLM90336', 'GLM90338', 'GLM90340',
            'GLM90342', 'GLM90234_1', 'GLM90234_2', 'GLM90235_1', 'GLM90235_2', 'GLM90235_3', 'GLM90235_4', 'GLM90235_5', 'GLM90276',
            'GLM90236', 'GLM90237_1', 'GLM90237_2', 'GLM90240', 'GLM90242', 'GLM90250', 'GLM90251', 'GLM90254', 'GLM90256', 'GLM90274',
            'GLM90275', 'GLM90281', 'GLM90282', 'GLM90283', 'GLM90284', 'GLM90292', 'GLM90264', 'GLM90266'];
        $scope.searchModel = {
            pageNum: 1,
            pageSize: 20,
            infoId: '',
            sPublicTime: '',
            ePublicTime: '',
            status: [false, false, false],
            period: [false, false],
            project: [false, false, false, false],
            sortype: '',
            sortord: ''
        };
        $scope.lookPolicyCheck = function () {
            var requestData = {
                type: 'NIVALEXCEPTION',
                condition: {
                    groupid: App.Temp.groupId,
                    pageSize: $scope.searchModel.pageSize,
                    pageNum: $scope.searchModel.pageNum,
                    sortype: $scope.searchModel.sortype,
                    sortord: $scope.searchModel.sortord,
                    ruleids: policyRuleIds
                }
            };
            dsFcc.getCheckResult(requestData).then(function (checkRes) {
                if (checkRes.data && checkRes.data.length !== 0 && checkRes != -1) {
                    for (var i = 0; i < checkRes.data.length; i++) {
                        checkRes.data[i].pageIndex = i + 1;
                        var targets = checkRes.data[i].targets;
                        checkRes.data[i].manoeuvreId = targets.substring(0, targets.length - 1).split(',')[3];
                    }
                    $scope.loadingFlag = false;
                    $scope.gridOptions.data = checkRes.data;
                    $scope.gridOptions.totalItems = checkRes.total;
                }
            });
        }
        // 执行检查并且获取表格数据
        var getTableData = function () {
            $scope.loadingFlag = true;
            var params = {
                command: 'CREATE',
                type: 'NIVALEXCEPTION',
                dbId: App.Temp.dbId,
                data: {
                    infoIntelId: App.Temp.infoToGroupData.infoId,
                    groupid: App.Temp.groupId,
                    worker: App.Temp.userId,
                    provinceName: App.Temp.infoToGroupData.cityId,
                    checkType: 2,
                    ruleIds: policyRuleIds
                }
            };
            dsFcc.doCheck(params).then(function (checkFlag) {
                $scope.lookPolicyCheck();
            });
        };

        /**
         * 显示序号;
         * @method getIndex
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {object} html 包括序号，显示在页面
         */
        function getIndex() {
            var html = '<div class="ui-grid-cell-contents">{{(grid.appScope.searchModel.pageNum - 1) * grid.appScope.searchModel.pageSize + row.entity.pageIndex}}</div>';
            return html;
        }
        /**
         * 操作
         * @method operations
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {object} html 包括序号，显示在页面
         */
        function operations() {
            var html = '<div class="ui-grid-cell-contents" style="cursor:pointer;">' +
                '<a ng-if="row.entity.status !== 1 && row.entity.status !== 3" ng-click="grid.appScope.ignoreInfo(row.entity.valExceptionId)" style="display:inline-block;width: 50px;">忽略</a>' +
                '<a ng-if="row.entity.status === 1" style="color: #333333;text-decoration-line: none;display:inline-block;width: 50px;">已忽略</a>' +
                '<a ng-if="row.entity.status === 3" style="color: #333333;text-decoration-line: none;display:inline-block;width: 50px;">已处理</a>' +
                '<a ng-if="row.entity.status !== 1 && row.entity.status !== 3" ng-click="grid.appScope.editPolicy(row.entity.manoeuvreId,row.entity.valExceptionId)">编辑</a></div>';
            return html;
        }
        $scope.ignoreInfo = function (valExceptionId) {
            var params = {
                command: 'UPDATE',
                type: 'NIVALEXCEPTION',
                dbId: App.Temp.dbId,
                objIds: [valExceptionId],
                data: {
                    status: 1
                }
            };
            dsFcc.ignoreCheckInfo(params).then(function (result) {
                getTableData();
            });
        };
        // 修改log状态为 已修改
        $scope.alreadyDeal = function () {
            var params = {
                command: 'UPDATE',
                type: 'NIVALEXCEPTION',
                dbId: App.Temp.dbId,
                objIds: [$scope.valExceptionId],
                data: {
                    status: 3
                }
            };
            dsFcc.ignoreCheckInfo(params).then(function (result) {
                getTableData();
            });
        };
        /**
         * 初始化数据
         * @author Niuxinyi
         * @date   2017-11-20
         * @param  {object} event 包括事件
         * @param  {object} data 包括数据
         * @return {undefined}
         */
        var initialize = function () {
            $scope.groupID = App.Temp.groupId;
            // 初始化表格;
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
                        $scope.lookPolicyCheck();
                        $scope.lookPolicyCheck(function (data) {
                            // 翻页后自动滚动到第一条数据
                            $timeout(function () {
                                gridApi.core.scrollTo(data[0]);
                            });
                        });
                    });
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (sortColumns.length) {
                            var sortord = sortColumns[0].sort.direction;
                            var sortype = sortColumns[0].field;
                            $scope.searchModel.sortord = sortord;
                            $scope.searchModel.sortype = sortype;
                            $scope.lookPolicyCheck();
                        }
                    });
                },
                columnDefs: [
                    {
                        field: 'pageIndex',
                        displayName: '序号',
                        enableSorting: false,
                        maxWidth: 50,
                        cellClass: 'center',
                        cellTemplate: getIndex()
                    },
                    {
                        field: 'groupid',
                        displayName: 'groupID',
                        enableSorting: false,
                        minWidth: 50,
                        cellClass: 'center'
                    },
                    {
                        field: 'manoeuvreId',
                        displayName: '策略序号',
                        enableSorting: false,
                        minWidth: 50,
                        cellClass: 'center'
                    },
                    {
                        field: 'ruleid',
                        displayName: '规则号',
                        enableSorting: false,
                        minWidth: 50,
                        cellClass: 'center'
                    },
                    {
                        field: 'information',
                        displayName: '错误描述',
                        enableSorting: false,
                        minWidth: 200,
                        cellClass: 'center'
                    },
                    {
                        field: 'operations',
                        displayName: '操作',
                        enableSorting: false,
                        maxWidth: 150,
                        cellClass: 'center',
                        cellTemplate: operations()
                    }
                ]
            };
        };
        initialize();
        $scope.$on('ReloadData-policyColumnCheck', getTableData);
        $scope.$on('ReloadData-policyColumnCheckResult', $scope.lookPolicyCheck);

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
            '26个英文字母': '26个英文字母'
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

        // 点击编辑报错数据
        $scope.editPolicy = function (manoeuvreId, valExceptionId) {
            $scope.valExceptionId = valExceptionId;
            var params = {
                type: 'SCPLATERESMANOEUVRE',
                condition: {
                    groupId: App.Temp.groupId,
                    manoeuvreId: manoeuvreId
                }
            };
            dsFcc.getPolicyList(params).then(function (data) {
                data.data[0].resDatetype = '2|3|5|6|20|';
                var temp = data.data[0];
                temp.originVehicleName = temp.vehicle;
                temp.vehicleName = changeVehicle(temp.vehicle);
                temp.originAttributionName = temp.attribution;
                temp.attributionName = changeAttribution(temp.attribution);
                temp.originTailNumberName = temp.tailNumber;
                temp.tailNumberName = changeTailNumber(temp.tailNumber);
                temp.originGasEmisstand = temp.gasEmisstand;
                temp.gasEmisstand = changeGasEmisstand(temp.gasEmisstand);
                temp.originPlatecolorName = temp.platecolor;
                temp.platecolorName = changePlatecolor(temp.platecolor);
                temp.originEnergyTypeName = temp.energyType;
                temp.energyTypeName = changeEnergyType(temp.energyType);
                temp.originResDatetypeName = temp.resDatetype;
                temp.resDatetypeName = changeResDatetype(temp.resDatetype);
                temp.originSpecFlagName = temp.specFlag;
                temp.specFlagName = changeSpecFlag(temp.specFlag);
                $scope.$emit('ShowInfoPage', {
                    type: 'editPolicy',
                    data: temp
                });
            });
        };
        $scope.$on('refreshPolicyCheckList', function () {
            if ($scope.valExceptionId) {
                $scope.alreadyDeal();
                $scope.lookPolicyCheck();
            }
        });
        $scope.$on('$destroy', function (event, data) {

        });
    }
]);
