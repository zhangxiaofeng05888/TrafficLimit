/**
 * Created by mali on 2016/10/21.
 */

angular.module('app').controller('LcFaceNameCtl', ['$scope', 'dsEdit', 'dsMeta', '$timeout', function ($scope, dsEdit, dsMeta, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.lcFaceNames = objCtrl.namesInfos; //
    $scope.lcFaceGroup = objCtrl.currentGroup;
    $scope.selectedLangcodeArr = [];
    var timer;
    var getSelectedLangcode = function () {
        $scope.selectedLangcodeArr.length = 0;
        for (var k in $scope.lcFaceGroup) {
            if ($scope.selectedLangcodeArr.indexOf($scope.lcFaceGroup[k].langCode) < 0) {
                $scope.selectedLangcodeArr.push($scope.lcFaceGroup[k].langCode);
            }
        }
    };
    getSelectedLangcode();
    // 转英文
    function translateFunc(nameInfo) {
        // 标识多音字是否已经选完
        var flag = true;
        for (var i = 0; i < $scope.lcFaceGroup[0].phoneticArr.length; i++) {
            if ($scope.lcFaceGroup[0].phoneticArr[i].length > 1) {
                flag = false;
                break;
            }
        }
        if (!flag) {
            return;
        }
        var currentName = nameInfo;
        var nParam = {
            word: $scope.lcFaceGroup[0].name,
            languageType: 'eng',
            pinyin: $scope.lcFaceGroup[0].phoneticArr.join(' ')

        };
        dsMeta.nameTranslate(nParam).then(function (nData) {
            if (nData.errcode == 0) {
                currentName.name = nData.data.eng;
                currentName.phonetic = '';
            } else {
                swal('查找失败', '可能是服务出错或者输入过长，请重新尝试', 'error');
            }
        });
    }
    // 切换名称来源
    $scope.changeNameSource = function (nameInfo) {
        if ($scope.lcFaceNames.srcFlag == '1') {
            translateFunc(nameInfo);
        }
    };

    /* 名称语音*/
    $scope.namePronunciation = function (nameCn, nameInfo) {
        $scope.lcFaceNames.name = Utils.ToDBC(nameCn);
        if (timer) {
            $timeout.cancel(timer);
        }
        var i;
        timer = $timeout(function () {
            if (!nameCn) {
                if (nameInfo.langCode == 'CHI' || nameInfo.langCode == 'CHT') {
                    for (i = 0; i < $scope.lcFaceGroup.length; i++) {
                        $scope.lcFaceGroup[i].name = '';
                        $scope.lcFaceGroup[i].phonetic = '';
                        $scope.lcFaceGroup[i].phoneticArr = [];
                    }
                }
                return;
            }
            var param = {
                word: nameCn
            };
            dsMeta.getPyPolyphoneConvert(param).then(function (data) {
                if (data.errcode == 0) {
                    nameInfo.phonetic = data.data.phonetic;
                    var phoneticStr = [];
                    var tempArr = [];
                    nameInfo.phoneticArr = [];
                    if (data.data.phonetic.indexOf('}') > -1) {
                        phoneticStr = data.data.phonetic.replace(/[{}]/g, ';');
                        tempArr = phoneticStr.split(';');
                        for (var j = 0; j < tempArr.length; j++) {
                            if (tempArr[j]) {
                                // 非多音字部分
                                if (tempArr[j].startsWith(' ') || tempArr[j].endsWith(' ')) {
                                    for (var z = 0; z < tempArr[j].trim().split(' ').length; z++) {
                                        nameInfo.phoneticArr.push([tempArr[j].trim().split(' ')[z]]);
                                    }
                                } else {
                                    nameInfo.phoneticArr.push(tempArr[j].trim().split(' '));
                                }
                            }
                        }
                    } else {
                        tempArr = data.data.phonetic.split(';');
                        nameInfo.phoneticArr.push(tempArr);
                    }
                    // 如果有英文 则翻译
                    for (i = 0; i < $scope.lcFaceGroup.length; i++) {
                        if ($scope.lcFaceGroup[i].langCode == 'ENG') {
                            translateFunc($scope.lcFaceGroup[i]);
                        }
                    }
                } else {
                    nameInfo.phonetic = '';
                    swal('查找失败', '可能是服务出错或者输入过长，请重新尝试', 'error');
                }
            });
        }, 500);
    };
    // 选择多音字
    $scope.selectPolyphonic = function (event, index, parentIndex) {
        $scope.lcFaceNames.phoneticArr[parentIndex] = [event.target.innerText];
        // 选择多音字后，需同步刷新英文
        for (var i = 0; i < $scope.lcFaceGroup.length; i++) {
            if ($scope.lcFaceGroup[i].langCode == 'ENG') {
                translateFunc($scope.lcFaceGroup[i]);
            }
        }
    };
    // 代码语言字段切换时，判断语言不能重复
    $scope.langCodeChange = function (langCode) {
        var i;
        // 如果当前所选既不是简体也不是繁体，则控制不允许选择简繁体
        getSelectedLangcode();
        if (langCode != 'CHI' && langCode != 'CHT') {
            if ($scope.selectedLangcodeArr.indexOf('CHI') === -1) {
                $scope.selectedLangcodeArr.push('CHI');
            }
            if ($scope.selectedLangcodeArr.indexOf('CHT') === -1) {
                $scope.selectedLangcodeArr.push('CHT');
            }
        } else if (langCode == 'CHI') { // 如果是简体中文或繁体中文其他语言不可用
            $scope.selectedLangcodeArr = [];
            for (i = 0; i < $scope.langCodeOptions.length; i++) {
                if ($scope.langCodeOptions[i].id != 'CHT') {
                    $scope.selectedLangcodeArr.push($scope.langCodeOptions[i].id);
                }
            }
        } else if (langCode == 'CHT') {
            $scope.selectedLangcodeArr = [];
            for (i = 0; i < $scope.langCodeOptions.length; i++) {
                if ($scope.langCodeOptions[i].id != 'CHI') {
                    $scope.selectedLangcodeArr.push($scope.langCodeOptions[i].id);
                }
            }
        }
        $scope.refreshNameLangCode();
        $timeout(function () {
            $scope.$apply();
        });
    };

    /* 切换语言类型 */
    $scope.changeLangCode = function (nameInfo) {
        if (nameInfo.langCode == 'ENG') {
            var nParam = {
                word: $scope.lcFaceGroup[0].name,
                languageType: 'eng'
            };
            dsMeta.nameTranslate(nParam).then(function (data) {
                if (data.errcode == 0) {
                    $scope.lcFaceNames.name = data.data.eng;
                    $scope.lcFaceNames.phonetic = '';
                } else {
                    swal('查找失败', '可能是服务出错或者输入过长，请重新尝试', 'error');
                }
            });
        }
    };

    // 重新排列名称信息
    $scope.refreshNameLangCode = function () {
        $scope.lcFaceGroup.sort(function (a, b) {
            return $scope.langCodeRelation[a.langCode] - $scope.langCodeRelation[b.langCode];
        });
    };
    /* 名称来源*/
    $scope.nameSource = [
        { code: 0, label: '未定义' },
        { code: 1, label: '翻译' }
    ];
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
}]);
