/**
 * 作业项界面
 * @author zhaohang
 * @date   2017/9/15
 * @param  {object} $window 窗口
 * @param  {object} $scope 作用域
 * @param  {object} $timeout 定时
 * @param  {object} NgTableParams 构造函数
 * @param  {object} dsFcc 接口服务
 * @param  {object} appPath app路径
 * @param  {object} $ocLazyLoad 延迟加载
 * @param  {object} dsLazyload 延迟加载
 * @return {undefined}
 */
angular.module('app').controller('globalCheckCtrl', ['$window', '$scope', '$timeout', 'NgTableParams', 'dsFcc', 'appPath', '$ocLazyLoad', 'dsLazyload',
    function ($window, $scope, $timeout, NgTableParams, dsFcc, appPath, $ocLazyLoad, dsLazyload) {
        if (!$scope.testLogin()) {
            return;
        }
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
        $scope.PageViewPoint = {
            x: document.documentElement.clientWidth / 2,
            y: document.documentElement.clientHeight / 2
        };
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
        /**
         * 根据实际的行高设置每行的height属性，主要处理grid高度改变后，canvas的高度没有自动变化的问题
         * @author Niuxinyi
         * @date   2017-11-16
         * @param  {object} rows 主要为要显示的信息行列
         * @param  {object} columns 主要为要显示的信息行列
         * @return {object} rows 包含行高
         */
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
        /**
         * 行政区划选择数据
         * @method changeCityId
         * @author Niuxinyi
         * @date   2017-11-16
         * @param  {object} value 行政区划里选择的值
         * @return {undefined}
         */
        $scope.changeCityId = function (value) {
            if (value) {
                $scope.cityId = value;
            }
        };
        /**
         * 行政区划选择数据
         * @method changeProvince
         * @author Niuxinyi
         * @date   2017-11-16
         * @param  {object} value 行政区划里选择的值
         * @return {undefined}
         */
        $scope.changeProvince = function (value) {
            $scope.provinceName = value;
            for (var i = 0; i < CityList.length; i++) {
                if (CityList[i].province === $scope.provinceName) {
                    $scope.cityList = CityList[i].city;
                    $scope.cityId = CityList[i].city[0].id;
                }
            }
        };
        // 全局检查项
        var globalRuleIds = ['GLM90301', 'GLM90302', 'GLM90303', 'GLM90305', 'GLM90307', 'GLM90309', 'GLM90311', 'GLM90312',
            'GLM90313', 'GLM90315', 'GLM90317', 'GLM90319', 'GLM90321', 'GLM90323', 'GLM90325', 'GLM90327', 'GLM90329', 'GLM90331',
            'GLM90333', 'GLM90335', 'GLM90337', 'GLM90339', 'GLM90341', 'GLM90343', 'GLM90344', 'GLM90228', 'GLM90243', 'GLM90267', 'GLM90268',
            'GLM90269', 'GLM90273', 'GLM90271', 'GLM90272', 'GLM90289', 'GLM90349'];
        // , 'GLM90268'
        /**
         * 查看检查结果
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {undefined}
         */
        $scope.lookResult = function () {
            var requestData = {
                type: 'NIVALEXCEPTION',
                condition: {
                    pageSize: $scope.searchModel.pageSize,
                    pageNum: $scope.searchModel.pageNum,
                    sortype: $scope.searchModel.sortype,
                    sortord: $scope.searchModel.sortord,
                    ruleids: globalRuleIds
                }
            };
            $scope.searchModel.pageNum = requestData.condition.pageNum;
            dsFcc.getCheckResult(requestData).then(function (checkRes) {
                if (checkRes.data && checkRes.data.length !== 0 && checkRes != -1) {
                    for (var i = 0; i < checkRes.data.length; i++) {
                        checkRes.data[i].pageIndex = i + 1;
                        var targets = checkRes.data[i].targets;
                        var groupId = '';
                        var arrTargets = targets.substring(1, targets.length - 1).split(',');
                        if (arrTargets[0].indexOf('_GROUP') > -1) {
                            arrTargets.splice(0, 1);
                            groupId = arrTargets.toString();
                        } else {
                            groupId = arrTargets[1];
                        }
                        checkRes.data[i].groupId = groupId;
                    }
                    $scope.loadingFlag = false;
                    $scope.gridOptions.data = checkRes.data;
                    $scope.gridOptions.totalItems = checkRes.total;
                }
            });
        }
        /**
         * 执行检查并且获取结果数据
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {undefined}
         */
        function getData() {
            $scope.loadingFlag = true;
            var sPublicTime = $scope.searchModel.sPublicTime;
            var ePublicTime = $scope.searchModel.ePublicTime;
            if (sPublicTime && ePublicTime) {
                sPublicTime = sPublicTime.replace(new RegExp(/(-)/g), '');
                ePublicTime = ePublicTime.replace(new RegExp(/(-)/g), '');
            }
            var params = {
                command: 'CREATE',
                type: 'NIVALEXCEPTION',
                dbId: App.Temp.dbId,
                data: {
                    infoIntelId: '',
                    groupid: '',
                    worker: App.Temp.userId,
                    provinceName: $scope.cityId,
                    checkType: 1,
                    ruleIds: globalRuleIds,
                    startDate: sPublicTime,
                    endDate: ePublicTime
                }
            };
            dsFcc.doCheck(params).then(function (data) {
                $scope.lookResult();
            });
        }

        /**
         * 查询数据
         * @method searchList
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {undefined}
         */
        $scope.globalCheck = function () {
            getData();
        };
        /**
         * 对弹出框进行位置、大小、视口、最小化、关闭、模态框等进行基本的管理设置
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {undefined}
         */
        $scope.dialogManager = {};
        $scope.selectData = {};
        $scope.valExceptionId = '';
        var defaultDialogOptions = {
            position: {
                x: $scope.PageViewPoint.x - 300,
                y: $scope.PageViewPoint.y - 150
            },
            size: {
                width: 600,
                height: 300
            },
            container: 'globalCheckListContainer',
            viewport: 'globalCheckListContainer',
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
         * 根据界面类型创建弹窗
         * @param data
         * @returns {{}}
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
            $scope.selectData = data;
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
                '<a ng-if="row.entity.status === 1" style="color: #333333;text-decoration-line: none;display:inline-block;width: 50px; ">已忽略</a>' +
                '<a ng-if="row.entity.status === 3" style="color: #333333;text-decoration-line: none;display:inline-block;width: 50px;">已处理</a>' +
                '<a ng-if="row.entity.status !== 1 && row.entity.status !== 3" ng-click="grid.appScope.editGroupInfo(row.entity.infoIntelId,row.entity.groupid,row.entity.valExceptionId)">编辑</a></div>';
            return html;
        }
        /**
         * 显示加载
         * @method showLoading
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {undefined}
         */
        $scope.showLoading = function () {
            if (!$scope.loading.flag) {
                $scope.loading.flag = true;
            }
        };
        /**
         * 隐藏加载
         * @method showLoading
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {undefined}
         */
        $scope.hideLoading = function () {
            if ($scope.loading.flag) {
                $scope.loading.flag = false;
            }
        };
        /**
         * 初始化数据
         * @method showLoading
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {undefined}
         */
        var initialize = function () {
            $scope.provinceList = [];
            $scope.provinceName = '北京市';
            for (var i = 0; i < CityList.length; i++) {
                $scope.provinceList.push(CityList[i].province);
                if (CityList[i].province === $scope.provinceName) {
                    $scope.cityList = CityList[i].city;
                    $scope.cityId = CityList[i].city[0].id;
                }
            }
            var date = new Date();
            var preDate = new Date();
            preDate.setDate(new Date().getDate() - 30);
            var year = date.getFullYear();
            var preYear = preDate.getFullYear();
            var month = date.getMonth() + 1;
            var preMonth = preDate.getMonth() + 1;
            if (month < 10) {
                month = '0' + month.toString();
            } else {
                month = month.toString();
            }
            if (preMonth < 10) {
                preMonth = '0' + preMonth.toString();
            } else {
                preMonth = preMonth.toString();
            }
            var day = date.getDate();
            var preDay = preDate.getDate();
            if (day < 10) {
                day = '0' + day.toString();
            } else {
                day = day.toString();
            }
            if (preDay < 10) {
                preDay = '0' + preDay.toString();
            } else {
                preDay = preDay.toString();
            }
            var time = year.toString() + '-' + month + '-' + day.toString();
            var preTime = preYear.toString() + '-' + preMonth + '-' + preDay.toString();
            $scope.searchModel.sPublicTime = preTime;
            $scope.searchModel.ePublicTime = time;
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
                enableColumnMoving: true,
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    // 处理改变列表高度后，滚动条跳动的问题
                    gridApi.grid.registerRowsProcessor(myRowProc, 200);
                    // 分页事件;
                    gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                        $scope.searchModel.pageNum = newPage;
                        $scope.searchModel.pageSize = pageSize;
                        $scope.lookResult();
                        $scope.lookResult(function (data) {
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
                            $scope.lookResult();
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
                        field: 'groupId',
                        displayName: 'groupId',
                        enableSorting: false,
                        minWidth: 50,
                        cellClass: 'center'
                    },
                    {
                        field: 'infoIntelId',
                        displayName: '情报编码',
                        enableSorting: false,
                        minWidth: 50,
                        cellClass: 'center'
                    },
                    // {
                    //     field: 'id',
                    //     displayName: 'ID',
                    //     enableSorting: false,
                    //     minWidth: 50,
                    //     cellClass: 'center'
                    // },
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
        /**
         * 对数据进行编辑及编辑弹出框显示编辑记录
         * @method editGroupInfo
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {undefined}
         */
        $scope.editGroupInfo = function (infoIntelId, groupid, valExceptionId) {
            $scope.closeDialog($scope.selectData.type);
            $scope.valExceptionId = valExceptionId;
            var params = {
                type: 'SCPLATERESGROUP',
                condition: {
                    infoIntelId: infoIntelId,
                    adminArea: $scope.cityId,
                    groupId: groupid
                }
            };
            dsFcc.getGroupList(params).then(function (result) {
                var ret = [];
                var total = 0;
                if (result.data && result.data.length !== 0 && result != -1) {
                    showInDialog({ type: 'editGroup', data: result.data[0], check: 'globalCheck' });
                }
            });
        };
        // 修改log状态为 例外（忽略）
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
                $scope.lookResult();
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
                $scope.lookResult();
            });
        };
        initialize();
        $scope.$on('closeGroupDialog', function (event, data) {
            $scope.closeDialog(data);
            if ($scope.valExceptionId) {
                $scope.alreadyDeal();
            }
            $scope.lookResult();
        });
        $scope.$on('$destroy', function () {

        });
    }
]);
