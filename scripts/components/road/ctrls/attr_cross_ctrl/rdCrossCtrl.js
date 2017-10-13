/**
 * Created by liuzhaoxia on 2015/12/11.
 */
var selectApp = angular.module('app');
selectApp.controller('rdCrossController', ['$scope', 'dsEdit', 'dsMeta', 'dsFcc', 'appPath', '$ocLazyLoad', function ($scope, dsEdit, dsMeta, dsFcc, appPath, $ocLazyLoad) {
    var objCtrl = fastmap.uikit.ObjectEditController();

    $scope.currentIndex = undefined;


    /* 根据数据中对象某一属性值排序*/
    function compare(propertyName) {
        return function (object1, object2) {
            var value1 = object1[propertyName];
            var value2 = object2[propertyName];
            var result;
            if (value2 < value1) {
                result = -1;
            } else if (value2 > value1) {
                result = 1;
            } else {
                result = 0;
            }
            return result;
        };
    }
    function initNameInfo() {
        if ($scope.rdCrossData.names.length > 0) {
            $scope.nameGroup = [];
            $scope.rdCrossData.names.sort(compare('nameGroupid'));
            // 获取所有的nameGroupid
            var nameGroupidArr = [];
            for (var i = 0; i < $scope.rdCrossData.names.length; i++) {
                nameGroupidArr.push($scope.rdCrossData.names[i].nameGroupid);
            }
            // 去重
            nameGroupidArr = Utils.distinctArr(nameGroupidArr);
            for (var item = 0, len = nameGroupidArr.length; item < len; item++) {
                var tempArr = [];
                for (var j = 0, le = $scope.rdCrossData.names.length; j < le; j++) {
                    if ($scope.rdCrossData.names[j].nameGroupid == nameGroupidArr[item]) {
                        tempArr.push($scope.rdCrossData.names[j]);
                        tempArr.sort(function (a, b) {
                            return $scope.langCodeRelation[a.langCode] - $scope.langCodeRelation[b.langCode];
                        });
                    }
                }
//                if(tempArr.length !=0){
                $scope.nameGroup.push(tempArr);
//                }
            }
            $scope.refreshNames();
        }
    }
    $scope.initializeRdCrossData = function () {
        // 回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if ($scope.rdCrossForm) {
            $scope.rdCrossForm.$setPristine();
        }
        $scope.rdCrossNames = null;
        $scope.nameGroup = [];
        $scope.selectedLangcodeArr = []; // 当前选中组中的已选语言代码;
        $scope.currentGroupIndex = null;
        $scope.currentItempIndex = null;
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        $scope.rdCrossData = objCtrl.data;
        $ocLazyLoad.load(appPath.road + 'ctrls/attr_cross_ctrl/namesCtrl.js');
        initNameInfo();
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

    // 刷新rdCrossData.names
    $scope.refreshNames = function () {
        $scope.rdCrossData.names = [];
        for (var i = 0, len = $scope.nameGroup.length; i < len; i++) {
            for (var j = 0, le = $scope.nameGroup[i].length; j < le; j++) {
                $scope.rdCrossData.names.unshift($scope.nameGroup[i][j]);
            }
        }
    };
    if (objCtrl.data) {
        $scope.initializeRdCrossData();
    }
    $scope.refreshData = function () {
        dsEdit.getByPid($scope.rdCrossData.pid, 'RDCROSS').then(function (data) {
            if (data) {
                objCtrl.setCurrentObject('RDCROSS', data);
                objCtrl.setOriginalData(objCtrl.data.getIntegrate());
            }
        });
    };
    /* 记住当前组和当前组组内的选中 */
    $scope.rememberNameNum = function (fIndex, cIndex) {
        $scope.currentGroupIndex = fIndex;
        $scope.currentItempIndex = cIndex;
        objCtrl.namesInfos = $scope.nameGroup[fIndex][cIndex];
        objCtrl.currentGroup = $scope.nameGroup[fIndex];
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
    /* 私有方法 */
    function getSelectedLangCode() {
        $scope.selectedLangcodeArr.length = 0;
        for (var k in $scope.rdCrossNames) {
            if ($scope.selectedLangcodeArr.indexOf($scope.rdCrossNames[k].langCode) < 0) {
                $scope.selectedLangcodeArr.push($scope.rdCrossNames[k].langCode);
            }
        }
    }
    /* 增加group */
    $scope.addGroup = function () {
        $scope.refreshNames();
        var maxNameGroupId = 0;
        if ($scope.rdCrossData.names.length > 0) {
            maxNameGroupId = Utils.getArrMax($scope.rdCrossData.names, 'nameGroupid');
        }
        objCtrl.data.names.unshift(fastmap.dataApi.rdCrossName({
            nameGroupid: maxNameGroupId + 1
        }));
        initNameInfo();
    };
    // 英文翻译
    var translateName = function () {
        // 标识多音字是否已经选完
        var flag = true;
        for (var i = 0; i < $scope.rdCrossNames[0].phoneticArr.length; i++) {
            if ($scope.rdCrossNames[0].phoneticArr[i].length > 1) {
                flag = false;
                break;
            }
        }
        if (!flag) {
            return;
        }
        var nParam = {
            word: $scope.rdCrossNames[0].name,
            languageType: 'eng',
            pinyin: $scope.rdCrossNames[0].phoneticArr.join(' ')
        };
        dsMeta.nameTranslate(nParam).then(function (data) {
            if (data.errcode == 0) {
                for (var j = 0; j < $scope.rdCrossNames.length; j++) {
                    if ($scope.rdCrossNames[j].langCode == 'ENG') {
                        $scope.rdCrossNames[j].name = data.data.eng;
                    }
                }
            } else {
                swal('查找失败', '可能是服务出错或者输入过长，请重新尝试', 'error');
            }
            $scope.refreshNames();
        });
    };
    /* 增加item*/
    $scope.addItem = function (currentGroupIndex) {
        var groupId = $scope.nameGroup[currentGroupIndex][0].nameGroupid;
        $scope.rdCrossNames = $scope.getItemByNameGroupid($scope.nameGroup, groupId);
        getSelectedLangCode();
        for (var i = 0; i < $scope.langCodeOptions.length; i++) {
            if ($scope.selectedLangcodeArr.indexOf($scope.langCodeOptions[i].id) === -1) {
                if (!($scope.selectedLangcodeArr.indexOf('CHI') > -1 || $scope.selectedLangcodeArr.indexOf('CHT') > -1) || !($scope.langCodeOptions[i].id === 'CHI' || $scope.langCodeOptions[i].id === 'CHT')) {
                    if ($scope.langCodeOptions[i].id == 'ENG') {
                        $scope.rdCrossNames.push(fastmap.dataApi.rdCrossName({
                            nameGroupid: $scope.rdCrossNames[0].nameGroupid,
                            langCode: $scope.langCodeOptions[i].id,
                            name: '',
                            srcFlag: 1
                        }));
                        translateName();
                    } else {
                        $scope.rdCrossNames.push(fastmap.dataApi.rdCrossName({
                            nameGroupid: $scope.rdCrossNames[0].nameGroupid,
                            langCode: $scope.langCodeOptions[i].id
                        }));
                    }
                    break;
                }
            }
        }
        $scope.refreshNames();
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

    /* 移除item*/
    $scope.removeItem = function (index, pIndex, item) {
        var i;
        var j;
        var len;
        var le;
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
        $scope.refreshNames();
    };
    $scope.$watch($scope.nameGroup, function (newValue, oldValue, scope) {
        $scope.refreshNames();
    });

    $scope.changeColor = function (index) {
        $('#crossnameSpan' + index).css('color', '#FFF');
    };
    $scope.backColor = function (index) {
        $('#crossnameSpan' + index).css('color', 'darkgray');
    };

    var unbindHandler = $scope.$on('ReloadData', $scope.initializeRdCrossData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
