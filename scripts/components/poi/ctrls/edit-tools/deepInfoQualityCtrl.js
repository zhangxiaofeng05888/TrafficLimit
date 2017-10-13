angular.module('app').controller('DeepInfoQualityCtl', ['$scope', '$ocLazyLoad', 'dsEdit', '$timeout', function ($scope, $ocLazyLoad, dsEdit, $timeout) {
    var objectEditCtrl = FM.uikit.ObjectEditController();
    var initValue = null;   // 查询初始化值
    var oldCheckMode = '';   // 质检方式，用来记录作业员点击保存按钮时填写的质检方式，切换页签后，不用重复填写
    var oldGroup = '';   // 作业基地，用来记录作业员点击保存按钮时填写的作业基地，切换页签后，不用重复填写
    var oldVersion = '';   // 版本号，用来记录作业员点击保存按钮时填写的版本号，切换页签后，不用重复填写
    var oldConfirmUser = '';   // 确认人，用来记录作业员点击保存按钮时填写的确认人，切换页签后，不用重复填写
    var changeKey = '';

    $scope.theadInfo = ['序号', '规则编码', '错误描述', '操作', '关联POI'];
    // 表头
    $scope.exQuaTitle_1 = [
        {
            title: '收费标准',
            width: '60px',
            code: 'tollStd',
            changed: false, // 有变更 字体蓝色
            saved: false    // 保存过 背景黄色 // 无修改， 2 有变更且保存过 字体蓝色并且背景黄色
        },
        {
            title: '收费描述',
            width: '60px',
            code: 'tollDes',
            changed: false,
            saved: false
        },
        {
            title: '收费方式',
            width: '60px',
            code: 'tollWay',
            changed: false,
            saved: false
        },
        {
            title: '营业时间',
            width: '60px',
            code: 'openTiime',
            changed: false,
            saved: false
        },
        {
            title: '车位数量',
            width: '60px',
            code: 'totalNum',
            changed: false,
            saved: false
        },
        {
            title: '支付方式',
            width: '40px',
            code: 'payment',
            changed: false,
            saved: false
        },
        {
            title: '收费备注',  // 由 停车备注 改为 收费备注（和王涵确认）
            width: '60px',
            code: 'remark',
            changed: false,
            saved: false
        }
    ];
    $scope.exQuaTitle_2 = [
        {
            title: '营业时间',
            width: '60px',
            code: 'openHour',
            changed: false, // 有变更 字体蓝色
            saved: false    // 保存过 背景黄色 // 无修改， 2 有变更且保存过 字体蓝色并且背景黄色
        },
        {
            title: '交通路线',
            width: '60px',
            code: 'howToGo',
            changed: false,
            saved: false
        },
        {
            title: '地址描述',
            width: '60px',
            code: 'address',
            changed: false,
            saved: false
        },
        {
            title: '主页网址',
            width: '60px',
            code: 'webSite',
            changed: false,
            saved: false
        },
        {
            title: '400电话',
            width: '60px',
            code: 'phone400',
            changed: false,
            saved: false
        }
    ];
    $scope.exQuaTitle_3 = [
        {
            title: '主页网址',
            width: '60px',
            code: 'webSite',
            changed: false, // 有变更 字体蓝色
            saved: false    // 保存过 背景黄色 // 无修改， 2 有变更且保存过 字体蓝色并且背景黄色
        },
        {
            title: '简介',
            width: '60px',
            code: 'briefDesc',
            changed: false,
            saved: false
        },
        {
            title: '传真',
            width: '60px',
            code: 'contacts',
            changed: false,
            saved: false
        },
        {
            title: '营业时间',
            width: '60px',
            code: 'businesstimes',
            changed: false,
            saved: false
        }
    ];
    // 收费标准
    var tollStd = {
        0: '包车',
        1: '包月',
        2: '计次',
        3: '计时',
        4: '分段计价',
        5: '免费'
    };
    // 收费方式
    var tollWay = {
        0: '人工收费',
        1: '电子收费',
        2: '自助缴费'
    };
    // 支付方式
    var payment = {
        10: '八达通',
        11: 'VISA',
        12: 'MasterCard',
        13: '现金',
        14: '其他',
        15: '储值卡'
    };
    // 收费备注
    var remark = {
        0: '无条件免费',
        1: '住宿免费',
        2: '就餐免费',
        3: '购物免费',
        4: '购物或消费满额免部分费用',
        5: '和停车场所在的主体POI产生消费、办事、访问、挂号、就医等关系时免费',
        6: '只对内或产生消费的群体开放',
        7: '汽车美容',
        11: '搭升降机',
        12: '只限访客',
        14: '首时段免费',
        16: '留匙（要是代管）',
        17: '洗车及打蜡',
        18: '电动汽车可充电'
    };
    // 问题等级
    $scope.proLevelArray = ['C', 'B', 'A', 'S'];

    // 检测是否有该特殊属性，有改变则changed 为 true，主要针对于有子表的传真和营业时间
    var attrIsChanged = function (attr) {
        for (var i = 0; i < $scope.exQuaTitles.length; i++) {
            if ($scope.exQuaTitles[i].code == attr) {
                $scope.exQuaTitles[i].changed = true;
            }
        }
    };

    // 获取变更的字段
    var getChanges = function () {
        var _changes = objectEditCtrl.data.getChanges();
        var i;
        var key;
        // 字段对比
        if (_changes && _changes[changeKey]) {
            for (i = 0; i < $scope.exQuaTitles.length; i++) {
                for (key in _changes[changeKey][0]) {
                    if ($scope.exQuaTitles[i].code == key) {
                        $scope.exQuaTitles[i].changed = true;
                    }
                }
            }
        }
        // 传真
        if (_changes && _changes.hasOwnProperty('contacts')) {
            attrIsChanged('contacts');
        }
        // 营业时间
        if (_changes && _changes.hasOwnProperty('businesstimes')) {
            attrIsChanged('businesstimes');
        }
        // 车位数量
        if (_changes && _changes.hasOwnProperty('totalNum')) {
            attrIsChanged('totalNum');
        }
    };

    // 判断已保存的字段
    var getSaved = function () {
        if ($scope.quaDataList.length) {
            for (var i = 0; i < $scope.exQuaTitles.length; i++) {
                for (var j = 0; j < $scope.quaDataList.length; j++) {
                    if ($scope.exQuaTitles[i].code == $scope.quaDataList[j].poiProperty) {
                        $scope.exQuaTitles[i].saved = true;
                    }
                }
            }
        }
    };

    var setDefaultField = function (obj) {
        $scope.deepQuaData.workTime = obj.workTime;
        $scope.deepQuaData.commonWorker = obj.commonWorker;
        $scope.deepQuaData.poiProperty = $scope.activeTab.code;
        $scope.deepQuaData.qcWorker = App.Temp.userName;
        $scope.deepQuaData.qcTime = Utils.newDateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
        // $scope.deepQuaData.problemLevel = 'C';

        // $scope.deepQuaData.checkMode = oldCheckMode;
        // $scope.deepQuaData.group = oldGroup;
        // $scope.deepQuaData.version = oldVersion;
        // $scope.deepQuaData.confirmUser = oldConfirmUser;
    };

    // 获取初始化属性值
    var getInitValue = function () {
        $scope.deepQuaData = {
            problemLevel: 'C',
            poiNum: objectEditCtrl.data.poiNum    // IDCode
        };
        $scope.gridApi.selection.clearSelectedRows();
        $scope.showModelLoading = true;
        // 如果已经查出来直接赋值
        if (!initValue) {
            dsEdit.getInitValueForDeepInfo(objectEditCtrl.data.pid).then(function (data) {
                $scope.showModelLoading = false;
                if (data) {
                    initValue = data;
                    setDefaultField(initValue);
                }
            });
        } else {
            setDefaultField(initValue);
            $scope.showModelLoading = false;
        }
    };

    // 获取传真集合字符串
    var getAllFox = function (foxs) {
        var fResult = [];
        if (foxs.length) {
            for (var i = 0; i < foxs.length; i++) {
                // 只有contactType等于11才是传真号码
                if (foxs[i].contact && foxs[i].contactType == 11) {
                    fResult.push(foxs[i].contact);
                }
            }
        }
        return fResult.join('; ');
    };

    // 处理营业时间，开始时间 + 时间间隔 = 结束时间
    var getTimeEnd = function (begin, dur) {
        var hour;
        var min;
        var exo = 0;
        var strB = begin.split(':');
        var strD = dur.split(':');
        if (parseInt(strB[1], 0) + parseInt(strD[1], 0) > 59) {
            min = parseInt(strB[1], 0) + parseInt(strD[1], 0) - 60;
            exo = 1;
        } else {
            min = parseInt(strB[1], 0) + parseInt(strD[1], 0);
        }
        if (parseInt(strB[0], 0) + parseInt(strD[0], 0) + exo > 23 && min >= 0) {
            hour = parseInt(strB[0], 0) + parseInt(strD[0], 0) + exo - 24;
        } else if (parseInt(strB[0], 0) + parseInt(strD[0], 0) + exo === 24 && min === 0) {
            hour = 23;
            min = 59;
        } else if (parseInt(strB[0], 0) + parseInt(strD[0], 0) + exo < 24) {
            hour = parseInt(strB[0], 0) + parseInt(strD[0], 0) + exo;
        }
        // 处理min为0的情况，自动赋值为00
        if (min + '' == '0') {
            min += '0';
        }
        return hour + ':' + min;
    };

    // 获取时间集合字符串
    var getAllTimeDomain = function (time) {
        var fResult = [];
        if (time.length) {
            for (var i = 0; i < time.length; i++) {
                var monAndDay = time[i].monSrt + '.' + time[i].daySrt + ' - ' + time[i].monEnd + '.' + time[i].dayEnd;
                var weekStr = [];
                var weekMatch = {
                    0: '日',
                    1: '一',
                    2: '二',
                    3: '三',
                    4: '四',
                    5: '五',
                    6: '六'
                };
                for (var j = 0; j < time[i].validWeek.length; j++) {
                    if (parseInt(time[i].validWeek[j], 10)) {
                        weekStr.push(weekMatch[j]);
                    }
                }
                weekStr = weekStr.join(' ');
                var openTime = time[i].timeSrt + ' - ' + getTimeEnd(time[i].timeSrt, time[i].timeDur);
                fResult.push(monAndDay + ', ' + weekStr + ', ' + openTime);
            }
        }
        return fResult.join(';');
    };

    // 对于数字转为文字描述
    var numToDes = function (data) {
        var dataArray = data.split('|');
        var result = [];
        var attrDescribe;
        for (var i = 0; i < dataArray.length; i++) {
            switch ($scope.activeTab.code) {
                case 'tollStd':
                    attrDescribe = tollStd[dataArray[i]];
                    break;
                case 'tollWay':
                    attrDescribe = tollWay[dataArray[i]];
                    break;
                case 'payment':
                    attrDescribe = payment[dataArray[i]];
                    break;
                case 'remark':
                    attrDescribe = remark[dataArray[i]];
                    break;
                default:
                    attrDescribe = data;
                    break;
            }
            result.push(attrDescribe);
        }
        return result.join('、');
    };

    // 为当前属性赋值更改前后值
    var getChangesFiled = function () {
        var originObj = objectEditCtrl.originalData.getIntegrate();
        var dataObj = objectEditCtrl.data.getIntegrate();
        // 传真
        if ($scope.activeTab.code == 'contacts') {
            $scope.deepQuaData.oldValue = getAllFox(originObj.contacts);
            $scope.deepQuaData.newValue = getAllFox(dataObj.contacts);
            return;
        }
        // 营业时间
        if ($scope.activeTab.code == 'businesstimes') {
            $scope.deepQuaData.oldValue = getAllTimeDomain(originObj.businesstimes);
            $scope.deepQuaData.newValue = getAllTimeDomain(dataObj.businesstimes);
            return;
        }
        // 停车场
        if ($scope.activeTab.code == 'totalNum') {
            $scope.deepQuaData.oldValue = originObj.parkings[0].totalNum + '';
            $scope.deepQuaData.newValue = dataObj.parkings[0].totalNum + '';
            return;
        }
        $scope.deepQuaData.oldValue = originObj[changeKey].length ? numToDes(originObj[changeKey][0][$scope.activeTab.code]) : '';
        $scope.deepQuaData.newValue = dataObj[changeKey][0] ? numToDes(dataObj[changeKey][0][$scope.activeTab.code]) : '';
    };

    //  用来记录作业员点击保存按钮时填写的通用信息，切换空白记录页签后，不用重复填写
    var setOldParams = function () {
        oldCheckMode = $scope.deepQuaData.checkMode;
        oldGroup = $scope.deepQuaData.group;
        oldVersion = $scope.deepQuaData.version;
        oldConfirmUser = $scope.deepQuaData.confirmUser;
    };

    // 判断当前是否有错误数据
    var chargeQuaData = function (title) {
        if ($scope.quaDataList.length) {
            // 如果通过标签页点击
            if (title) {
                var activeIndex = -1;
                for (var j = 0; j < $scope.quaDataList.length; j++) {
                    // 所选tab恰好是已经有的问题
                    if ($scope.quaDataList[j].poiProperty == title) {
                        $scope.deepQuaData = $scope.quaDataList[j];
                        activeIndex = j;
                        break;
                    }
                    // 所选tab是新的，则为新增
                    if (j == $scope.quaDataList.length - 1 && $scope.quaDataList[j].poiProperty != title) {
                        getInitValue();
                    }
                }
                if (activeIndex > -1) {
                    $timeout(function () {
                        $scope.gridApi.selection.selectRowByVisibleIndex(activeIndex);
                    });
                }
            } else {
                $scope.deepQuaData = $scope.quaDataList[0];
                setOldParams();
                $timeout(function () {
                    $scope.gridApi.selection.selectRowByVisibleIndex(0);
                });
            }
            for (var i = 0; i < $scope.exQuaTitles.length; i++) {
                if ($scope.exQuaTitles[i].code == $scope.deepQuaData.poiProperty) {
                    $scope.activeTab = $scope.exQuaTitles[i];
                    $scope.deepQuaData.poiProperty = $scope.exQuaTitles[i].code;
                    $scope.deepQuaData.poiNum = objectEditCtrl.data.poiNum;
                    $scope.originQuaData = angular.copy($scope.deepQuaData);
                    break;
                }
            }
        } else {
            getInitValue();
        }
        getChangesFiled();
    };

    var paginationOptions = {
        pageNum: 1,
        pageSize: 25,
        sortBy: null,
        sortDir: null
    };

    var formatRow = function () {
        var html = '<div ng-click="grid.appScope.quaDataEdit(row.entity)">' +
            '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ' +
            'class="ui-grid-cell grid-cell-diy" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
            '</div>';
        return html;
    };

    // 查询问题列表 参数 是否定位到首个数据
    var queryProblemList = function (flag) {
        var param = {
            pid: objectEditCtrl.data.pid,
            subtaskId: App.Temp.subTaskId,
            secondWorkItem: App.Temp.monthTaskType
        };
        $scope.showModelLoading = true;
        dsEdit.queryQcProblemList(param).then(function (data) {
            var taskCookie = App.Util.getSessionStorage('SubTask');
            // if (data.length) {
            //     for (var i = 0; i < data.length; i++) {
            //         data[i].index = i + 1;
            //     }
            // }
            $scope.quaDataList = data;
            getSaved();
            // 任务名称
            $scope.taskName = taskCookie.taskName;
            $scope.showModelLoading = false;
            $scope.gridOptions.data = data;
            if (flag) {
                // 判断当前是否有错误数据
                chargeQuaData();
            } else {
                chargeQuaData($scope.activeTab.code);
            }
        });
    };

    // grid配置项
    $scope.gridOptions = {
        enableColumnMenus: false,
        useExternalPagination: false,
        enableFullRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        modifierKeysToMultiSelect: false,
        noUnselect: false,
        rowTemplate: formatRow(),
        columnDefs: [{
            field: 'index',
            displayName: '序号',
            minWidth: 30,
            enableSorting: true,
            visible: true,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'
        }, {
            field: 'qcWorker',
            displayName: '质检人',
            minWidth: 70,
            enableSorting: true,
            visible: true
        }, {
            field: 'qcTime',
            displayName: '质检日期',
            enableSorting: true,
            minWidth: 80,
            visible: true
        }, {
            field: 'problemLevel',
            displayName: '问题等级',
            minWidth: 70,
            enableSorting: true,
            visible: true
        }, {
            field: 'problemDesc',
            displayName: '问题描述',
            minWidth: 100,
            enableSorting: true,
            visible: true
        }, {
            field: 'operate',
            displayName: '操作',
            minWidth: 70,
            enableSorting: true,
            visible: true,
            cellTemplate: '<div class="fm-stretch table-option"><span class="glyphicon glyphicon-remove" ng-click="grid.appScope.quaDataDelete(row.entity, $index);" style="cursor: pointer"></span><span class="glyphicon glyphicon-pencil" ng-click="grid.appScope.quaDataEdit(row.entity);" style="cursor: pointer; margin-left: 5px;"></span></div>'
        }],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;

            // 排序事件
            gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                if (sortColumns.length == 0) {
                    paginationOptions.sort = null;
                } else {
                    paginationOptions.sort = sortColumns[0].sort.direction;
                }
            });
        }
    };

    // 初始化
    $scope.initData = function () {
        if (App.Temp.monthTaskType == 'deepDetail') {
            $scope.exQuaTitles = $scope.exQuaTitle_3;
            changeKey = 'details';
        } else if (App.Temp.monthTaskType == 'deepCarrental') {
            $scope.exQuaTitles = $scope.exQuaTitle_2;
            changeKey = 'carrentals';
        } else {
            $scope.exQuaTitles = $scope.exQuaTitle_1;
            changeKey = 'parkings';
        }
        $scope.primaryCauseArray = [];
        // 当前标签（tab页）
        $scope.activeTab = $scope.exQuaTitles[0];
        getChanges();
        // 初始化下拉值域
        queryProblemList(true);
    };

    // 编辑质检信息
    $scope.quaDataEdit = function (item) {
        for (var i = 0; i < $scope.exQuaTitles.length; i++) {
            if (item.poiProperty == $scope.exQuaTitles[i].code) {
                $scope.activeTab = $scope.exQuaTitles[i];
            }
        }
        $scope.deepQuaData = item;
        $scope.originQuaData = angular.copy($scope.deepQuaData);
    };

    // 删除质检信息
    $scope.quaDataDelete = function (item, index) {
        var param = {
            command: 'DELETE',
            problemId: item.problemId
        };
        $scope.showModelLoading = true;
        dsEdit.deepInfoOperateProblem(param).then(function (data) {
            $scope.showModelLoading = false;
            $scope.quaDataList.splice(index, 1);
            for (var k = 0; k < $scope.exQuaTitles.length; k++) {
                if ($scope.exQuaTitles[k].code == item.poiProperty) {
                    $scope.exQuaTitles[k].saved = false;
                }
            }
            $scope.deepQuaData = {};
            if (!$scope.quaDataList.length) {
                getInitValue();
                return;
            }
            chargeQuaData($scope.quaDataList[0].poiProperty);
            // poi质检问题查看
            $scope.initData();
        });
    };

    // 过滤数据
    var getIntegrateData = function (type, data) {
        var cData = angular.copy(data);
        var taskCookie = App.Util.getSessionStorage('SubTask');
        var result = {};
        result.problemId = cData.problemId;
        result.problemLevel = cData.problemLevel || 'C';
        result.problemDesc = cData.problemDesc || '';
        result.newValue = cData.newValue;
        if (!type) {
            // 新增
            delete result.problemId;
            result.secondWorkItem = App.Temp.monthTaskType;
            result.pid = objectEditCtrl.data.pid;
            result.poiProperty = cData.poiProperty;
            result.subtaskId = taskCookie.subTaskId;
            result.oldValue = cData.oldValue;
            result.commonWorker = cData.commonWorker;
            result.qcWorker = cData.qcWorker;
            result.qcTime = cData.qcTime;
        }
        return result;
    };

    // 新增 编辑数据
    $scope.quaDoSave = function () {
        var param = {};
        var i;
        // 校验
        var tempArray = ['problemLevel', 'problemDesc'];
        for (i = 0; i < tempArray.length; i++) {
            if (!$scope.deepQuaData[tempArray[i]]) {
                swal('提示', '必填项不能为空！', 'warning');
                return;
            }
        }

        setOldParams();

        // 编辑
        if ($scope.deepQuaData.problemId) {
            param.command = 'UPDATE';
            var modifyData = getIntegrateData(1, $scope.deepQuaData);
            var result = {};
            var loopCount = 0;
            // 筛选出更新的属性
            for (var key in modifyData) {
                if (modifyData[key] != $scope.originQuaData[key]) {
                    result[key] = modifyData[key];
                    loopCount++;
                }
            }
            if (loopCount == 0) {
                swal('提示', '没有做任何修改', 'warning');
                return;
            }
            result.problemId = modifyData.problemId;
            result.problemLevel = modifyData.problemLevel;
            result.problemDesc = modifyData.problemDesc;
            result.newValue = modifyData.newValue;
            param.data = result;
        } else {
            // 新增
            param.command = 'ADD';
            param.data = getIntegrateData(0, $scope.deepQuaData);
        }
        $scope.showModelLoading = true;
        dsEdit.deepInfoOperateProblem(param).then(function (data) {
            if (param.command == 'ADD') {
                queryProblemList();
            } else {
                // 修改后  更新originQuaData
                $scope.originQuaData = angular.copy($scope.deepQuaData);
                for (var k = 0; k < $scope.exQuaTitles.length; k++) {
                    if ($scope.exQuaTitles[k].code == $scope.deepQuaData.poiProperty) {
                        $scope.exQuaTitles[k].saved = true;
                    }
                }
                // $scope.initData();
            }
            $scope.showModelLoading = false;
        });
    };

    // 切换标签页
    $scope.changeLabel = function (label) {
        $scope.activeTab = label;
        chargeQuaData(label.code);
    };
    
    $scope.initData();

    $scope.$on('$destroy', function () {
        initValue = null;
    });
}]);
