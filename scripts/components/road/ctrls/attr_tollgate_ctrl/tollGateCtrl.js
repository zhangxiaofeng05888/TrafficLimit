/**
 * Created by wangmingdong on 2016/8/5.
 */
angular.module('app').controller('TollGateCtl', ['$scope', 'dsEdit', 'dsMeta', 'appPath', '$ocLazyLoad', '$timeout', function ($scope, dsEdit, dsMeta, appPath, $ocLazyLoad, $timeout) {
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var relationData = layerCtrl.getLayerById('relationData');

    /* 收费方式*/
    $scope.tollFormOptions = [
        { id: 100, label: '未调查' },
        { id: 101, label: 'ETC' },
        { id: 102, label: '现金' },
        { id: 103, label: '银行卡（借记卡）' },
        { id: 104, label: '信用卡' },
        { id: 105, label: 'IC卡' },
        { id: 106, label: '预付卡' }
    ];

    /* 收费标牌采集*/
    $scope.photoFlagObj = [
        { id: 1, label: '未采集' },
        { id: 2, label: '现场无标牌' },
        { id: 3, label: '已采集，已录入' },
        { id: 4, label: '已采集，未录入' },
        { id: 5, label: '不需要采集' }
    ];
    $scope.showTollform = function (tollType) {
        var result = '';
        if (tollType === 0) {
            result = '未调查';
        }
        var towbin = tollType.toString();
        if (towbin.length) {
            towbin += '0';
            for (var i = 0; i < towbin.length; i++) {
                if (towbin.split('').reverse()[i] == '1') {
                    result += $scope.tollFormOptions[i].label + '  ';
                }
            }
        }
        return result;
    };

    // 语言代码对应关系
    $scope.langCodeRelation = {
        CHI: 1,
        CHT: 2,
        ENG: 3,
        POR: 4,
        ARA: 5,
        BUL: 6,
        CZE: 7,
        DAN: 8,
        DUT: 9,
        EST: 10,
        FIN: 11,
        FRE: 12,
        GER: 13,
        HIN: 14,
        HUN: 15,
        ICE: 16,
        IND: 17,
        ITA: 18,
        JPN: 19,
        KOR: 20,
        LIT: 21,
        NOR: 22,
        POL: 23,
        RUM: 24,
        RUS: 25,
        SLO: 26,
        SPA: 27,
        SWE: 28,
        THA: 29,
        TUR: 30,
        UKR: 31,
        SCR: 32
    };
    $scope.langCodeOptions = [
        { id: 'CHI', label: '简体中文' },
        { id: 'CHT', label: '繁体中文' },
        { id: 'ENG', label: '英文' },
        { id: 'POR', label: '葡萄牙文' },
        { id: 'ARA', label: '阿拉伯语' },
        { id: 'BUL', label: '保加利亚语' },
        { id: 'CZE', label: '捷克语' },
        { id: 'DAN', label: '丹麦语' },
        { id: 'DUT', label: '荷兰语' },
        { id: 'EST', label: '爱沙尼亚语' },
        { id: 'FIN', label: '芬兰语' },
        { id: 'FRE', label: '法语' },
        { id: 'GER', label: '德语' },
        { id: 'HIN', label: '印地语' },
        { id: 'HUN', label: '匈牙利语' },
        { id: 'ICE', label: '冰岛语' },
        { id: 'IND', label: '印度尼西亚语' },
        { id: 'ITA', label: '意大利语' },
        { id: 'JPN', label: '日语' },
        { id: 'KOR', label: '韩语' },
        { id: 'LIT', label: '立陶宛语' },
        { id: 'NOR', label: '挪威语' },
        { id: 'POL', label: '波兰语' },
        { id: 'RUM', label: '罗马尼亚语' },
        { id: 'RUS', label: '俄语' },
        { id: 'SLO', label: '斯洛伐克语' },
        { id: 'SPA', label: '西班牙语' },
        { id: 'SWE', label: '瑞典语' },
        { id: 'THA', label: '泰国语' },
        { id: 'TUR', label: '土耳其语' },
        { id: 'UKR', label: '乌克兰语' },
        { id: 'SCR', label: '克罗地亚语' }
    ];


    // 刷新tollGateData.names
    $scope.refreshNames = function () {
        $scope.tollGateData.names = [];
        for (var i = 0, len = $scope.nameGroup.length; i < len; i++) {
            for (var j = 0, le = $scope.nameGroup[i].length; j < le; j++) {
                $scope.tollGateData.names.unshift($scope.nameGroup[i][j]);
            }
        }
    };
    /* 根据数据中对象某一属性值排序*/
    function compare(propertyName) {
        return function (object1, object2) {
            var value1 = object1[propertyName];
            var value2 = object2[propertyName];
            var result;
            if (value1 < value2) {
                result = -1;
            } else if (value1 > value2) {
                result = 1;
            } else {
                result = 0;
            }
            return result;
        };
    }

    function initNameInfo() {
        if ($scope.tollGateData.names.length > 0) {
            $scope.nameGroup = [];

            $scope.tollGateData.names.sort(compare('nameGroupid'));
            // 获取所有的nameGroupid
            var nameGroupidArr = [];
            for (var i = 0; i < $scope.tollGateData.names.length; i++) {
                nameGroupidArr.push($scope.tollGateData.names[i].nameGroupid);
            }
            // 去重
            nameGroupidArr = Utils.distinctArr(nameGroupidArr);
            for (var ie = 0, len = nameGroupidArr.length; ie < len; ie++) {
                var tempArr = [];
                for (var j = 0, le = $scope.tollGateData.names.length; j < le; j++) {
                    if ($scope.tollGateData.names[j].nameGroupid == nameGroupidArr[ie]) {
                        tempArr.push($scope.tollGateData.names[j]);
                        tempArr.sort(function (a, b) {
                            return $scope.langCodeRelation[a.langCode] - $scope.langCodeRelation[b.langCode];
                        });
                    }
                }
                $scope.nameGroup.push(tempArr);
            }
            $scope.refreshNames();
        }
    }
    $scope.refreshData = function () {
        dsEdit.getByPid(parseInt($scope.tollGateData.pid, 10), 'RDTOLLGATE').then(function (data) {
            if (data) {
                objCtrl.setCurrentObject('RDTOLLGATE', data);
                objCtrl.setOriginalData(objCtrl.data.getIntegrate());
            }
        });
    };

    $ocLazyLoad.load(appPath.road + 'ctrls/attr_tollgate_ctrl/tollGateNameCtrl.js');
    $ocLazyLoad.load(appPath.road + 'ctrls/attr_tollgate_ctrl/tollGatePassageCtrl.js');
    /* 增加group */
    $scope.addGroup = function () {
        $scope.refreshNames();
        var maxNameGroupId = 0;
        if ($scope.tollGateData.names.length > 0) {
            maxNameGroupId = Utils.getArrMax($scope.tollGateData.names, 'nameGroupid');
        }
        objCtrl.data.names.unshift(fastmap.dataApi.rdTollgateName({
            nameGroupid: maxNameGroupId + 1
        }));
        initNameInfo();
    };

    /* 记住当前组和当前组组内的选中 */
    $scope.rememberNameNum = function (fIndex, cIndex) {
        $scope.currentGroupIndex = fIndex;
        $scope.currentItempIndex = cIndex;
        objCtrl.namesInfos = $scope.nameGroup[fIndex][cIndex];
        objCtrl.currentGroup = $scope.nameGroup[fIndex];
    };
    /* removeGroup 删除名称组*/
    $scope.removeGroup = function (pIndex) {
        $scope.nameGroup.splice(pIndex, 1);
        for (var i = 0; i < $scope.nameGroup.length; i++) {
            if (i >= pIndex) {
                for (var j = 0; j < $scope.nameGroup[i].length; j++) {
                    $scope.nameGroup[i][j].nameGroupid--;
                }
            }
        }
        $scope.refreshNames();
        initNameInfo();
    };
    /* 切换收费类型*/
    $scope.changeChargeType = function () {
        var i;
        var len;
        if ($scope.tollGateData.type == 1 || $scope.tollGateData.type == 8 || $scope.tollGateData.type == 9 || $scope.tollGateData.type == 10) {
            for (i = 0, len = $scope.tollGateData.passages.length; i < len; i++) {
                $scope.tollGateData.passages[i].tollForm = 0;
                // 收费站类型为“领卡”或“持卡打标识不收费”或“验票领卡”或“交卡不收费”，收费通道的领卡类型只能有“ETC”或“人工”
                // if ($scope.tollGateData.passages[i].cardType != 1 && $scope.tollGateData.passages[i].cardType != 2) {
                $scope.tollGateData.passages[i].cardType = 2;
                // }
            }
        } else if ($scope.tollGateData.type == 2 || $scope.tollGateData.type == 3 || $scope.tollGateData.type == 4 || $scope.tollGateData.type == 5 || $scope.tollGateData.type == 6 || $scope.tollGateData.type == 7) {
            for (i = 0, len = $scope.tollGateData.passages.length; i < len; i++) {
                $scope.tollGateData.passages[i].cardType = 0;
                // 若收费站类型是交卡付费、固定收费（次费）、交卡付费后再领卡、交卡付费并代收固定费用、验票（无票收据）、领卡并代收固定费用，则收费通道的收费方式只能是“现金”
                // if ($scope.tollGateData.passages[i].tollForm != 0 && $scope.tollGateData.passages[i].tollForm != 1) {
                $scope.tollGateData.passages[i].tollForm = 10;
                // }
            }
        } else if ($scope.tollGateData.type == 0) {
            for (i = 0, len = $scope.tollGateData.passages.length; i < len; i++) {
                $scope.tollGateData.passages[i].cardType = 0;
                $scope.tollGateData.passages[i].tollForm = 0;
            }
            // 收费站类型为未调查时，收费通道数为0，通道信息为空，ETC模式图为空
            $scope.tollGateData.passages = [];
        }
        $scope.tollGateData.etcFigureCode = $scope.changeEtcCode();
    };

    $scope.passagesIndex = 0;
    /* 查看详情*/
    $scope.showDetail = function (type, index, nameInfo, nameGroupid) {
        var tempCtr, // = '',
            tempTepl, // = '',
            detailInfo;// = {};
        detailInfo = {};
        if (type == 'name') {
            // 这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
            var showNameInfoObj = {
                loadType: 'subAttrTplContainer',
                propertyCtrl: 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
                propertyHtml: '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
                callback: function () {
                    var showNameObj = {
                        loadType: 'subAttrTplContainer',
                        propertyCtrl: 'scripts/components/road/ctrls/attr_tollgate_ctrl/tollGateNameCtrl',
                        propertyHtml: '../../../scripts/components/road/tpls/attr_tollgate_tpl/tollGateNameTpl.html'
                    };
                    $scope.$emit('transitCtrlAndTpl', showNameObj);
                }
            };
            // objCtrl.namesInfos = $scope.getItemByNameGroupid($scope.nameGroup, nameGroupid);
            $scope.$emit('transitCtrlAndTpl', showNameInfoObj);
        } else {
            $scope.passagesIndex = index;
            tempCtr = appPath.road + 'ctrls/attr_tollgate_ctrl/tollGatePassageCtrl';
            tempTepl = appPath.root + appPath.road + 'tpls/attr_tollgate_tpl/tollGatePassageTpl.html';
            detailInfo = {
                loadType: 'subAttrTplContainer',
                propertyCtrl: tempCtr,
                propertyHtml: tempTepl,
                data: $scope.tollGateData.passages[index]
            };
            objCtrl.passageInfo = $scope.tollGateData.passages[index];
            $scope.$emit('transitCtrlAndTpl', detailInfo);
        }
        $scope.tollGateNameData = detailInfo;
        $scope.tollGatePassageData = objCtrl.data.passages[index];
    };
    /** **
     * 根据nameGroupid获取对应的数据
     */
    $scope.getItemByNameGroupid = function (arr, nameGroupid) {
        var index = -1;
        var item;
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < arr[i].length; j++) {
                if (arr[i][j].nameGroupid == nameGroupid) {
                    index = i;
                    break;
                }
            }
            if (index >= 0) {
                item = arr[i];
                break;
            }
        }
        return item;
    };
    /* 自动计算ETC代码*/
    $scope.changeEtcCode = function () {
        var _code = '';
        var i;
        var len;
        var passageLen = $scope.tollGateData.passages.length;
        if (passageLen == 0) {
            _code = '';
        } else if (passageLen < 6) {
            _code = 'T0' + passageLen;
            for (i = 0, len = passageLen; i < len; i++) {
                if ($scope.tollGateData.passages[i].tollForm == 1 || $scope.tollGateData.passages[i].cardType == 1) {
                    _code += '1';
                } else {
                    _code += '0';
                }
            }
            if (_code.length < 8) {
                for (var ie = 0, lene = 8 - _code.length; ie < lene; ie++) {
                    _code += '0';
                }
            }
        } else {
            _code = 'T00';
            var _times = Math.floor(passageLen / 3);
            var _left = 0;
            var _middle = 0;
            var _right = 0;
            if (passageLen % 3 == 0) {
                for (i = 1; i <= passageLen; i += _times) {
                    for (var j = i; j < i + _times; j++) {
                        if ($scope.tollGateData.passages[j - 1].tollForm == 1 || $scope.tollGateData.passages[j - 1].cardType == 1) {
                            if (i < _times + 1) {
                                _left = 1;
                            } else if (i < passageLen - _times + 1) {
                                _middle = 1;
                            } else {
                                _right = 1;
                            }
                        }
                    }
                }
            } else if (passageLen % 3 == 1) {
                for (i = 1; i <= passageLen; i++) {
                    if ($scope.tollGateData.passages[i - 1].tollForm == 1 || $scope.tollGateData.passages[i - 1].cardType == 1) {
                        if (i < _times + 1) {
                            _left = 1;
                        } else if (i < passageLen - _times + 1) {
                            _middle = 1;
                        } else {
                            _right = 1;
                        }
                    }
                }
            } else if (passageLen % 3 == 2) {
                for (i = 1; i <= passageLen; i++) {
                    if ($scope.tollGateData.passages[i - 1].tollForm == 1 || $scope.tollGateData.passages[i - 1].cardType == 1) {
                        if (i < _times + 2) {
                            _left = 1;
                        } else if (i < ((passageLen + 1) / 3) * 2) {
                            _middle = 1;
                        } else {
                            _right = 1;
                        }
                    }
                }
            }
            _code = _code + _left + _middle + _right + '00';
        }
        return _code;
    };
    /* 私有方法 */
    function getSelectedLangCode() {
        $scope.selectedLangcodeArr.length = 0;
        for (var k in $scope.tollgateNames) {
            if ($scope.selectedLangcodeArr.indexOf($scope.tollgateNames[k].langCode) < 0) {
                $scope.selectedLangcodeArr.push($scope.tollgateNames[k].langCode);
            }
        }
    }
    // 英文翻译
    var translateName = function () {
        // 标识多音字是否已经选完
        var flag = true;
        for (var i = 0; i < $scope.tollgateNames[0].phoneticArr.length; i++) {
            if ($scope.tollgateNames[0].phoneticArr[i].length > 1) {
                flag = false;
                break;
            }
        }
        if (!flag) {
            return;
        }
        var nParam = {
            word: $scope.tollgateNames[0].name,
            languageType: 'eng',
            pinyin: $scope.tollgateNames[0].phoneticArr.join(' ')
        };
        dsMeta.nameTranslate(nParam).then(function (data) {
            if (data.errcode == 0) {
                for (var j = 0; j < $scope.tollgateNames.length; j++) {
                    if ($scope.tollgateNames[j].langCode == 'ENG') {
                        $scope.tollgateNames[j].name = data.data.eng;
                    }
                }
            } else {
                swal('查找失败', '可能是服务出错或者输入过长，请重新尝试', 'error');
            }
            $scope.refreshNames();
        });
    };
    /* 增加item*/
    $scope.addNameItem = function (currentGroupIndex) {
        var groupId = $scope.nameGroup[currentGroupIndex][0].nameGroupid;
        $scope.tollgateNames = $scope.getItemByNameGroupid($scope.nameGroup, groupId);
        getSelectedLangCode();
        for (var i = 0; i < $scope.langCodeOptions.length; i++) {
            if ($scope.selectedLangcodeArr.indexOf($scope.langCodeOptions[i].id) === -1) {
                if (!($scope.selectedLangcodeArr.indexOf('CHI') > -1 || $scope.selectedLangcodeArr.indexOf('CHT') > -1) || !($scope.langCodeOptions[i].id === 'CHI' || $scope.langCodeOptions[i].id === 'CHT')) {
                    if ($scope.langCodeOptions[i].id == 'ENG') {
                        $scope.tollgateNames.push(fastmap.dataApi.rdTollgateName({
                            nameGroupid: $scope.tollgateNames[0].nameGroupid,
                            langCode: 'ENG',
                            name: ''
                        }));
                        translateName();
                    } else {
                        $scope.tollgateNames.push(fastmap.dataApi.rdTollgateName({
                            nameGroupid: $scope.tollgateNames[0].nameGroupid,
                            langCode: $scope.langCodeOptions[i].id
                        }));
                    }
                    break;
                }
            }
        }
        $scope.refreshNames();
    };
    /* 增加item*/
    $scope.addItem = function (type) {
        if (type == 'name') {
            $scope.refreshNames();
            var maxNameGroupId = 0;
            if ($scope.tollGateData.names.length > 0) {
                maxNameGroupId = Utils.getArrMax($scope.tollGateData.names, 'nameGroupid');
            }
            objCtrl.data.names.unshift(fastmap.dataApi.rdTollgateName({
                nameGroupid: maxNameGroupId + 1
            }));
            initNameInfo();
        } else if (objCtrl.data.passages.length < 16) {
            if ($scope.tollGateData.type == 1 || $scope.tollGateData.type == 8 || $scope.tollGateData.type == 9 || $scope.tollGateData.type == 10) {
                objCtrl.data.passages.push(fastmap.dataApi.rdTollgatePassage({
                    cardType: 2,
                    tollForm: 0,
                    seqNum: $scope.tollGateData.passages.length + 1
                }));
            } else if ($scope.tollGateData.type == 2 || $scope.tollGateData.type == 3 || $scope.tollGateData.type == 4 || $scope.tollGateData.type == 5 || $scope.tollGateData.type == 6 || $scope.tollGateData.type == 7) {
                objCtrl.data.passages.push(fastmap.dataApi.rdTollgatePassage({
                    cardType: 0,
                    tollForm: 0,
                    seqNum: $scope.tollGateData.passages.length + 1
                }));
            } else if ($scope.tollGateData.type == 0) {
                swal('操作禁止', '未调查收费类型不允许增加通道信息。', 'info');
            }
            $scope.tollGateData.etcFigureCode = $scope.changeEtcCode();
            $scope.tollGateData.passageNum = objCtrl.data.passages.length;
            $scope.showDetail('passage', 0);
        }
    };
    /* 移除item*/
    $scope.removeItem = function (index, pIndex, type, item) {
        var i;
        var j;
        var len;
        var le;
        if (type == 'name') {
            if (item.langCode === 'CHI' || item.langCode === 'CHT') {
                $scope.nameGroup.splice(pIndex, 1);
                for (i = 0; i < $scope.nameGroup.length; i++) {
                    if (i >= pIndex) {
                        for (j = 0; j < $scope.nameGroup[i].length; j++) {
                            $scope.nameGroup[i][j].nameGroupid--;
                        }
                    }
                }
            } else {
                for (i = 0, len = $scope.nameGroup.length; i < len; i++) {
                    if ($scope.nameGroup[i]) {
                        for (j = 0, le = $scope.nameGroup[i].length; j < le; j++) {
                            if ($scope.nameGroup[i][j] === item) {
                                if ($scope.nameGroup[i].length == 1) {
                                    $scope.nameGroup.splice(i, 1);
                                    for (var n = 0, nu = $scope.nameGroup.length; n < nu; n++) {
                                        if (n >= i) {
                                            for (var m = 0, num = $scope.nameGroup[n].length; m < num; m++) {
                                                $scope.nameGroup[n][m].nameGroupid--;
                                            }
                                        }
                                    }
                                } else {
                                    $scope.nameGroup[i].splice(index, 1);
                                }
                            }
                        }
                    }
                }
            }
        } else {
            $scope.tollGateData.passages.splice(index, 1);
            $scope.tollGateData.etcFigureCode = $scope.changeEtcCode();
            for (i = index, len = $scope.tollGateData.passages.length; i < len; i++) {
                $scope.tollGateData.passages[i].seqNum--;
            }
            $scope.tollGateData.passageNum = objCtrl.data.passages.length;
        }

        $scope.refreshNames();
    };
    // 选择ETC时
    $scope.$on('tollGateCardType', function (event, data) {
        $scope.changeChargeType();
    });
    /* 监听刷新ETC代码*/
    $scope.$on('refreshEtcCode', function (event, data) {
        $scope.tollGateData.etcFigureCode = $scope.changeEtcCode();
    });
    /* 收费站类型*/
    $scope.tollTypeObj = [
        { id: 0, label: '未调查' },
        { id: 1, label: '领卡' },
        { id: 2, label: '交卡付费' },
        { id: 3, label: '固定收费（次费）' },
        { id: 4, label: '交卡付费后再领卡' },
        { id: 5, label: '交卡付费并代收固定费用' },
        { id: 6, label: '验票（无票收费）值先保留' },
        { id: 7, label: '领卡并代收固定费用' },
        { id: 8, label: '持卡打标识不收费' },
        { id: 9, label: '验票领卡' },
        { id: 10, label: '交卡不收费' }
    ];

    /* 是否跨省*/
    $scope.locationFlagObj = {
        0: '未调查',
        1: '本省',
        2: '跨省'
    };

    /* 领卡类型*/
    $scope.cardTypeObj = [
        { id: 0, label: '未调查', name: '未调查' },
        { id: 1, label: 'ETC', name: 'ETC通道' },
        { id: 2, label: '人工', name: '人工通道' },
        { id: 3, label: '自助', name: '自助通道' }
    ];

    $scope.initializeData = function () {
        $scope.tollGateData = objCtrl.data;
        $scope.tollgateNames = null;
        $scope.nameGroup = [];
        $scope.selectedLangcodeArr = []; // 当前选中组中的已选语言代码;
        $scope.currentGroupIndex = null;
        $scope.currentItempIndex = null;
        $scope.deleteNames = [];
        initNameInfo();
    };

    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
