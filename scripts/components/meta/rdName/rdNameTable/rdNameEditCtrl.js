/**
 * Created by mali on 2017/3/30.
 * 编辑新增面板
 */
angular.module('app').controller('RdNameEditCtl', ['$scope', '$ocLazyLoad', 'appPath', '$interval', 'dsMeta',
    function ($scope, $ocLazyLoad, appPath, $interval, dsMeta) {
        var objectCtrl = fastmap.uikit.ObjectEditController();
        var eventCtrl = fastmap.uikit.EventController();
        $scope.srcFlagDisable = false;
        $scope.langCodeOpt = [
            { id: 'CHI', label: '简体中文' },
            { id: 'CHT', label: '繁体中文' },
            { id: 'ENG', label: '英文' },
            { id: 'POR', label: '葡萄牙文' }
        ];
        $scope.srcFlagOpt = [
            { id: 0, label: '未定义' },
            { id: 1, label: '按规则翻译(程序赋值)' },
            { id: 2, label: '来自出典(手工录入)' },
            { id: 3, label: '现场标牌' }
        ];
        $scope.roadTypeOpt = [
            { id: 0, label: '未区分' },
            { id: 1, label: '高速' },
            { id: 2, label: '国道' },
            { id: 3, label: '铁路' },
            { id: 4, label: '出口编号' }
        ];
        $scope.codeTypeOpt = [
            { id: 0, label: '非国家编号' },
            { id: 1, label: '国家高速编号' },
            { id: 2, label: '国道编号' },
            { id: 3, label: '省道编号' },
            { id: 4, label: '县道编号' },
            { id: 5, label: '乡道编号' },
            { id: 6, label: '专用道编号' },
            { id: 7, label: '省级高速编号' }
        ];
        $scope.splitFlagOpt = [
            { id: 0, label: '无（默认值）' },
            { id: 1, label: '人工拆分' },
            { id: 2, label: '程序拆分' }
        ];
        $scope.processFlagOpt = [
            { id: 0, label: '无(默认值)' },
            { id: 1, label: '外业采集(人工赋值)' },
            { id: 2, label: '未验证(程序赋值)' }
        ];
        $scope.hwInfoFlagOpt = [
            { id: 0, label: '否' },
            { id: 1, label: '是' }
        ];
        $scope.adminOpt = [
            { id: 214, label: '全国' },
            { id: 110000, label: '北京' },
            { id: 120000, label: '天津' },
            { id: 130000, label: '河北' },
            { id: 140000, label: '山西' },
            { id: 150000, label: '内蒙古' },
            { id: 210000, label: '辽宁' },
            { id: 220000, label: '吉林' },
            { id: 230000, label: '黑龙江' },
            { id: 310000, label: '上海' },
            { id: 320000, label: '江苏' },
            { id: 330000, label: '浙江' },
            { id: 340000, label: '安徽' },
            { id: 350000, label: '福建' },
            { id: 360000, label: '江西' },
            { id: 370000, label: '山东' },
            { id: 410000, label: '河南' },
            { id: 420000, label: '湖北' },
            { id: 430000, label: '湖南' },
            { id: 440000, label: '广东' },
            { id: 450000, label: '广西' },
            { id: 460000, label: '海南' },
            { id: 500000, label: '重庆' },
            { id: 510000, label: '四川' },
            { id: 520000, label: '贵州' },
            { id: 530000, label: '云南' },
            { id: 540000, label: '西藏' },
            { id: 610000, label: '陕西' },
            { id: 620000, label: '甘肃' },
            { id: 630000, label: '青海' },
            { id: 640000, label: '宁夏' },
            { id: 650000, label: '新疆' },
            { id: 810000, label: '香港' },
            { id: 820000, label: '澳门' }
        ];
        // 获取前中后缀
        var getFix = function (langCode) {
            dsMeta.searchFix({ langCode: langCode }).then(function (data) {
                if (data) {
                    data.suffix.unshift({ id: '', label: '--请选择--' });
                    data.infix.unshift({ id: '', label: '--请选择--' });
                    $scope.prefixOpt = data.suffix;
                    $scope.infixOpt = data.infix;
                    $scope.suffixOpt = data.suffix;
                }
            });
        };
        $scope.initializeData = function () {
            var type = $scope.roadNameFlag;
            $scope.roadNameData = fastmap.dataApi.roadName({});
            if (type == 'add') {
                $scope.roadNameData = fastmap.dataApi.roadName({});
            } else if (type == 'edit') {
                $scope.roadNameData = objectCtrl.data;
                objectCtrl.setOriginalData(objectCtrl.data.getIntegrate());
                // $scope.roadNameData = $scope.roadName;
            }
            if ($scope.roadNameData.roadType == 4) {
                $scope.roadNameMax = 8;
            } else {
                $scope.roadNameMax = 35;
            }
            getFix($scope.roadNameData.langCode);
            $scope.initFieldEditable();
            if ($scope.roadNameData.roadType == 4) {
                $scope.prefixDisable = true;// 前缀名称
                $scope.infixDisable = true;// 中缀名称
                $scope.suffixDisable = true;// 后缀名称
                $scope.typeEditable = false;// 类型名称
                $scope.typePhoneticDisable = true;// 类型名发音
                $scope.baseDisable = true;// 基本名称
                $scope.basePhoneticDisable = true;// 基本名发音
                $scope.typePhoneticDisable = true;// 类型名发音
            }
        };

        // 新增重置
        $scope.reset = function () {
            $scope.roadNameData = fastmap.dataApi.roadName({});
        };
        // 初始化各个字段是否可编辑
        $scope.initFieldEditable = function () {
            var type = $scope.roadNameFlag;
            if (type == 'edit') {
                $scope.hwInfoFlagDisable = true;// highway信息标识
                $scope.typeEditable = true;// 类型名称
                $scope.basePhoneticDisable = false;// 基本名发音
                $scope.typePhoneticDisable = false;// 类型名发音
                $scope.baseDisable = false;// 基本名称
                // $scope.basePhoneticEditable = true;// 基本名发音
                $scope.prefixDisable = false;// 前缀名称
                $scope.infixDisable = false;// 中缀名称
                $scope.suffixDisable = false;// 后缀名称
                $scope.voiceFileDisable = false;// 名称语音
                $scope.srcFlagDisable = false;// 名称来源
                $scope.nameGroupidEditable = false;
                $scope.langCodeDisable = true;// 语言类型
                if ($scope.roadNameData.langCode == 'ENG' || $scope.roadNameData.langCode == 'POR') {
                    $scope.codeTypeDisable = true;// 国家编号
                    $scope.adminIdDisable = true;// 行政区划
                    $scope.roadTypeDisable = true;// 道路类型
                    $scope.nameDisable = false;// 道路名称
                } else if ($scope.roadNameData.langCode == 'CHI' || $scope.roadNameData.langCode == 'CHT') {
                    $scope.codeTypeDisable = false;// 国家编号
                    $scope.adminIdDisable = false;// 行政区划
                    $scope.roadTypeDisable = false;// 道路类型
                    $scope.nameDisable = true;// 道路名称
                }
                $scope.restBtn = false; // 编辑窗口不显示 重置按钮
            } else if (type == 'add') {
                $scope.hwInfoFlagDisable = true;// highway信息标识
                $scope.typeEditable = true;// 类型名称
                $scope.basePhoneticDisable = false;// 基本名发音
                $scope.typePhoneticDisable = false;// 类型名发音
                $scope.baseDisable = false;// 基本名称
                // $scope.basePhoneticEditable = true;// 基本名发音
                $scope.prefixDisable = false;// 前缀名称
                $scope.infixDisable = false;// 中缀名称
                $scope.suffixDisable = false;// 后缀名称
                $scope.voiceFileDisable = false;// 名称语音
                $scope.srcFlagDisable = false;// 名称来源
                $scope.nameGroupidEditable = true;// 道路组id
                $scope.langCodeDisable = false;// 语言类型
                $scope.codeTypeDisable = false;// 国家编号
                $scope.adminIdDisable = false;// 行政区划
                $scope.roadTypeDisable = false;// 道路类型
                $scope.nameDisable = false;// 道路名称
                $scope.restBtn = true; // 新增显示 重置按钮
            }
        };
        $scope.initializeData();

        // 弹出组ID 或 类型名称面板面板
        $scope.searchModal = false;
        $scope.openSearchModal = function (type) {
            $scope.searchModal = true;
            if (type == 'nameGroup') {
                $scope.searchModalTitle = '请选择名称组';
                if ($scope.roadNameFlag == 'add') {
                    if ($scope.roadNameData.langCode == 'CHI' || $scope.roadNameData.langCode == 'CHT') {
                        swal('道路名组在语言类型为中文时系统会自动分配，不能选择', '', 'info');
                        $scope.searchModal = false;
                        return;
                    }
                }
                $ocLazyLoad.load(appPath.meta + 'rdName/rdNameTable/nameGroupTableCtl.js').then(function () {
                    $scope.searchModalTpl = appPath.meta + 'rdName/rdNameTable/nameGroupTableTpl.html';
                });
            } else if (type == 'type') {
                $scope.searchModalTitle = '请选择类型名称';
                $ocLazyLoad.load(appPath.meta + 'rdName/rdNameTable/typeTableCtl.js').then(function () {
                    $scope.searchModalTpl = appPath.meta + 'rdName/rdNameTable/typeTableTpl.html';
                });
            } else {
                return;
            }
        };
        /** *
         * 关闭编辑面板
         */
        $scope.closeSearchModal = function () {
            $scope.searchModal = false;
        };
        /** *
         * 道路组名，类型名，行政区划名修改
         */
        $scope.selectVal = function (row, index, type) {
            var param = {};
            if (type == 'namegroup') {
                if ($scope.roadNameFlag == 'add') {
                    param = {
                        nameGroupid: parseInt(row.nameGroupid, 10),
                        dbId: App.Temp.dbId
                    };
                    dsMeta.rdnameGroup(param).then(function (data) {
                        if (data.data) {
                            swal('该道路名组内已经存在两条记录，不可再添加。请选择其他道路名组', '', 'info');
                        } else {
                            $scope.roadNameData.nameGroupid = row.nameGroupid;
                            $scope.searchModal = false;
                        }
                    });
                } else if ($scope.roadNameFlag == 'edit') {
                    $scope.roadNameData.nameGroupid = row.nameGroupid;
                    $scope.searchModal = false;
                }
            } else if (type == 'type') {
                if ($scope.roadNameData.langCode == 'ENG') {
                    $scope.roadNameData.type = row.englishname;
                } else {
                    param = {
                        word: row.name
                    };
                    dsMeta.autoConvert(param).then(function (data) {
                        $scope.roadNameData.typePhonetic = data.phonetic;
                    });
                    $scope.roadNameData.type = row.name;
                }
                $scope.typeClearable = true;
                $scope.searchModal = false;
            }
        };
        /**
         * 前缀名称变化
         */
        $scope.prefixChange = function (event, obj) {
            var param = {
                word: obj.roadNameData.prefix
            };
            dsMeta.autoConvert(param).then(function (data) {
                $scope.roadNameData.prefixPhonetic = data.phonetic;
            });
        };
        /** *
         * 转拼音
         */
        $scope.getPy = function (event, obj, field, pyfield) {
            if ($scope.roadNameData.langCode == 'ENG') {
                return;
            }
            var param = {
                word: obj.roadNameData[field]
            };
            dsMeta.autoConvert(param).then(function (data) {
                $scope.roadNameData[pyfield] = data.phonetic;
            });
        };
        $scope.test = function (row, index, type) {
            if (type == 'namegroup') {
                if ($scope.roadNameFlag == 'add') {
                    var param = {
                        nameGroupid: parseInt(row.nameGroupid, 10),
                        dbId: App.Temp.dbId
                    };
                    dsMeta.rdnameGroup(param).then(function (data) {
                        if (data.data) {
                            swal('该道路名组内已经存在两条记录，不可再添加。请选择其他道路名组', '', 'info');
                        } else {
                            $scope.roadNameData.nameGroupid = row.nameGroupid;
                            $scope.roadNameData.adminId = row.adminId;
                            $scope.roadNameData.roadType = row.roadType;
                            $scope.roadNameData.codeType = row.codeType;
                            $scope.searchModal = false;
                        }
                    });
                } else if ($scope.roadNameFlag == 'edit') {
                    $scope.roadNameData.nameGroupid = row.nameGroupid;
                    $scope.searchModal = false;
                }
            }
        };
        var validateForm = function (form) {
            if (form.doValidate) {
                form.doValidate();
            }
        };
        /** *
         * 保存
         */
        $scope.doSave = function () {
            validateForm($scope.RdNameEditForm);
            if ($scope.RdNameEditForm.$invalid) {
                swal('注意', '属性输入有错误，请检查！', 'error');
                return;
            }
            // roadName为原始类型，查询返回里没有type,不能调用objectCtrl.setCurrentObject
            var param = {};
            if ($scope.roadNameFlag == 'add') {
                if ($scope.roadNameData.name == undefined || $scope.roadNameData.name == null || $scope.roadNameData.name == '') {
                    swal('道路名不能为空', '', 'info');
                    return;
                } else if ($scope.roadNameData.adminId == undefined || $scope.roadNameData.adminId == null || $scope.roadNameData.adminId == '') {
                    swal('行政区划不能为空', '', 'info');
                    return;
                }
                if ($scope.roadNameData.langCode == 'ENG' || $scope.roadNameData.langCode == 'POR') {
                    if ($scope.roadNameData.nameGroupid == undefined || $scope.roadNameData.nameGroupid == null || $scope.roadNameData.nameGroupid == '') {
                        swal('非中文的语言类型，必须选择一个名称组', '', 'info');
                        return;
                    }
                }
                if ($scope.roadNameData.langCode == 'CHI' || $scope.roadNameData.langCode == 'CHT') {
                    $scope.roadNameData.name = Utils.ToDBC($scope.roadNameData.name);
                }

                param = {
                    data: $scope.roadNameData,
                    dbId: 0,
                    subtaskId: 0
                };
                dsMeta.roadNameSave(param).then(function (data) {
                    if (data) {
                        if (data.flag == -1) {
                            swal('重复', '新增道路名重复', 'error');
                            return;
                        }
                        $scope.closeSubModal();
                        swal({
                            title: '保存成功',
                            type: 'info',
                            showCancelButton: false,
                            closeOnConfirm: true,
                            confirmButtonText: '确定'
                        }, function (f) {
                            if (f) {
                                $scope.$emit('REFRESHROADNAMELIST');
                            }
                        });
                    }
                });
            } else if ($scope.roadNameFlag == 'edit') {
                objectCtrl.data = $scope.roadNameData;
                objectCtrl.save();
                var changed = objectCtrl.changedProperty;
                if ($scope.roadNameData.langCode == 'CHI' || $scope.roadNameData.langCode == 'CHT') {
                    $scope.roadNameData.name = Utils.ToDBC($scope.roadNameData.name);
                }
                if (changed) {
                    if ($scope.roadNameData.langCode == 'CHI') {
                        changed.name = Utils.ToDBC($scope.roadNameData.name);
                    } else {
                        changed.name = $scope.roadNameData.name;
                    }

                    changed.roadType = $scope.roadNameData.roadType;
                    changed.adminId = $scope.roadNameData.adminId;
                    changed.nameId = $scope.roadNameData.nameId;
                    changed.nameGroupid = $scope.roadNameData.nameGroupid;
                    param = {
                        data: $scope.roadNameData,
                        dbId: 0,
                        subtaskId: 0
                    };
                    dsMeta.roadNameSave(param).then(function (data) {
                        if (data) {
                            if (data.flag == -1) {
                                swal('重复', '新增道路名重复', 'error');
                                return;
                            }
                            $scope.closeSubModal();
                            swal({
                                title: '保存成功',
                                type: 'info',
                                showCancelButton: false,
                                closeOnConfirm: true,
                                confirmButtonText: '确定'
                            }, function (f) {
                                if (f) {
                                    $scope.$emit('REFRESHROADNAMELIST');
                                }
                            });
                        }
                    });
                } else {
                    swal('属性值没有变化', '', 'info');
                }
            }
        };
        /** *
         * 道路类型切换
         */
        $scope.roadTypeChange = function (event, obj) {
            if (obj.roadNameData.roadType == 1) { // 高速
                $scope.initFieldEditable();
                $scope.hwInfoFlagDisable = false;
                if ($scope.roadNameFlag == 'add') {
                    $scope.roadNameData.voiceFile = $scope.voicefile;
                } else if ($scope.roadNameFlag == 'edit' && !$scope.roadNameData.voiceFile) {
                    $scope.getPronunciation('name', 'namePhonetic', 'voiceFile');
                    $scope.roadNameData.voiceFile = $scope.voicefile;
                }
                $scope.roadNameMax = 35;
            } else if (obj.roadNameData.roadType == 3) { // 铁路
                $scope.typeEditable = false;// 类型名称
                $scope.baseDisable = true;// 基本名称
                $scope.prefixDisable = true;// 前缀名称
                $scope.infixDisable = true;// 中缀名称
                $scope.suffixDisable = true;// 后缀名称

                $scope.roadNameData.namePhonetic = $scope.phonetic;

                $scope.roadNameData.typePhonetic = '';
                $scope.roadNameData.basePhonetic = '';
                $scope.roadNameData.prefixPhonetic = '';
                $scope.roadNameData.infixPhonetic = '';
                $scope.roadNameData.suffixPhonetic = '';
                $scope.typePhoneticDisable = false; // 类型名发音
                $scope.basePhoneticDisable = true;// 基本名发音

                $scope.roadNameData.srcFlag = 0; // 名称来源字段
                $scope.roadNameData.adminId = 214; // 行政区划
                $scope.roadNameData.codeType = 0; // 国家编号
                $scope.roadNameData.voiceFile = ''; // 名称语音
                $scope.voiceFileDisable = true;
                $scope.hwInfoFlagDisable = true;
                $scope.roadNameMax = 35;
                
                //
                $scope.clearRoadType();
            } else if (obj.roadNameData.roadType == 4) { // 出口编号
                $scope.prefixDisable = true;// 前缀名称
                $scope.infixDisable = true;// 中缀名称
                $scope.suffixDisable = true;// 后缀名称
                $scope.typeEditable = false;// 类型名称
                $scope.typePhoneticDisable = true;// 类型名发音
                $scope.baseDisable = true;// 基本名称
                $scope.basePhoneticDisable = true; // 基本名发音
                $scope.roadNameData.voiceFile = ''; // 名称语音
                $scope.hwInfoFlagDisable = true;
                $scope.voiceFileDisable = false;
                $scope.roadNameMax = 8;
            } else {
                $scope.initFieldEditable();
                $scope.roadNameData.voiceFile = ''; // 名称语音
                $scope.roadNameMax = 35;
            }
        };
        /** *
         * 语言切换事件
         */
        $scope.langCodeChange = function (event, obj) {
            if (obj.roadNameData.langCode == 'ENG' || obj.roadNameData.langCode == 'POR') {
                $scope.roadNameData.prefixPhonetic = '';
                $scope.roadNameData.infixPhonetic = '';
                $scope.roadNameData.suffixPhonetic = '';
                if ($scope.roadNameData.roadType != 3 && $scope.roadNameData.roadType != 4) {
                    $scope.adminIdDisable = true;
                    $scope.roadTypeDisable = true;
                    $scope.codeTypeDisable = true;
                } else {
                    $scope.adminIdDisable = false;
                    $scope.roadTypeDisable = false;
                    $scope.codeTypeDisable = false;
                }
            } else {
                $scope.initFieldEditable();
            }
            getFix(obj.roadNameData.langCode);
        };

        /**
         * 根据adminid 获取adminname
         */
        var getNameById = function (adminId) {
            var name;
            for (var i = 0; i < $scope.adminOpt.length; i++) {
                if ($scope.adminOpt[i].id == adminId) {
                    name = $scope.adminOpt[i].label;
                }
            }
            return name;
        };

        // 名称语音和道路名发音
        $scope.getPronunciation = function (field, pyfield, voicefield) {
            var param = {
                word: $scope.roadNameData[field]
            };
            // if (param.word == undefined) {
            //     return;
            // }
            dsMeta.autoConvert(param).then(function (data) {
                if ($scope.roadNameData.langCode == 'ENG' || $scope.roadNameData.langCode == 'POR') {
                    return;
                }
                $scope.roadNameData[pyfield] = data.phonetic;
                if ($scope.roadNameData.roadType == 1) {
                    $scope.roadNameData[voicefield] = data.voicefile;
                }
                // 道路名发音
                $scope.phonetic = data.phonetic;
                // 道路名语音
                $scope.voicefile = data.voicefile;
            });

            if ($scope.roadNameData.roadType == 4 && $scope.roadNameData.langCode == 'ENG') {
                $scope.roadNameData.base = $scope.roadNameData.name;
            }
        };

        // 清空类型名称
        $scope.clearRoadType = function () {
            $scope.roadNameData.type = '';
            $scope.typeClearable = false;
            if ($scope.roadNameData.langCode == 'CHI') {
                $scope.roadNameData.typePhonetic = '';
            }
        };
        /** *
         * adminId 切换事件
         */
        $scope.adminIdChange = function (event, obj) {
            $scope.roadNameData.adminName = getNameById(obj.roadNameData.adminId);
        };
        var unbindHandler = $scope.$on('SubModalReload', $scope.initializeData);
        $scope.$on('$destroy', function () {
            unbindHandler = null;
        });
    }
]);
