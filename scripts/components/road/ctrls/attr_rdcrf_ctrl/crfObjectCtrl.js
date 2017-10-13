/**
 * Created by liuyang on 2016/8/9.
 */

var rdcrfObjectApp = angular.module('app');
rdcrfObjectApp.controller('crfObjectCtrl', ['$scope', 'dsEdit', 'dsMeta', 'appPath', '$ocLazyLoad', function ($scope, dsEdit, dsMeta, appPath, $ocLazyLoad) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = fastmap.uikit.SelectController();
    var featCodeCtrl = fastmap.uikit.FeatCodeController();
    /* 语言代码*/
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

    /* 私有方法 */
    function getSelectedLangCode() {
        $scope.selectedLangcodeArr.length = 0;
        for (var k in $scope.crfObjectNames) {
            if ($scope.selectedLangcodeArr.indexOf($scope.crfObjectNames[k].langCode) < 0) {
                $scope.selectedLangcodeArr.push($scope.crfObjectNames[k].langCode);
            }
        }
    }

    function getItemByNameGroupid(arr, nameGroupid) {
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
    }

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
    // 刷新names
    $scope.refreshNames = function () {
        $scope.crfObjData.names = [];
        for (var i = 0, len = $scope.nameGroup.length; i < len; i++) {
            for (var j = 0, le = $scope.nameGroup[i].length; j < le; j++) {
                $scope.crfObjData.names.unshift($scope.nameGroup[i][j]);
            }
        }
    };

    /* 记住当前组和当前组组内的选中 */
    $scope.rememberNameNum = function (fIndex, cIndex) {
        $scope.currentGroupIndex = fIndex;
        $scope.currentItempIndex = cIndex;
        objCtrl.namesInfos = $scope.nameGroup[fIndex][cIndex];
        objCtrl.currentGroup = $scope.nameGroup[fIndex];
    };

    function initNameInfo() {
        if ($scope.crfObjData.names.length > 0) {
            $scope.nameGroup = [];
            $scope.crfObjData.names.sort(compare('nameGroupid'));
            // 获取所有的nameGroupid
            var nameGroupidArr = [];
            var i;
            var len;
            for (i = 0; i < $scope.crfObjData.names.length; i++) {
                nameGroupidArr.push($scope.crfObjData.names[i].nameGroupid);
            }
            // 去重
            nameGroupidArr = Utils.distinctArr(nameGroupidArr);
            for (i = 0, len = nameGroupidArr.length; i < len; i++) {
                var tempArr = [];
                for (var j = 0, le = $scope.crfObjData.names.length; j < le; j++) {
                    if ($scope.crfObjData.names[j].nameGroupid == nameGroupidArr[i]) {
                        tempArr.push($scope.crfObjData.names[j]);
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
    /* 增加group */
    $scope.addGroup = function () {
        $scope.refreshNames();
        var maxNameGroupId = 0;
        if ($scope.crfObjData.names.length > 0) {
            maxNameGroupId = Utils.getArrMax($scope.crfObjData.names, 'nameGroupid');
        }
        objCtrl.data.names.unshift(fastmap.dataApi.rdObjectNames({
            nameGroupid: maxNameGroupId + 1
        }));
        initNameInfo();
    };

    $scope.addRdName = function () {
        /* var newName = fastmap.dataApi.rdObjectNames({ pid: $scope.crfObjData.pid, langCode: 'CHI', nameId: 0 });
        $scope.crfObjData.names.unshift(newName);*/
        $scope.refreshNames();
        var maxNameGroupId = 0;
        if ($scope.crfObjData.names.length > 0) {
            maxNameGroupId = Utils.getArrMax($scope.crfObjData.names, 'nameGroupid');
        }
        objCtrl.data.names.unshift(fastmap.dataApi.rdObjectNames({
            nameGroupid: maxNameGroupId + 1,
            pid: $scope.crfObjData.pid
        }));
        initNameInfo();
    };

    // 英文翻译
    var translateName = function (param) {
        // 标识多音字是否已经选完
        var flag = true;
        for (var i = 0; i < $scope.crfObjectNames[0].phoneticArr.length; i++) {
            if ($scope.crfObjectNames[0].phoneticArr[i].length > 1) {
                flag = false;
                break;
            }
        }
        if (!flag) {
            return;
        }
        var nParam = {
            word: $scope.crfObjectNames[0].name,
            languageType: 'eng',
            pinyin: $scope.crfObjectNames[0].phoneticArr.join(' ')
        };
        dsMeta.nameTranslate(nParam).then(function (data) {
            if (data.errcode == 0) {
                for (var j = 0; j < $scope.crfObjectNames.length; j++) {
                    if ($scope.crfObjectNames[j].langCode == 'ENG') {
                        $scope.crfObjectNames[j].name = data.data.eng;
                    }
                }
            } else {
                swal('查找失败', '可能是服务出错或者输入过长，请重新尝试', 'error');
            }
            $scope.refreshNames();
        });
    };

    /* 增加组内名称信息 */
    $scope.addItem = function (currentGroupIndex) {
        var groupId = $scope.nameGroup[currentGroupIndex][0].nameGroupid;
        $scope.crfObjectNames = getItemByNameGroupid($scope.nameGroup, groupId);
        getSelectedLangCode();
        for (var i = 0; i < $scope.langCodeOptions.length; i++) {
            if ($scope.selectedLangcodeArr.indexOf($scope.langCodeOptions[i].id) === -1) {
                if (!($scope.selectedLangcodeArr.indexOf('CHI') > -1 || $scope.selectedLangcodeArr.indexOf('CHT') > -1) || !($scope.langCodeOptions[i].id === 'CHI' || $scope.langCodeOptions[i].id === 'CHT')) {
                    if ($scope.langCodeOptions[i].id == 'ENG') {
                        $scope.crfObjectNames.push(fastmap.dataApi.rdObjectNames({
                            nameGroupid: $scope.crfObjectNames[0].nameGroupid,
                            langCode: 'ENG',
                            name: '',
                            srcFlag: 1
                        }));
                        translateName();
                    } else {
                        $scope.crfObjectNames.push(fastmap.dataApi.rdObjectNames({
                            nameGroupid: $scope.crfObjectNames[0].nameGroupid,
                            langCode: $scope.langCodeOptions[i].id
                        }));
                    }
                    break;
                }
            }
        }
        $scope.refreshNames();
    };

    /* 移除组内名称信息*/
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

    $scope.changeColor = function (ind, ord) {
        $('#nameSpan' + ind).css('color', '#FFF');
    };
    $scope.backColor = function (ind, ord) {
        $('#nameSpan' + ind).css('color', 'darkgray');
    };
    $scope.initializeData = function () {
        $scope.crfObjData = objCtrl.data;
        $scope.objData = { links: [], inters: [], roads: [] };// 要创建的对象.
        $scope.crfPids = [];
        $scope.crfObjectNames = null;
        $scope.nameGroup = [];
        $scope.selectCRFData = [];
        $scope.selectedLangcodeArr = []; // 当前选中组中的已选语言代码;
        $scope.currentGroupIndex = null;
        $scope.currentItempIndex = null;
        var i;
        var j;
        var k;
        $ocLazyLoad.load(appPath.road + 'ctrls/attr_rdcrf_ctrl/crfObjectNameCtrl.js');
        initNameInfo();
        // objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        selectCtrl.onSelected({
            id: $scope.crfObjData.pid
        });
        for (i = 0; i < $scope.crfObjData.links.length; i++) {
            $scope.objData.links.push($scope.crfObjData.links[i].linkPid);
        }
        for (i = 0; i < $scope.crfObjData.roads.length; i++) {
            $scope.crfPids.push($scope.crfObjData.roads[i].roadPid);
            $scope.objData.roads.push($scope.crfObjData.roads[i].roadPid);
            var tempData = {
                pid: $scope.crfObjData.roads[i].roadPid,
                highLightId: []
            };
            var linkArr = $scope.crfObjData.roads[i].links;
            for (j = 0; j < linkArr.length; j++) {
                tempData.highLightId.push(linkArr[j].linkPid);
            }
            $scope.selectCRFData.push(tempData);
        }
        for (i = 0; i < $scope.crfObjData.inters.length; i++) {
            $scope.crfPids.push($scope.crfObjData.inters[i].interPid);
            $scope.objData.inters.push($scope.crfObjData.inters[i].interPid);

            var tempDatai = {
                pid: $scope.crfObjData.inters[i].interPid,
                highLightId: []
            };
            var linkArri = $scope.crfObjData.inters[i].links;
            var points = $scope.crfObjData.inters[i].nodes;
            for (j = 0; j < linkArri.length; j++) {
                tempDatai.highLightId.push(linkArri[j].linkPid);
            }
            for (k = 0; k < points.length; k++) {
                tempDatai.highLightId.push(points[k].nodePid);
            }
            $scope.selectCRFData.push(tempDatai);
        }
        featCodeCtrl.setFeatCode({
            selectCRFData: $scope.selectCRFData,
            objData: $scope.objData,
            crfPids: $scope.crfPids
        });
    };

    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
