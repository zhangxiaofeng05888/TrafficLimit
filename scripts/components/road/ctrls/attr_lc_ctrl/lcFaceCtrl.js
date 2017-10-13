/**
 * Created by linglong on 2016/7/22.
 */
angular.module('app').controller('lcFaceCtrl', ['$scope', 'dsEdit', 'dsMeta', '$ocLazyLoad', 'appPath', function ($scope, dsEdit, dsMeta, $ocLazyLoad, appPath) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var lcFace = layerCtrl.getLayerById('lcFace');
    $scope.kind = [
        { id: 0, label: '未分类' },
        { id: 1, label: '海域' },
        { id: 2, label: '河川域' },
        { id: 3, label: '湖沼池' },
        { id: 4, label: '水库' },
        { id: 5, label: '港湾' },
        { id: 6, label: '运河' },
        { id: 11, label: '公园' },
        { id: 12, label: '高尔夫球场' },
        { id: 13, label: '滑雪场' },
        { id: 14, label: '树林林地' },
        { id: 15, label: '草地' },
        { id: 16, label: '绿化带' },
        { id: 17, label: '岛屿' }
    ];
    $scope.form = [
        { id: 0, label: '无' },
        { id: 1, label: '暗沙' },
        { id: 2, label: '浅滩' },
        { id: 3, label: '珊瑚礁' },
        { id: 4, label: '礁' },
        { id: 8, label: '湖泊(国界内)' },
        { id: 9, label: '湖泊(国界外)' },
        { id: 10, label: '界河' }
    ];
    $scope.displayClass = [
        { id: 0, label: '默认值' },
        { id: 1, label: '1级' },
        { id: 2, label: '2级' },
        { id: 3, label: '3级' },
        { id: 4, label: '4级' },
        { id: 5, label: '5级' },
        { id: 6, label: '6级' },
        { id: 7, label: '7级' },
        { id: 7, label: '8级' }
    ];
    $scope.scale = [
        { id: 0, label: '2.5万' },
        { id: 1, label: '20万' },
        { id: 2, label: '100万' }
    ];
    $scope.detailFlag = [
        { id: 0, label: '不应用' },
        { id: 1, label: '只存在于详细区域' },
        { id: 2, label: '只存在于广域区域' },
        { id: 3, label: '存在于详细和广域区域' }
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
        if ($scope.lcFaceData.names.length > 0) {
            $scope.nameGroup = [];
            $scope.lcFaceData.names.sort(compare('nameGroupid'));
            // 获取所有的nameGroupid
            var nameGroupidArr = [];
            var i;
            var j;
            var len;
            var le;
            for (i = 0; i < $scope.lcFaceData.names.length; i++) {
                nameGroupidArr.push($scope.lcFaceData.names[i].nameGroupid);
            }
            // 去重
            nameGroupidArr = Utils.distinctArr(nameGroupidArr);
            for (i = 0, len = nameGroupidArr.length; i < len; i++) {
                var tempArr = [];
                for (j = 0, le = $scope.lcFaceData.names.length; j < le; j++) {
                    if ($scope.lcFaceData.names[j].nameGroupid == nameGroupidArr[i]) {
                        tempArr.push($scope.lcFaceData.names[j]);
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
        if ($scope.lcFaceData.names.length > 0) {
            maxNameGroupId = Utils.getArrMax($scope.lcFaceData.names, 'nameGroupid');
        }
        objCtrl.data.names.unshift(fastmap.dataApi.lcFaceName({
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
    /* 私有方法 */
    function getSelectedLangCode() {
        $scope.selectedLangcodeArr.length = 0;
        for (var k in $scope.lcFaceNames) {
            if ($scope.selectedLangcodeArr.indexOf($scope.lcFaceNames[k].langCode) < 0) {
                $scope.selectedLangcodeArr.push($scope.lcFaceNames[k].langCode);
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

    // 刷新lcFaceData.names
    $scope.refreshNames = function () {
        $scope.lcFaceData.names = [];
        for (var i = 0, len = $scope.nameGroup.length; i < len; i++) {
            for (var j = 0, le = $scope.nameGroup[i].length; j < le; j++) {
                $scope.lcFaceData.names.push($scope.nameGroup[i][j]);
            }
        }
    };
    // 初始化
    $scope.initializeData = function () {
        $scope.lcFaceData = objCtrl.data;// 获取数据
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());// 存储原始数据
        // 回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if ($scope.lcFaceForm) {
            $scope.lcFaceForm.$setPristine();
        }
        $scope.lcFaceNames = null;
        $scope.nameGroup = [];
        $scope.selectedLangcodeArr = []; // 当前选中组中的已选语言代码;
        $scope.currentGroupIndex = null;
        $scope.currentItempIndex = null;
        initNameInfo();
        $ocLazyLoad.load(appPath.road + 'ctrls/attr_lc_ctrl/lcFaceNameCtrl.js');
    };


    $scope.kindChange = function (event, obj) {
        if (obj.lcFaceData.kind == 1 || obj.lcFaceData.kind == 2 || obj.lcFaceData.kind == 3 || obj.lcFaceData.kind == 4 || obj.lcFaceData.kind == 5 || obj.lcFaceData.kind == 6 || obj.lcFaceData.kind == 17) {
            obj.lcFaceData.detailFlag = 3;
        } else if (obj.lcFaceData.kind == 11 || obj.lcFaceData.kind == 12 || obj.lcFaceData.kind == 13 || obj.lcFaceData.kind == 14 || obj.lcFaceData.kind == 15 || obj.lcFaceData.kind == 16) {
            obj.lcFaceData.detailFlag = 1;
        } else if (obj.lcFaceData.kind == 0) {
            obj.lcFaceData.detailFlag = 0;
        }
    };

    /* 展示详细信息*/
    $scope.showDetail = function (index, nameInfo, nameGroupid) {
        // 这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
        var showNameInfoObj = {
            loadType: 'subAttrTplContainer',
            propertyCtrl: 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
            propertyHtml: '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
            callback: function () {
                var showNameObj = {
                    loadType: 'subAttrTplContainer',
                    propertyCtrl: 'scripts/components/road/ctrls/attr_lc_ctrl/lcFaceNameCtrl',
                    propertyHtml: '../../../scripts/components/road/tpls/attr_lc_tpl/lcFaceNameTpl.html'
                };
                $scope.$emit('transitCtrlAndTpl', showNameObj);
            }
        };
        objCtrl.namesInfos = $scope.getItemByNameGroupid($scope.nameGroup, nameGroupid);
        $scope.$emit('transitCtrlAndTpl', showNameInfoObj);
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
    // 英文翻译
    var translateName = function () {
        // 标识多音字是否已经选完
        var flag = true;
        for (var i = 0; i < $scope.lcFaceNames[0].phoneticArr.length; i++) {
            if ($scope.lcFaceNames[0].phoneticArr[i].length > 1) {
                flag = false;
                break;
            }
        }
        if (!flag) {
            return;
        }
        var nParam = {
            word: $scope.lcFaceNames[0].name,
            languageType: 'eng',
            pinyin: $scope.lcFaceNames[0].phoneticArr.join(' ')
        };
        dsMeta.nameTranslate(nParam).then(function (data) {
            if (data.errcode == 0) {
                for (var j = 0; j < $scope.lcFaceNames.length; j++) {
                    if ($scope.lcFaceNames[j].langCode == 'ENG') {
                        $scope.lcFaceNames[j].name = data.data.eng;
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
        $scope.lcFaceNames = getItemByNameGroupid($scope.nameGroup, groupId);
        getSelectedLangCode();
        for (var i = 0; i < $scope.langCodeOptions.length; i++) {
            if ($scope.selectedLangcodeArr.indexOf($scope.langCodeOptions[i].id) === -1) {
                if (!($scope.selectedLangcodeArr.indexOf('CHI') > -1 || $scope.selectedLangcodeArr.indexOf('CHT') > -1) || !($scope.langCodeOptions[i].id === 'CHI' || $scope.langCodeOptions[i].id === 'CHT')) {
                    if ($scope.langCodeOptions[i].id == 'ENG') {
                        $scope.lcFaceNames.push(fastmap.dataApi.lcFaceName({
                            nameGroupid: $scope.lcFaceNames[0].nameGroupid,
                            langCode: 'ENG',
                            name: '',
                            srcFlag: 1
                        }));
                        translateName();
                    } else {
                        $scope.lcFaceNames.push(fastmap.dataApi.lcFaceName({
                            nameGroupid: $scope.lcFaceNames[0].nameGroupid,
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
        var len;
        var j;
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
        $scope.$emit('SWITCHCONTAINERSTATE', {
            subAttrContainerTpl: false,
            attrContainerTpl: true
        });
    };

    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
