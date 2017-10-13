/**
 * Created by mali on 2016/7/22.
 */
angular.module('app').controller('luFaceCtrl', ['$scope', 'dsEdit', 'dsMeta', 'appPath', '$filter', '$ocLazyLoad', function ($scope, dsEdit, dsMeta, appPath, $filter, $ocLazyLoad) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var luFace = layerCtrl.getLayerById('luFace');
    $scope.kind = [
        { id: 0, label: '未分类' },
        { id: 1, label: '大学' },
        { id: 2, label: '购物中心' },
        { id: 3, label: '医院' },
        { id: 4, label: '体育场' },
        { id: 5, label: '公墓' },
        { id: 6, label: '地上停车场' },
        { id: 7, label: '工业区' },
        { id: 11, label: '机场' },
        { id: 12, label: '机场跑道' },
        { id: 21, label: 'BUA面' },
        { id: 22, label: '邮编面' },
        { id: 23, label: 'FM面' },
        { id: 24, label: '车厂面' },
        { id: 31, label: '休闲娱乐' },
        { id: 31, label: '景区' },
        { id: 32, label: '会展中心' },
        { id: 33, label: '火车站' },
        { id: 34, label: '文化场馆' },
        { id: 35, label: '商务区' },
        { id: 36, label: '商业区' },
        { id: 37, label: '小区' },
        { id: 38, label: '广场' },
        { id: 39, label: '特色区域' },
        { id: 40, label: '地下停车场' },
        { id: 41, label: '地铁出入口面' }
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
    // 刷新luFaceData.faceNames
    $scope.refreshNames = function () {
        $scope.luFaceData.faceNames = [];
        for (var i = 0, len = $scope.nameGroup.length; i < len; i++) {
            for (var j = 0, le = $scope.nameGroup[i].length; j < le; j++) {
                $scope.luFaceData.faceNames.unshift($scope.nameGroup[i][j]);
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

    /* 根据数据中对象某一属性值排序*/
    function compare(propertyName) {
        return function (object1, object2) {
            var value1 = object1[propertyName];
            var value2 = object2[propertyName];
            if (value2 < value1) {
                return -1;
            } else if (value2 > value1) {
                return 1;
            }
            return 0;
        };
    }

    function initNameInfo() {
        if ($scope.luFaceData.faceNames.length > 0) {
            $scope.nameGroup = [];
            $scope.luFaceData.faceNames.sort(compare('nameGroupid'));
            // 获取所有的nameGroupid
            var nameGroupidArr = [];
            var i;
            var len;
            for (i = 0; i < $scope.luFaceData.faceNames.length; i++) {
                nameGroupidArr.push($scope.luFaceData.faceNames[i].nameGroupid);
            }
            // 去重
            nameGroupidArr = Utils.distinctArr(nameGroupidArr);
            for (i = 0, len = nameGroupidArr.length; i < len; i++) {
                var tempArr = [];
                for (var j = 0, le = $scope.luFaceData.faceNames.length; j < le; j++) {
                    if ($scope.luFaceData.faceNames[j].nameGroupid == nameGroupidArr[i]) {
                        tempArr.push($scope.luFaceData.faceNames[j]);
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
    /* 增加group */
    $scope.addGroup = function () {
        $scope.refreshNames();
        var maxNameGroupId = 0;
        if ($scope.luFaceData.faceNames.length > 0) {
            maxNameGroupId = Utils.getArrMax($scope.luFaceData.faceNames, 'nameGroupid');
        }
        objCtrl.data.faceNames.unshift(fastmap.dataApi.luFaceName({
            nameGroupid: maxNameGroupId + 1
        }));
        initNameInfo();
    };
    // 初始化
    $scope.initializeData = function () {
        $scope.luFaceData = objCtrl.data;// 获取数据
        $scope.isBatch = ($scope.luFaceData.kind == 21);
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());// 存储原始数据
        // 回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if ($scope.luFaceForm) {
            $scope.luFaceForm.$setPristine();
        }
        $scope.luFaceNames = null;
        $scope.nameGroup = [];
        $scope.selectedLangcodeArr = []; // 当前选中组中的已选语言代码;
        $scope.currentGroupIndex = null;
        $scope.currentItempIndex = null;
        $ocLazyLoad.load(appPath.road + 'ctrls/attr_lu_ctrl/luFaceNameCtrl.js');
        initNameInfo();
    };
    /**
     *
     */
    $scope.setUrban = function () {
        $scope.$emit('showFullLoadingOrNot', true);
        var param = {};
        param.pid = $scope.luFaceData.pid;
        param.ruleId = 'BATCHBUAURBAN';
        dsEdit.PolygonBatchWork(param).then(function (data) {
            if (typeof data === 'string') {
                $scope.$emit('showFullLoadingOrNot', false);
                swal('不存在需要批处理的link数据', data, 'warning');
            } else {
                $scope.$emit('showFullLoadingOrNot', false);
                swal('赋Urban批处理成功：', '处理了' + data.log.length + '条数据', 'success');
            }
        });
    };
    /**
     *
     */
    $scope.deleteUrban = function () {
        $scope.$emit('showFullLoadingOrNot', true);
        var param = {};
        param.pid = $scope.luFaceData.pid;
        param.ruleId = 'BATCHDELURBAN';
        dsEdit.PolygonBatchWork(param).then(function (data) {
            if (typeof data === 'string') {
                $scope.$emit('showFullLoadingOrNot', false);
                swal('不存在需要批处理的link数据', data, 'warning');
            } else {
                $scope.$emit('showFullLoadingOrNot', false);
                swal('删除Urban批处理成功：', '处理了' + data.log.length + '条数据', 'success');
            }
        });
    };
    /* 私有方法 */
    function getSelectedLangCode() {
        $scope.selectedLangcodeArr.length = 0;
        for (var k in $scope.luFaceNames) {
            if ($scope.selectedLangcodeArr.indexOf($scope.luFaceNames[k].langCode) < 0) {
                $scope.selectedLangcodeArr.push($scope.luFaceNames[k].langCode);
            }
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
    /* 增加item*/
    $scope.addItem = function (currentGroupIndex) {
        var groupId = $scope.nameGroup[currentGroupIndex][0].nameGroupid;
        $scope.luFaceNames = $scope.getItemByNameGroupid($scope.nameGroup, groupId);
        getSelectedLangCode();
        var nameGroupId,
            langCode;
        var _afterAddEng = function (data) {
            if (data.errcode == 0) {
                for (var j = 0; j < $scope.luFaceNames.length; j++) {
                    if ($scope.luFaceNames[j].langCode == 'ENG') {
                        $scope.luFaceNames[j].name = data.data.eng;
                    }
                }
            } else {
                swal('查找失败', '可能是服务出错或者输入过长，请重新尝试', 'error');
            }
            $scope.refreshNames();
        };
        for (var i = 0; i < $scope.langCodeOptions.length; i++) {
            if ($scope.selectedLangcodeArr.indexOf($scope.langCodeOptions[i].id) === -1) {
                if (!($scope.selectedLangcodeArr.indexOf('CHI') > -1 || $scope.selectedLangcodeArr.indexOf('CHT') > -1) || !($scope.langCodeOptions[i].id === 'CHI' || $scope.langCodeOptions[i].id === 'CHT')) {
                    if ($scope.langCodeOptions[i].id == 'ENG') {
                        nameGroupId = $scope.luFaceNames[0].nameGroupid;
                        langCode = $scope.langCodeOptions[i].id;
                        $scope.luFaceNames.push(fastmap.dataApi.luFaceName({
                            nameGroupid: nameGroupId,
                            langCode: langCode,
                            name: '',
                            srcFlag: 1
                        }));
                        // 标识多音字是否已经选完
                        var flag = true;
                        for (var j = 0; j < $scope.luFaceNames[0].phoneticArr.length; j++) {
                            if ($scope.luFaceNames[0].phoneticArr[j].length > 1) {
                                flag = false;
                                break;
                            }
                        }
                        if (!flag) {
                            return;
                        }
                        var nParam = {
                            word: $scope.luFaceNames[0].name,
                            languageType: 'eng',
                            pinyin: $scope.luFaceNames[0].phoneticArr.join(' ')
                        };
                        dsMeta.nameTranslate(nParam).then(_afterAddEng);
                    } else {
                        $scope.luFaceNames.push(fastmap.dataApi.luFaceName({
                            nameGroupid: $scope.luFaceNames[0].nameGroupid,
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
        var i,
            j,
            len,
            le;
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

    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
