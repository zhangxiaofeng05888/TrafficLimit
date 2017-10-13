/**
 * Created by linglong on 2016/12/16.
 */
var otherApp = angular.module('app');
otherApp.controller('rdBranchNameController', ['$scope', 'dsMeta', '$timeout', function ($scope, dsMeta, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var timer;
    $scope.currentName = objCtrl.namesInfos;
    $scope.branchNames = objCtrl.currentGroup;

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
    /* 名称分类*/
    $scope.nameClassType = [
        { code: 0, label: '方向' },
        { code: 1, label: '出口' }
    ];
    /* 名称来源*/
    $scope.srcFlagOptions = [
        { code: 0, label: '未定义' },
        { code: 1, label: '翻译' }
    ];
    /* 编号类型*/
    $scope.codeTypeObj = [
        { code: 0, label: '无' },
        { code: 1, label: '普通道路名' },
        { code: 2, label: '设施名' },
        { code: 3, label: '高速道路名' },
        { code: 4, label: '国家高速编号' },
        { code: 5, label: '国道编号' },
        { code: 6, label: '省道编号' },
        { code: 7, label: '县道编号' },
        { code: 8, label: '乡道编号' },
        { code: 9, label: '专用道编号' },
        { code: 10, label: '省级高速编号' }
    ];

    // 重新排列名称信息
    function refreshNameLangCode() {
        $scope.branchNames.sort(function (a, b) {
            return $scope.langCodeRelation[a.langCode] - $scope.langCodeRelation[b.langCode];
        });
    }

    /* 切换语言类型 */
    /* $scope.changeLangCode = function (nameInfo) {
        if (nameInfo.langCode == 'ENG') {
            var nParam = {
                word: $scope.branchNames[0].name,
                languageType: 'eng'
            };
            dsMeta.nameTranslate(nParam).then(function (data) {
                if (data.errcode == 0) {
                    $scope.currentName.name = data.data.eng;
                    $scope.currentName.phonetic = '';
                } else {
                    swal('查找失败', '可能是服务出错或者输入过长，请重新尝试', 'error');
                }
            });
        }
    };*/
    // 切换语言代码
    $scope.changeLangCode = function (code) {
        if (code != 'CHI' && code != 'CHT') {
            $scope.currentName.phonetic = '';
            $scope.currentName.voiceFile = '';
        }
    };
    // 输入值后转化发音
    $scope.getNamePronunciation = function (nameCn, nameInfo) {
        $scope.currentName.name = Utils.ToDBC(nameCn);
        if (timer) {
            $timeout.cancel(timer);
        }
        timer = $timeout(function () {
            if (!nameCn) {
                nameInfo.phonetic = '';
                nameInfo.voiceFile = '';
                nameInfo.phoneticArr = [];
                return;
            }
            var param = {
                word: nameCn,
                flag: 1
            };
            dsMeta.getPyPolyphoneConvert(param).then(function (data) {
                if (data.errcode == 0) {
                    nameInfo.phonetic = data.data.phonetic;
                    nameInfo.voiceFile = data.data.voicefile;
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
                } else {
                    nameInfo.phonetic = '';
                    nameInfo.voiceFile = '';
                    swal('查找失败', '可能是服务出错或者输入过长，请重新尝试', 'error');
                }
            });
        }, 500);
    };

    /* 发音内容*/
    $scope.namePronunciation = function (nameCn, nameInfo) {
        if (!nameCn) {
            return;
        }
        var param = {
            word: nameCn
        };
        dsMeta.getNamePronunciation(param).then(function (data) {
            if (data.errcode == 0) {
                nameInfo.phonetic = data.data.phonetic;
                nameInfo.voiceFile = data.data.voicefile;
            } else {
                nameInfo.phonetic = '';
                nameInfo.voiceFile = '';
                swal('查找失败', '可能是服务出错或者输入过长，请重新尝试', 'error');
            }
        });
    };
    // 选择多音字
    $scope.selectPolyphonic = function (event, index, parentIndex) {
        $scope.currentName.phoneticArr[parentIndex] = [event.target.innerText];
        var phonetic = '';
        if ($scope.currentName.phoneticArr.length) {
            for (var i = 0; i < $scope.currentName.phoneticArr.length; i++) {
                phonetic += $scope.currentName.phoneticArr[i].join(' ') + ' ';
            }
            phonetic = phonetic.trim();
        }
        var param = {
            word: $scope.currentName.name,
            phonetic: phonetic
        };
        dsMeta.getVoiceConvert(param).then(function (data) {
            if (data) {
                $scope.currentName.voiceFile = data.data.voicefile;
            }
        });
    };
}]);
