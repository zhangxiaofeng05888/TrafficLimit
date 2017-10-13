angular.module('app').controller('CheckResultCtl', ['$scope', '$ocLazyLoad', 'dsEdit', '$timeout', function ($scope, $ocLazyLoad, dsEdit, $timeout) {
    var objectEditCtrl = FM.uikit.ObjectEditController();
    var initValue = null;   // 查询初始化值
    var problemJson = [];   // 质检配置关系数据
    var oldCheckMode = '';   // 质检方式，用来记录作业员点击保存按钮时填写的质检方式，切换页签后，不用重复填写
    var oldGroup = '';   // 作业基地，用来记录作业员点击保存按钮时填写的作业基地，切换页签后，不用重复填写
    var oldVersion = '';   // 版本号，用来记录作业员点击保存按钮时填写的版本号，切换页签后，不用重复填写
    var oldConfirmUser = '';   // 确认人，用来记录作业员点击保存按钮时填写的确认人，切换页签后，不用重复填写

    $scope.theadInfo = ['序号', '规则编码', '错误描述', '操作', '关联POI'];
    // 表头
    $scope.exQuaTitles = [
        {
            title: '名称',
            width: '40px',
            code: 'names',
            changed: false, // 有变更 字体蓝色
            saved: false    // 保存过 背景黄色 // 无修改， 2 有变更且保存过 字体蓝色并且背景黄色
        },
        {
            title: '地址',
            width: '40px',
            code: 'addresses',
            changed: false,
            saved: false
        },
        {
            title: '电话',
            width: '40px',
            code: 'contacts',
            changed: false,
            saved: false
        },
        {
            title: '分类',
            width: '40px',
            code: 'kindCode',
            changed: false,
            saved: false
        },
        {
            title: 'POI等级',
            width: '60px',
            code: 'level',
            changed: false,
            saved: false
        },
        {
            title: '点位',
            width: '40px',
            code: 'geometry',
            changed: false,
            saved: false
        },
        {
            title: 'POI关联LINK',
            width: '90px',
            code: 'linkPid',
            changed: false,
            saved: false
        },
        {
            title: '父子关系',
            width: '60px',
            code: 'parent',
            changed: false,
            saved: false
        },
        {
            title: '餐饮调查表',
            width: '80px',
            code: 'res',
            changed: false,
            saved: false
        },
        {
            title: '深度信息',
            width: '60px',
            code: 'deepInfo',
            changed: false,
            saved: false
        },
        {
            title: '邮政编码',
            width: '60px',
            code: 'postCode',
            changed: false,
            saved: false
        },
        {
            title: 'CHAIN',
            width: '50px',
            code: 'chain',
            changed: false,
            saved: false
        },
        {
            title: 'POI ICON',
            width: '70px',
            code: 'poiIcon',
            changed: false,
            saved: false
        },
        {
            title: '标注',
            width: '40px',
            code: 'label',
            changed: false,
            saved: false
        },
        {
            title: '备注',
            width: '40px',
            code: 'poiMemo',
            changed: false,
            saved: false
        }
    ];
    // 质检方式
    $scope.qualityMethods = ['质检', 'PC对应', 'WS一室对应', 'WS二室对应', '外业评价', '客户评价', '客户问联'];
    // 初步原因
    $scope.preLiCauseArray = [
        {
            title: '标准规范',
            deep: ['标准/手册定义模糊有歧义', '对标准/手册的理解错误', '其他']
        },
        {
            title: '采集',
            deep: ['盲目追求绩效，导致未按照要求作业', '没有按照城市规划的要求覆盖', '受极端天气影响，赶工作业', '数据交接不及时', '未按照作业要求的车速行驶',
                '现场路况复杂，确认不准确', '现场遮挡致使错误发生', '由于参照物的改变，导致属性缺失或错误', '照片（录像）拍摄不清晰', '照片号对应错误',
                '作业工艺不适合', '作业所需图层打开不完整', '作业员工作情绪不稳定，思想不再工作上', '其他']
        },
        {
            title: '工具',
            deep: ['数据的损坏或丢失', '设备问题', '作业程序存在BUG', '检查程序存在BUG', 'GPS精度问题', '其他']
        },
        {
            title: '来源',
            deep: ['数据格式转换问题', '原始数据版本错误', '作业过程中交接错误', '情报未提供', '其他']
        },
        {
            title: '流程',
            deep: ['超出了更新规定的范围', '错误理解了项目的范围及流程', '封信频率不同导致了规格变更，引起的不一致', '检查及检测环节未执行',
                '流程的过时、缺失或不完整', '流程中品质控制点失控，如：理论检查结果未处理', '人员培训及考核不足', '使用批处理程序更新的', '其他']
        },
        {
            title: '录入',
            deep: ['预处理错误', '预处理遗漏', '交叉录入问题', '不正确或多余的录入（内业）', '未对照照片/录像进行检查', '内业录入的遗漏（内业）',
                '接边错误或遗漏', '其他']
        },
        {
            title: '前期规划',
            deep: ['重要区域划分不合理', '未按前期规划实施', '分类舍弃不合理', '策略规划导致未更新', '策略规划导致属性更新不全面', '其他']
        },
        {
            title: '现场变化',
            deep: ['外业作业时正在施工/维修的区域', '很近期的变化', '知道变化，但更新计划与监察时间冲突', '不知道相关的变化', '知道变化，但没有时间去更新', '其他']
        }
    ];

    // 获取变更的字段
    var getChanges = function () {
        var _changes = objectEditCtrl.data.getChanges();
        // 字段对比
        if (_changes) {
            for (var i = 0; i < $scope.exQuaTitles.length; i++) {
                for (var key in _changes) {
                    if ($scope.exQuaTitles[i].code == key) {
                        $scope.exQuaTitles[i].changed = true;
                    }
                }
            }
        }
        // 采集端变更
        // 需求暂停，暂时注释
        // if (objectEditCtrl.data.rawFields) {
        //     if (objectEditCtrl.data.rawFields.indexOf('1') > -1) {
        //         $scope.exQuaTitles[0].changed = true;
        //     }
        // }
    };

    // 判断已保存的字段
    var getSaved = function () {
        if ($scope.quaDataList.length) {
            for (var i = 0; i < $scope.exQuaTitles.length; i++) {
                for (var j = 0; j < $scope.quaDataList.length; j++) {
                    if ($scope.exQuaTitles[i].title == $scope.quaDataList[j].classMedium) {
                        $scope.exQuaTitles[i].saved = true;
                    }
                }
            }
        }
    };

    // 根据初步原因，返回深度原因值域
    var getDeepReasons = function (value) {
        for (var i = 0; i < $scope.preLiCauseArray.length; i++) {
            if ($scope.preLiCauseArray[i].title == value) {
                $scope.primaryCauseArray = $scope.preLiCauseArray[i].deep;
                break;
            }
        }
    };

    var setDefaultField = function (obj) {
        $scope.exQuaData.city = obj.city;
        $scope.exQuaData.province = obj.province;
        $scope.exQuaData.collectorTime = obj.collectorTime;
        $scope.exQuaData.collectorUser = obj.collectorUser;

        $scope.exQuaData.checkMode = oldCheckMode;
        $scope.exQuaData.group = oldGroup;
        $scope.exQuaData.version = oldVersion;
        $scope.exQuaData.confirmUser = oldConfirmUser;
    };

    // 获取初始化属性值
    var getInitValue = function () {
        $scope.exQuaData = {
            problemLevel: 'C',
            poiNum: objectEditCtrl.data.poiNum,    // IDCode
            kindCode: objectEditCtrl.data.kindCode,    // 分类
            meshId: objectEditCtrl.data.meshId    // 图幅号
        };
        $scope.gridApi.selection.clearSelectedRows();
        $scope.showModelLoading = true;
        // 如果已经查出来直接赋值
        if (!initValue) {
            dsEdit.getInitValueForProblem(objectEditCtrl.data.pid).then(function (data) {
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

    //  用来记录作业员点击保存按钮时填写的通用信息，切换空白记录页签后，不用重复填写
    var setOldParams = function () {
        oldCheckMode = $scope.exQuaData.checkMode;
        oldGroup = $scope.exQuaData.group;
        oldVersion = $scope.exQuaData.version;
        oldConfirmUser = $scope.exQuaData.confirmUser;
    };

    // 判断当前是否有错误数据
    var chargeQuaData = function (title) {
        if ($scope.quaDataList.length) {
            // 如果通过标签页点击
            if (title) {
                var activeIndex = -1;
                for (var j = 0; j < $scope.quaDataList.length; j++) {
                    // 所选tab恰好是已经有的问题
                    if ($scope.quaDataList[j].classMedium == title) {
                        $scope.exQuaData = $scope.quaDataList[j];
                        activeIndex = j;
                        break;
                    }
                    // 所选tab是新的，则为新增
                    if (j == $scope.quaDataList.length - 1 && $scope.quaDataList[j].classMedium != title) {
                        getInitValue();
                    }
                }
                if (activeIndex > -1) {
                    $timeout(function () {
                        $scope.gridApi.selection.selectRowByVisibleIndex(activeIndex);
                    });
                }
            } else {
                $scope.exQuaData = $scope.quaDataList[0];
                setOldParams();
                $timeout(function () {
                    $scope.gridApi.selection.selectRowByVisibleIndex(0);
                });
            }
            for (var i = 0; i < $scope.exQuaTitles.length; i++) {
                if ($scope.exQuaTitles[i].title == $scope.exQuaData.classMedium) {
                    $scope.activeTab = $scope.exQuaTitles[i];
                    $scope.exQuaData.poiNum = objectEditCtrl.data.poiNum;
                    $scope.originQuaData = angular.copy($scope.exQuaData);
                    break;
                }
            }
        } else {
            getInitValue();
        }
    };

    // 获取分类 图幅号和idCode
    var getObjInfo = function () {
        $scope.exQuaData.poiNum = objectEditCtrl.data.poiNum;    // IDCode
        $scope.exQuaData.kindCode = objectEditCtrl.data.kindCode;    // 分类
        $scope.exQuaData.meshId = objectEditCtrl.data.meshId;    // 图幅号
        $scope.exQuaData.level = objectEditCtrl.data.level;    // poi等级
    };

    // 处理五级联动 数据
    var getProblemData = function (objectType, objectKind, problemType, problemKind, problemPhen) {
        // var problemJson = FM.dataApi.Constant.Column.problemData;
        var temp;
        var data = [];
        for (var i = 0; i < problemJson.length; i++) {
            temp = problemJson[i].split('|');
            if (objectType) {
                if (objectType == temp[0]) {
                    if (objectKind) {
                        if (objectKind == temp[1]) {
                            if (problemType) {
                                if (problemType == temp[2]) {
                                    if (problemKind) {
                                        if (problemKind == temp[3]) {
                                            if (problemPhen) {
                                                // if (problemPhen == temp[5]) {
                                                //     data.push(temp[4] + '' + temp[6]);
                                                //     break;
                                                // }
                                            } else {
                                                data.push(temp[5]);
                                            }
                                        }
                                    } else {
                                        if (data.indexOf(temp[3]) < 0) {
                                            data.push(temp[3]);
                                        }
                                    }
                                }
                            } else {
                                if (data.indexOf(temp[2]) < 0) {
                                    data.push(temp[2]);
                                }
                            }
                        }
                    } else {
                        if (data.indexOf(temp[1]) < 0) {
                            data.push(temp[1]);
                        }
                    }
                }
            } else {
                if (data.indexOf(temp[0]) < 0) {
                    data.push(temp[0]);
                }
            }
        }
        return data;
    };

    // 切换问题分类
    $scope.changeProblemKind = function (value) {
        $scope.quesTypes = [];
        if (!value) {
            $scope.exQuaData.problemType = '';
            $scope.exQuaData.problemPhenomenon = '';
            return;
        }
        $scope.quesTypes = getProblemData('POI', $scope.activeTab.title, value);
        if ($scope.quesTypes.length == 1) {
            $scope.exQuaData.problemType = $scope.quesTypes[0];
            $scope.changeProblemType($scope.exQuaData.problemType);
        } else {
            $scope.exQuaData.problemType = '';
            $scope.exQuaData.problemPhenomenon = '';
        }
    };

    // 切换问题类型
    $scope.changeProblemType = function (value) {
        $scope.quesPhens = [];
        if (!value) {
            $scope.exQuaData.problemPhenomenon = '';
            return;
        }
        $scope.quesPhens = getProblemData('POI', $scope.activeTab.title, $scope.exQuaData.classBottom, value);
        if ($scope.quesPhens.length == 1) {
            $scope.exQuaData.problemPhenomenon = $scope.quesPhens[0];
        } else {
            $scope.exQuaData.problemPhenomenon = '';
        }
    };

    // 切换问题现象
    $scope.changeProblemPhen = function (value) {
        $scope.exQuaData.problemLevel = '';
        $scope.exQuaData.problemLevel = getProblemData('POI', $scope.activeTab.title, $scope.exQuaData.classBottom, $scope.exQuaData.problemType, value);
    };

    // 切换初步原因
    $scope.changeIntialCause = function (value) {
        getDeepReasons(value);
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

    // 初始化联动，统一 显示
    var initAllProblemData = function () {
        $scope.quesKinds = getProblemData('POI', $scope.activeTab.title);
        $scope.quesTypes = [];
        $scope.quesPhens = [];
        $scope.primaryCauseArray = [];
        if ($scope.exQuaData.classBottom) {
            $scope.quesTypes = getProblemData('POI', $scope.activeTab.title, $scope.exQuaData.classBottom);
        }
        if ($scope.exQuaData.problemType) {
            $scope.quesPhens = getProblemData('POI', $scope.activeTab.title, $scope.exQuaData.classBottom, $scope.exQuaData.problemType);
        }
    };

    // 初始化版本号
    var initVersion = function () {
        var today = new Date();
        var year = today.getFullYear() % 2000 + 1;
        $scope.versionNums = [year + '冬', year + '秋', year + '夏', year + '春', (year - 1) + '冬', (year - 1) + '秋', (year - 1) + '夏', (year - 1) + '春', (year - 2) + '冬', (year - 2) + '秋', (year - 2) + '夏', (year - 2) + '春'];
    };

    // 查询问题列表 参数 是否定位到首个数据
    var queryProblemList = function (flag) {
        var param = {
            poiNum: objectEditCtrl.data.poiNum,
            classTop: 'POI',
            subtaskId: App.Temp.subTaskId
        };
        $scope.showModelLoading = true;
        dsEdit.queryProblemList(param).then(function (data) {
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
                getObjInfo();
                initAllProblemData();
                getDeepReasons($scope.exQuaData.intialCause);
            } else {
                chargeQuaData($scope.activeTab.title);
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
            field: 'checkUser',
            displayName: '质检人',
            minWidth: 70,
            enableSorting: true,
            visible: true
        }, {
            field: 'checkTime',
            displayName: '质检日期',
            enableSorting: true,
            minWidth: 80,
            visible: true
        }, {
            field: 'checkMode',
            displayName: '质检方式',
            minWidth: 70,
            enableSorting: true,
            visible: true
        }, {
            field: 'classMedium',
            displayName: '质检属性',
            minWidth: 70,
            enableSorting: true,
            visible: true
        }, {
            field: 'classBottom',
            displayName: '问题分类',
            minWidth: 70,
            enableSorting: true,
            visible: true
        }, {
            field: 'problemType',
            displayName: '问题类型',
            minWidth: 79,
            enableSorting: true,
            visible: true
        }, {
            field: 'problemPhenomenon',
            displayName: '问题现象',
            minWidth: 150,
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
        // $scope.exQuaData = {};
        // $scope.quaDataList = [];
        $scope.showModelLoading = true;
        // 从元数据查询错误信息
        dsEdit.queryQualityRelation().then(function (data) {
            $scope.showModelLoading = false;
            problemJson = data;
            $scope.primaryCauseArray = [];
            // 当前标签（tab页）
            $scope.activeTab = $scope.exQuaTitles[0];
            // 初始化下拉值域
            initVersion();
            queryProblemList(true);
        });
    };

    // 编辑质检信息
    $scope.quaDataEdit = function (item) {
        for (var i = 0; i < $scope.exQuaTitles.length; i++) {
            if (item.classMedium == $scope.exQuaTitles[i].title) {
                $scope.activeTab = $scope.exQuaTitles[i];
                getObjInfo();
            }
        }
        $scope.exQuaData = item;
        initAllProblemData();
        getDeepReasons($scope.exQuaData.intialCause);
        $scope.originQuaData = angular.copy($scope.exQuaData);
    };

    // 删除质检信息
    $scope.quaDataDelete = function (item, index) {
        var param = {
            command: 'DELETE',
            problemNum: item.problemNum
        };
        $scope.showModelLoading = true;
        dsEdit.operateProblem(param).then(function (data) {
            $scope.showModelLoading = false;
            $scope.quaDataList.splice(index, 1);
            for (var k = 0; k < $scope.exQuaTitles.length; k++) {
                if ($scope.exQuaTitles[k].title == item.classMedium) {
                    $scope.exQuaTitles[k].saved = false;
                }
            }
            $scope.exQuaData = {};
            if (!$scope.quaDataList.length) {
                getInitValue();
                return;
            }
            chargeQuaData($scope.quaDataList[0].classMedium);
            // getObjInfo();
            initAllProblemData();
            // poi质检问题查看
            $scope.initData();
        });
    };

    // 过滤数据
    var getIntegrateData = function (type, data) {
        var cData = angular.copy(data);
        var taskCookie = App.Util.getSessionStorage('SubTask');
        var result = {};
        result.problemNum = cData.problemNum;
        result.checkMode = cData.checkMode;
        result.group = cData.group;
        result.classBottom = cData.classBottom;
        result.problemType = cData.problemType || '';
        result.problemPhenomenon = cData.problemPhenomenon || '';
        result.problemLevel = cData.problemLevel || 'C';
        result.problemDescription = cData.problemDescription || '';
        result.intialCause = cData.intialCause;
        result.rootCause = cData.rootCause;
        result.memo = cData.memo;
        result.version = cData.version;
        result.confirmUser = cData.confirmUser;
        if (!type) {
            // 新增
            delete result.problemNum;
            result.province = cData.province;
            result.city = cData.city;
            result.subtaskId = taskCookie.subTaskId;
            result.level = cData.level;
            result.meshId = cData.meshId;
            result.poiNum = cData.poiNum;
            result.kindCode = cData.kindCode;
            result.classTop = 'POI';
            result.classMedium = $scope.activeTab.title;
            result.collectorUser = cData.collectorUser;
            result.collectorTime = cData.collectorTime;
            result.confirmUser = cData.confirmUser;
        }
        return result;
    };

    // 新增 编辑数据
    $scope.quaDoSave = function () {
        var param = {};
        var i;
        // 校验
        var tempArray = ['checkMode', 'group', 'classBottom', 'problemType', 'problemPhenomenon', 'problemLevel', 'problemDescription', 'intialCause', 'rootCause', 'version'];
        for (i = 0; i < tempArray.length; i++) {
            if (!$scope.exQuaData[tempArray[i]]) {
                swal('提示', '必填项不能为空！', 'warning');
                return;
            }
        }

        setOldParams();

        // 编辑
        if ($scope.exQuaData.problemNum) {
            param.command = 'UPDATE';
            var modifyData = getIntegrateData(1, $scope.exQuaData);
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
            result.problemNum = modifyData.problemNum;
            param.data = result;
        } else {
            // 新增
            param.command = 'ADD';
            param.data = getIntegrateData(0, $scope.exQuaData);
        }
        $scope.showModelLoading = true;
        dsEdit.operateProblem(param).then(function (data) {
            if (param.command == 'ADD') {
                queryProblemList();
            } else {
                // 修改后  更新originQuaData
                $scope.originQuaData = angular.copy($scope.exQuaData);
                for (var k = 0; k < $scope.exQuaTitles.length; k++) {
                    if ($scope.exQuaTitles[k].title == $scope.exQuaData.classMedium) {
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
        chargeQuaData(label.title);
        getObjInfo();
        // 初始化下拉值域
        initAllProblemData();
        getDeepReasons($scope.exQuaData.intialCause);
        // $scope.quesKinds = getProblemData('POI', $scope.activeTab.title);
    };
    
    $scope.initData();
    // getChanges();

    $scope.$on('$destroy', function () {
        initValue = null;
    });
}]);
