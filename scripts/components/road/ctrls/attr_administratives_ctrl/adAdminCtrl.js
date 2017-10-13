/**
 * Created by zhaohang on 2016/4/5.
 */
var adAdminZone = angular.module('app');
adAdminZone.controller('adAdminController', ['$scope', 'appPath', 'dsEdit', 'dsMeta', '$ocLazyLoad', '$filter', function ($scope, appPath, dsEdit, dsMeta, $ocLazyLoad, $filter) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var adAdmin = layerCtrl.getLayerById('adAdmin');
    var highlightCtrl = FM.mapApi.render.HighlightController.getInstance();
    $scope.isbase = true;
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
    // 行政类型
    $scope.adminType = [
        { id: 0, label: '国家地区级' },
        { id: 1, label: '省/直辖市/自治区' },
        { id: 2, label: '地级市/自治州/省直辖县' },
        { id: 2.5, label: 'DUMMY 地级市' },
        { id: 3, label: '地级市市区(GCZone)' },
        { id: 3.5, label: '地级市市区(未作区界)' },
        { id: 4, label: '区县/自治县' },
        { id: 4.5, label: 'DUMMY 区县' },
        { id: 4.8, label: 'DUMMY 区县(地级市下无区县)' },
        { id: 5, label: '区中心部' },
        { id: 6, label: '城镇/街道' },
        { id: 7, label: '飞地' },
        { id: 8, label: 'KDZone' },
        { id: 9, label: 'AOI' }
    ];
    // 代表点标识
    $scope.capital = [
        { id: 0, label: '未定义' },
        { id: 1, label: '首都' },
        { id: 2, label: '省会/直辖市' },
        { id: 3, label: '地级市' }
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
        for (var k in $scope.adAdminNames) {
            if ($scope.selectedLangcodeArr.indexOf($scope.adAdminNames[k].langCode) < 0) {
                $scope.selectedLangcodeArr.push($scope.adAdminNames[k].langCode);
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

    // 更新数据行政区划代表点的数据；
    function refreshNames() {
        $scope.adAdminData.names = [];
        for (var i = 0, len = $scope.nameGroup.length; i < len; i++) {
            for (var j = 0, le = $scope.nameGroup[i].length; j < le; j++) {
                $scope.adAdminData.names.unshift($scope.nameGroup[i][j]);
            }
        }
    }

    function initNameInfo() {
        // 如果没有名称信息就不组装名称组数据结构;
        if (!$scope.adAdminData.names.length) return;
        $scope.nameGroup = [];
        $scope.adAdminData.names.sort(compare('nameGroupid'));
        // 获取所有的nameGroupid
        var nameGroupidArr = [];
        for (var i = 0; i < $scope.adAdminData.names.length; i++) {
            nameGroupidArr.push($scope.adAdminData.names[i].nameGroupid);
        }
        nameGroupidArr = Utils.distinctArr(nameGroupidArr);

        for (var item = 0; item < nameGroupidArr.length; item++) {
            var tempArr = [];
            for (var j = 0, le = $scope.adAdminData.names.length; j < le; j++) {
                if ($scope.adAdminData.names[j].nameGroupid == nameGroupidArr[item]) {
                    tempArr.push($scope.adAdminData.names[j]);
                    // tempArr.sort(function (a, b) {
                    //     return $scope.langCodeRelation[a.langCode] - $scope.langCodeRelation[b.langCode];
                    // });
                }
            }
            $scope.nameGroup.push(tempArr);
        }
        refreshNames();
    }

    function showAdHighLight() {
        var linkcapturePoint = null;
        var linkArr = objCtrl.data.geometry.coordinates;
        dsEdit.getByPid(parseInt(objCtrl.data.linkPid, 10), 'RDLINK').then(function (data) {
            var minDis = Infinity;
            var minIndex = 0;
            var tempDis = 0;
            for (var k = 0; k < data.geometry.coordinates.length - 1; k++) {
                tempDis = L.LineUtil.pointToSegmentDistance(
                    L.point(linkArr[1], linkArr[0]),
                    L.point(data.geometry.coordinates[k][1], data.geometry.coordinates[k][0]),
                    L.point(data.geometry.coordinates[k + 1][1], data.geometry.coordinates[k + 1][0])
                );
                if (minDis > tempDis) {
                    minDis = tempDis;
                    minIndex = k;
                }
            }
            linkcapturePoint = L.LineUtil.closestPointOnSegment(
                L.point(linkArr[1], linkArr[0]),
                L.point(data.geometry.coordinates[minIndex][1], data.geometry.coordinates[minIndex][0]),
                L.point(data.geometry.coordinates[minIndex + 1][1], data.geometry.coordinates[minIndex + 1][0])
            );
            objCtrl.data.guidePoint.coordinates = [linkcapturePoint.y, linkcapturePoint.x];
            objCtrl.data.guideLink.coordinates.push([linkcapturePoint.y, linkcapturePoint.x]);
            highlightCtrl.clear();
            highlightCtrl.highlight(objCtrl.data);
            // geo = creatAdAdminFeature(objectEditCtrl.data, [linkcapturePoint.y, linkcapturePoint.x]);
            // geo.guideLink = objectEditCtrl.data.linkPid;
            // geo.id = objectEditCtrl.data.pid;
        });
    }

    /**
     * 初始化数据
     */
    $scope.initializeData = function () {
        $scope.adAdminData = objCtrl.data;// 获取数据
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());// 记录原始数据值
        $scope.adAdminNames = null;
        $scope.nameGroup = [];
        $scope.selectedLangcodeArr = []; // 当前选中组中的已选语言代码;
        $scope.currentGroupIndex = null;
        $scope.currentItempIndex = null;
        showAdHighLight();
        initNameInfo(); // 组成名称组数据结构;
        $ocLazyLoad.load(appPath.road + 'ctrls/attr_administratives_ctrl/adAdminNameCtrl.js');
        $scope.$emit('ShowInfoPage', { type: 'adminOfLevel' });
    };

/*--------------------------------------------------------------------------------------------------------------------------*/
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
        refreshNames();
        initNameInfo();
    };
    /* 增加group */
    $scope.addGroup = function () {
        refreshNames();
        var maxNameGroupId = 0;
        if ($scope.adAdminData.names.length > 0) {
            maxNameGroupId = Utils.getArrMax($scope.adAdminData.names, 'nameGroupid');
        }
        objCtrl.data.names.unshift(fastmap.dataApi.adAdminName({
            nameGroupid: maxNameGroupId + 1
        }));
        initNameInfo();
    };
    /* 移除组内名称信息*/
    $scope.removeItem = function (index, pIndex, item) {
        var len;
        var le;
        if (item.langCode === 'CHI' || item.langCode === 'CHT') {
            $scope.nameGroup.splice(pIndex, 1);
            for (var i = 0; i < $scope.nameGroup.length; i++) {
                if (i >= pIndex) {
                    for (var j = 0; j < $scope.nameGroup[i].length; j++) {
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
        refreshNames();
    };

    /* 增加组内名称信息 */
    $scope.addItem = function (currentGroupIndex) {
        var groupId = $scope.nameGroup[currentGroupIndex][0].nameGroupid;
        $scope.adAdminNames = getItemByNameGroupid($scope.nameGroup, groupId);
        // getSelectedLangCode();
        var nameGroupid,
            langCode;
        var _afterAddEng = function (data) {
            if (data.errcode == 0) {
                $scope.adAdminNames.push(fastmap.dataApi.adAdminName({
                    nameGroupid: nameGroupid,
                    langCode: langCode,
                    name: data.data.eng,
                    srcFlag: 0
                }));
            } else {
                swal('查找失败', '可能是服务出错或者输入过长，请重新尝试', 'error');
            }
            refreshNames();
        };
        $scope.adAdminNames.push(fastmap.dataApi.adAdminName({
            nameGroupid: $scope.adAdminNames[0].nameGroupid,
            langCode: 'CHI'
        }));
        // for (var i = 0; i < $scope.langCodeOptions.length; i++) {
        //     if ($scope.selectedLangcodeArr.indexOf($scope.langCodeOptions[i].id) === -1) {
        //         if (!($scope.selectedLangcodeArr.indexOf('CHI') > -1 || $scope.selectedLangcodeArr.indexOf('CHT') > -1) || !($scope.langCodeOptions[i].id === 'CHI' || $scope.langCodeOptions[i].id === 'CHT')) {
        //             if ($scope.langCodeOptions[i].id == 'ENG') {
        //                 var nParam = {
        //                     word: $scope.adAdminNames[0].name,
        //                     languageType: 'eng'
        //                 };
        //                 nameGroupid = $scope.adAdminNames[0].nameGroupid;
        //                 langCode = $scope.langCodeOptions[i].id;
        //                 dsMeta.nameTranslate(nParam).then(_afterAddEng);
        //             } else {
        //                 $scope.adAdminNames.push(fastmap.dataApi.adAdminName({
        //                     nameGroupid: $scope.adAdminNames[0].nameGroupid,
        //                     langCode: $scope.langCodeOptions[i].id
        //                 }));
        //             }
        //             break;
        //         }
        //     }
        // }
        refreshNames();
    };

    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });

    $scope.changeAdminType = function () {
        if ($scope.adAdminData.adminType === 8 || $scope.adAdminData.adminType === 9) {
            $scope.adAdminData.population = 0;
        }
    };

    $scope.changePopulation = function () {
        if ($scope.adAdminData.population < 0) {
            swal('值域错误', '人口数量必须在0-4294967294之间', 'error');
            $scope.adAdminData.population = 0;
        } else if ($scope.adAdminData.population > 4294967294) {
            swal('值域错误', '人口数量必须在0-4294967294之间', 'error');
            $scope.adAdminData.population = 4294967294;
        }
    };
}]);
