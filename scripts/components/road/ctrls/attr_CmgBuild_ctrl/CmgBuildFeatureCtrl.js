/**
 * Created by mali on 2017/5/22.
 */
angular.module('app').controller('CmgBuildFeatureCtrl', ['$scope', 'dsEdit', 'dsMeta', 'appPath', '$filter', '$ocLazyLoad', function ($scope, dsEdit, dsMeta, appPath, $filter, $ocLazyLoad) {
    var objCtrl = fastmap.uikit.ObjectEditController();

    $scope.kindOpt = [
        { id: '1001', label: '厂矿企业' },
        { id: '1002', label: '商业建筑' },
        { id: '2001', label: '会议，展览中心' },
        { id: '3001', label: '宗教' },
        { id: '3002', label: '公众活动性建筑' },
        { id: '4001', label: '高等教育' },
        { id: '4002', label: '一般学校' },
        { id: '4003', label: '其他教育设施' },
        { id: '5001', label: '急救中心' },
        { id: '5002', label: '公安局' },
        { id: '5003', label: '消防' },
        { id: '5004', label: '交警队' },
        { id: '5005', label: '其他紧急服务设施' },
        { id: '6001', label: '邮政' },
        { id: '6002', label: '政府机关' },
        { id: '6003', label: '其他政府性建筑' },
        { id: '7001', label: '名声古迹' },
        { id: '8001', label: '医院' },
        { id: '8002', label: '医疗服务' },
        { id: '8003', label: '其它医疗设施' },
        { id: '9001', label: '高尔夫球场' },
        { id: '9002', label: '游乐园，公园' },
        { id: '9003', label: '滑雪场' },
        { id: '9004', label: '其它休闲设施' },
        { id: '1101', label: '公寓，别墅' },
        { id: '1102', label: '小区' },
        { id: '1103', label: '其它居民建筑' },
        { id: '1201', label: '批发市场，建材' },
        { id: '1202', label: '餐饮' },
        { id: '1203', label: '百货商场商城' },
        { id: '1204', label: '其它商业' },
        { id: '1301', label: '体育场馆' },
        { id: '1302', label: '其它运动场所' },
        { id: '1401', label: '动，植物园' },
        { id: '1402', label: '陵园，公墓' },
        { id: '1403', label: '其它景点建筑' },
        { id: '1501', label: '火车站' },
        { id: '1502', label: '机场' },
        { id: '1503', label: '长途客运站' },
        { id: '1504', label: '港口' },
        { id: '1505', label: '其它运输相关建筑' },
        { id: '1601', label: '其它' }
    ];
    $scope.srcFlagOpt = [
        { id: 0, label: '未定义' },
        { id: 1, label: '翻译' }
    ];
    $scope.resolutionOpt = [
        { id: 0, label: '低' },
        { id: 1, label: '中' },
        { id: 2, label: '高' }
    ];
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
    /* 私有方法 */
    function getSelectedLangCode() {
        $scope.selectedLangcodeArr.length = 0;
        for (var k in $scope.cmgBuildNames) {
            if ($scope.selectedLangcodeArr.indexOf($scope.cmgBuildNames[k].langCode) < 0) {
                $scope.selectedLangcodeArr.push($scope.cmgBuildNames[k].langCode);
            }
        }
    }
    /* 记住当前组和当前组组内的选中 */
    $scope.rememberNameNum = function (fIndex, cIndex) {
        $scope.currentGroupIndex = fIndex;
        $scope.currentItempIndex = cIndex;
        objCtrl.namesInfos = $scope.nameGroup[fIndex][cIndex];
        objCtrl.currentGroup = $scope.nameGroup[fIndex];
    };
    // 英文翻译
    var translateName = function (param) {
        dsMeta.nameTranslate(param).then(function (data) {
            if (data.errcode == 0) {
                $scope.cmgBuildNames.push(fastmap.dataApi.cmgBuildingName({
                    nameGroupid: $scope.cmgBuildNames[0].nameGroupid,
                    langCode: 'ENG',
                    name: data.data.eng,
                    srcFlag: 1
                }));
            } else {
                swal('查找失败', '可能是服务出错或者输入过长，请重新尝试', 'error');
            }
            $scope.refreshNames();
        });
    };
    // 刷新cmgBuildFeatureData.names
    $scope.refreshNames = function () {
        $scope.cmgBuildFeatureData.names = [];
        for (var i = 0, len = $scope.nameGroup.length; i < len; i++) {
            for (var j = 0, le = $scope.nameGroup[i].length; j < le; j++) {
                $scope.cmgBuildFeatureData.names.push($scope.nameGroup[i][j]);
            }
        }
    };
    function initNameInfo() {
        if ($scope.cmgBuildFeatureData.names.length > 0) {
            $scope.nameGroup = [];
            $scope.cmgBuildFeatureData.names.sort(compare('nameGroupid'));
            // 获取所有的nameGroupid
            var nameGroupidArr = [];
            var i;
            var j;
            var len;
            var le;
            for (i = 0; i < $scope.cmgBuildFeatureData.names.length; i++) {
                nameGroupidArr.push($scope.cmgBuildFeatureData.names[i].nameGroupid);
            }
            // 去重
            nameGroupidArr = Utils.distinctArr(nameGroupidArr);
            for (i = 0, len = nameGroupidArr.length; i < len; i++) {
                var tempArr = [];
                for (j = 0, le = $scope.cmgBuildFeatureData.names.length; j < le; j++) {
                    if ($scope.cmgBuildFeatureData.names[j].nameGroupid == nameGroupidArr[i]) {
                        tempArr.push($scope.cmgBuildFeatureData.names[j]);
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
    // 初始化
    $scope.initializeData = function () {
        $scope.cmgBuildFeatureData = objCtrl.data;// 获取数据
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());// 存储原始数据
        $scope.cmgBuildNames = null;
        $scope.nameGroup = [];
        $scope.selectedLangcodeArr = []; // 当前选中组中的已选语言代码;
        $scope.currentGroupIndex = null;
        $scope.currentItempIndex = null;
        initNameInfo();
        $ocLazyLoad.load(appPath.road + 'ctrls/attr_CmgBuild_ctrl/CmgBuildNameCtrl.js');
    };
    /* 增加item*/
    $scope.addItem = function (currentGroupIndex) {
        var groupId = $scope.nameGroup[currentGroupIndex][0].nameGroupid;
        $scope.cmgBuildNames = getItemByNameGroupid($scope.nameGroup, groupId);
        getSelectedLangCode();
        for (var i = 0; i < $scope.langCodeOptions.length; i++) {
            if ($scope.selectedLangcodeArr.indexOf($scope.langCodeOptions[i].id) === -1) {
                if (!($scope.selectedLangcodeArr.indexOf('CHI') > -1 || $scope.selectedLangcodeArr.indexOf('CHT') > -1) || !($scope.langCodeOptions[i].id === 'CHI' || $scope.langCodeOptions[i].id === 'CHT')) {
                    if ($scope.langCodeOptions[i].id == 'ENG') {
                        $scope.cmgBuildNames.push(fastmap.dataApi.cmgBuildingName({
                            nameGroupid: $scope.cmgBuildNames[0].nameGroupid,
                            langCode: 'ENG',
                            srcFlag: 1
                        }));
                        // 经与玉秀确认cmgfeature 英文不用程序处理
                        // translateName(nParam);
                    } else {
                        $scope.cmgBuildNames.push(fastmap.dataApi.cmgBuildingName({
                            nameGroupid: $scope.cmgBuildNames[0].nameGroupid,
                            langCode: $scope.langCodeOptions[i].id
                        }));
                    }
                    break;
                }
            }
        }
        $scope.refreshNames();
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
    $scope.addGroup = function () {
        var maxNameGroupId = 0;
        if ($scope.cmgBuildFeatureData.names.length > 0) {
            maxNameGroupId = Utils.getArrMax($scope.cmgBuildFeatureData.names, 'nameGroupid');
        }
        var newName = fastmap.dataApi.cmgBuildingName({ buildingPid: $scope.cmgBuildFeatureData.pid, nameGroupid: maxNameGroupId + 1 });
        $scope.cmgBuildFeatureData.names.unshift(newName);
        initNameInfo();
    };

    $scope.addCmgBuildingName = function () {
        var newName = fastmap.dataApi.cmgBuildingName({ buildingPid: $scope.cmgBuildFeatureData.pid });
        $scope.cmgBuildFeatureData.names.unshift(newName);
    };

    $scope.build3diconBtnAddable = true;
    $scope.build3diconDeletable = false;
    $scope.addCmgBuilding3dIcon = function () {
        var build3dicon = fastmap.dataApi.cmgBuilding3dicon({ buildingPid: $scope.cmgBuildFeatureData.pid });
        $scope.cmgBuildFeatureData.build3dicons.unshift(build3dicon);
        $scope.build3diconDeletable = true;
    };
    $scope.deleteCmgBuilding3dIcon = function () {
        $scope.cmgBuildFeatureData.build3dicons = [];
        $scope.build3diconBtnAddable = true;
    };

    $scope.addCmgBuilding3dmodel = function () {
        var build3dModel = fastmap.dataApi.cmgBuilding3dmodel({ buildingPid: $scope.cmgBuildFeatureData.pid });
        $scope.cmgBuildFeatureData.build3dmodels.unshift(build3dModel);
    };
    $scope.removeCmgBuilding3dmodel = function (index) {
        $scope.cmgBuildFeatureData.build3dmodels.splice(index, 1);
    };
    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
