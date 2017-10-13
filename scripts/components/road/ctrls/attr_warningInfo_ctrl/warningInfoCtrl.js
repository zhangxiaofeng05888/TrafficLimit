/**
 * Created by wuzhen on 2016/7/24.
 * 警示信息面板
 */
angular.module('app').controller('warningInfoCtl', ['$scope', '$timeout', 'dsEdit', 'appPath', '$ocLazyLoad', function ($scope, $timeout, dsEdit, appPath, $ocLazyLoad) {
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var relationData = layerCtrl.getLayerById('relationData');
    $scope.temp = {};

    $scope.typeCodes = {
        // '10101交叉路口a':'交叉路口a',   //注释的为需求变更
        // '10102交叉路口b':'交叉路口b',
        // '10103交叉路口c':'交叉路口c',
        // '10104交叉路口d':'交叉路口d',
        // '10105交叉路口e':'交叉路口e',
        // '10106交叉路口f':'交叉路口f',
        // '10107交叉路口g':'交叉路口g',
        // '10108交叉路口h':'交叉路口h',
        // '10109交叉路口i':'交叉路口i',
        // '10110交叉路口j':'交叉路口j',
        '10201向左急弯路': '向左急弯路',
        '10202向右急弯路': '向右急弯路',
        '10301反向弯路(左)': '反向弯路(左)',
        '10302反向弯路(右)': '反向弯路(右)',
        '10401连续弯路': '连续弯路',
        '10501上陡坡': '上陡坡',
        '10502下陡坡': '下陡坡',
        '10601连续下坡': '连续下坡',
        '10701两侧变窄': '两侧变窄',
        '10702右侧变窄': '右侧变窄',
        '10703左侧变窄': '左侧变窄',
        '10801窄桥': '窄桥',
        '10901双向交通': '双向交通',
        '11001注意行人': '注意行人',
        '11101注意儿童': '注意儿童',
        '11201注意牲畜': '注意牲畜',
        '11301注意野生动物': '注意野生动物',
        '11401注意信号灯': '注意信号灯',
        '11501注意落石(左)': '注意落石(左)',
        '11502注意落石(右)': '注意落石(右)',
        '11601注意横风': '注意横风',
        '11701易滑': '易滑',
        '11801傍山险路(左)': '傍山险路(左)',
        '11802傍山险路(右)': '傍山险路(右)',
        '11901堤坝路(左)': '堤坝路(左)',
        '11902堤坝路(右)': '堤坝路(右)',
        '12001村庄': '村庄',
        '12101隧道': '隧道',
        '12201渡口': '渡口',
        '12301驼峰桥': '驼峰桥',
        '12401路面不平': '路面不平',
        '12501路面高凸': '路面高凸',
        '12601路面低洼': '路面低洼',
        '12701过水路面': '过水路面',
        '12801有人看守铁路道口': '有人看守铁路道口',
        '12901无人看守铁路道口': '无人看守铁路道口',
        '13001叉形符号': '叉形符号',
        // '13101斜杠符号50米':'斜杠符号50米',
        // '13102斜杠符号100米':'斜杠符号100米',
        // '13103斜杠符号150米':'斜杠符号150米',
        // '13201注意非机动车':'注意非机动车',
        // '13301注意残疾人':'注意残疾人',
        '13401事故易发路段': '事故易发路段',
        // '13501慢行':'慢行',
        '13601左右绕行': '左右绕行',
        '13602左侧绕行': '左侧绕行',
        '13603右侧绕行': '右侧绕行',
        '13701注意危险': '注意危险',
        '13702文字警示': '文字警示',
        '13703交通意外黑点': '交通意外黑点',
        '13801施工': '施工',
        // '13901建议速度':'建议速度',
        '14001隧道开车灯': '隧道开车灯',
        '14101潮汐车道': '潮汐车道',
        '14201保持车距': '保持车距',
        '14301十字分离式道路': '十字分离式道路',
        '14302丁字分离式道路': '丁字分离式道路',
        '14401左侧汇入右侧合流': '左侧汇入右侧合流',
        '14402右侧汇入左侧合流': '右侧汇入左侧合流',
        // '14501避险车道':'避险车道',
        // '14502预告标志':'预告标志',
        // '14503入口警告':'入口警告',
        // '14601路面结冰':'路面结冰',
        // '14602雨（雪）天':'雨（雪）天',
        // '14603雾天':'雾天',
        // '14604不利气象条件':'不利气象条件',
        // '14701前方车辆排队信息':'前方车辆排队信息',

        // 禁令标志
        '20101停车让行': '停车让行',
        '20201减速让行': '减速让行',
        '20301会车让行': '会车让行',
        '22901禁止超车': '禁止超车',
        '23001解除禁止超车': '解除禁止超车',
        '23301禁止鸣喇叭': '禁止鸣喇叭'
    };


    $scope.pageSize = 6;
    var typeCodeArr = [];// 结果集
    $scope.carCheckData = objCtrl.data.vehicle;
    $scope.checkValueFlag = false;
    $scope.carData = [];
    $scope.vehicleOptions = [
        { id: 0, label: '客车(小汽车)', checked: false },
        { id: 1, label: '配送卡车', checked: false },
        { id: 2, label: '运输卡车', checked: false },
        { id: 3, label: '步行者', checked: false },
        { id: 4, label: '自行车', checked: false },
        { id: 5, label: '摩托车', checked: false },
        { id: 6, label: '机动脚踏两用车', checked: false },
        { id: 7, label: '急救车', checked: false },
        { id: 8, label: '出租车', checked: false },
        { id: 9, label: '公交车', checked: false },
        { id: 10, label: '工程车', checked: false },
        { id: 11, label: '本地车辆', checked: false },
        { id: 12, label: '自用车辆', checked: false },
        { id: 13, label: '多人乘坐车辆', checked: false },
        { id: 14, label: '军车', checked: false },
        { id: 15, label: '有拖车的车', checked: false },
        { id: 16, label: '私营公共汽车', checked: false },
        { id: 17, label: '农用车', checked: false },
        { id: 18, label: '载有易爆品的车辆', checked: false },
        { id: 19, label: '载有水污染品的车辆', checked: false },
        { id: 20, label: '载有其它危险品的车辆', checked: false },
        { id: 21, label: '电车', checked: false },
        { id: 22, label: '轻轨', checked: false },
        { id: 23, label: '校车', checked: false },
        { id: 24, label: '四轮驱动车', checked: false },
        { id: 25, label: '装有防雪链的车', checked: false },
        { id: 26, label: '邮政车', checked: false },
        { id: 27, label: '槽罐车', checked: false },
        { id: 28, label: '残疾人车', checked: false }
    ];

    $scope.setTypeName = function (typeCode) {
        var name = '';
        for (var temp in $scope.typeCodes) {
            if (temp.indexOf(typeCode) > -1) {
                name = temp.substr(5); // 从下标5开始截取字符串
                break;
            }
        }
        $scope.temp.typeCodeName = name;
    };

    $ocLazyLoad.load(appPath.road + 'ctrls/attr_warningInfo_ctrl/carTypeCtrl.js');
    // 初始化函数;
    $scope.$on('warningCarType', function (event) {
        $scope.checkAllow();
    });
    $scope.carSelect = function (item) {
        if (item.checked) {
            item.checked = false;
            for (var i in $scope.carData) {
                if ($scope.carData[i].id.toString() == item.id) {
                    $scope.carData.splice(i, 1);
                }
            }
        } else {
            item.checked = true;
            $scope.carData.push(item);
        }
        // $scope.$emit('carType');
    };
    $scope.checkAllow = function () {
        var newArray = [];
        var result = '';
        for (var j = 0; j < $scope.carData.length; j++) {
            newArray.push($scope.carData[j].id);
        }
        for (var i = 31; i >= 0; i--) {
            if (i == 31) {
                if ($scope.checkValueFlag) {
                    result += '1';// 允许
                } else {
                    result += '0';// 禁止
                }
            } else if ($.inArray(i, newArray) != -1) {
                result += '1';
            } else {
                result += '0';
            }
        }
        objCtrl.data.vehicle = parseInt(result, 2);
    };
    $scope.getCheckData = function (data) {
        var towbin = Utils.dec2bin(data);
        // 循环车辆值域，根据数据库数据取出新的数组显示在页面
        var originArray = [];
        var len = towbin.length - 1;
        // 长度小于32即是没有选中checkbox，不允许
        if (towbin.length < 32) {
            $scope.checkValueFlag = false;
        } else {
            len = towbin.length - 2;
            $scope.checkValueFlag = true;
        }
        for (var i = len; i >= 0; i--) {
            if (towbin.split('').reverse().join('')[i] == 1) {
                originArray.push($scope.vehicleOptions[i]);
            }
        }

        if (originArray.length == 0) {
            $scope.carData = [];
        } else {
            for (var m = 0; m < $scope.vehicleOptions.length; m++) {
                $scope.vehicleOptions[m].checked = false;
            }
            for (var p = 0; p < originArray.length; p++) {
                $scope.vehicleOptions[originArray[p].id].checked = true;
                $scope.carData.push($scope.vehicleOptions[originArray[p].id]);
            }
        }
    };
    // $timeout(function(){
    //     $scope.$broadcast('set-code',str);
    //     $scope.rdGateData.condition[$scope.index].timeDomain = str;
    //     $scope.$apply();
    // },100);

    /* 点击选中的图片*/
    $scope.selectPicCode = function (code) {
        var flag = false;
        dsEdit.getByPid($scope.rdWarningInfoObj.linkPid, 'RDLINK').then(function (ret) {
            if (ret) {
                if (ret.forms.length > 0) {
                    if ((ret.direct === 2 || ret.direct === 3) && code.substr(0, 5) == '20301') {
                        swal('提示', '“会车让行”不允许制作在单方向link上', 'warning');
                        return;
                    }
                    for (var i = 0; i < ret.forms.length; i++) {
                        if (ret.forms[i].formOfWay == '50') {
                            flag = true;
                        }
                    }
                    if (flag) {
                        if (code.substr(0, 5) != '20201' && code.substr(0, 5) != '20101') { // 交叉口内道路上的警示信息只能是 减速让行和停车让行
                            swal('提示', '警示信息进入线具有交叉口link属性，则其警示信息类型只能是“停车让行”或者“减速让行”', 'warning');
                            return;
                        }
                    }
                    $scope.rdWarningInfoObj.typeCode = code.substr(0, 5);
                    $scope.typeCodeImg = $scope.rdWarningInfoObj.typeCode.substr(0, 5);
                    $scope.setTypeName(objCtrl.data.typeCode);
                    $scope.showImgData = false;
                }
            }
        });
    };

    var combinaPictures = function () {
        var len = $scope.picNowNum * $scope.pageSize > typeCodeArr.length ? typeCodeArr.length : $scope.picNowNum * $scope.pageSize;
        $scope.pictures = [];
        for (var i = ($scope.picNowNum - 1) * $scope.pageSize; i < len; i++) {
            var srcCode = typeCodeArr[i].code.substr(0, 5);
            $scope.pictures.push({
                src: appPath.root + 'images/road/warningInfo/' + srcCode + '.svg',
                code: typeCodeArr[i].code,
                fileName: typeCodeArr[i].name
            });
        }
    };

    var timer;
    /* 输入标牌类型*/
    $scope.showPicSelect = function () {
        if (timer) {
            $timeout.cancel(timer);
        }
        timer = $timeout(function () {
            $scope.showImgData = true;
            $scope.showPicLoading = true;
            $scope.loadText = '数据搜素中。。。';

            var typeCode = $scope.rdWarningInfoObj.typeCode;
            if (typeCode == '') {
                $scope.showImgData = false;
                return;
            }
            typeCodeArr = [];
            for (var code in $scope.typeCodes) {
                if (code.indexOf(typeCode) > -1) {
                    typeCodeArr.push({
                        code: code,
                        name: $scope.typeCodes[code]
                    });
                }
            }
            $scope.picNowNum = 1;
            $scope.picTotal = parseInt((typeCodeArr.length + $scope.pageSize - 1) / $scope.pageSize, 10);// 总页数

            if (typeCodeArr.length > 0) {
                $scope.showPicLoading = false;
                combinaPictures();
            } else {
                $scope.loadText = '没有搜索到相关结果';
                $scope.pictures = [];
            }
            $timeout.cancel(timer);
        }, 100);
    };

    $scope.verifyNumber = function (t, min, max, model) {
        var value = t.target.value;
        if (value === '') {
            value = '0';
        }
        if (value < min) {
            $scope.rdWarningInfoObj[model] = min;
            return;
        }
        if (value > max) {
            $scope.rdWarningInfoObj[model] = max;
            return;
        }
        value = parseInt(value.replace(/\D/g, ''), 10);
        $scope.rdWarningInfoObj[model] = value;
    };

    $scope.picNext = function () {
        $scope.picNowNum += 1;
        combinaPictures();
    };
    $scope.picPre = function () {
        $scope.picNowNum -= 1;
        combinaPictures();
    };

    /* 点击关闭隐藏选择图片界面*/
    $scope.hidePicSelect = function (e) {
        $scope.showImgData = false;
    };
    // 加载时间控件
    function timeoutLoad() {
        $timeout(function () {
            $ocLazyLoad.load(appPath.tool + 'fmTimeComponent/fmdateTimer.js').then(function () {
                $scope.dateURL = appPath.tool + 'fmTimeComponent/fmdateTimer.html';
                $ocLazyLoad.load(appPath.road + 'ctrls/attr_warningInfo_ctrl/carTypeCtrl.js').then(function () {
                    $scope.carPopoverURL = appPath.road + 'attr_warningInfo_tpl/carTypeTpl.html';
                });

                $timeout(function () {
                    $scope.$on('get-date', function (event, data) {
                        $scope.rdWarningInfoObj.timeDomain = data;
                    });
                    $scope.$broadcast('set-code', $scope.rdWarningInfoObj.timeDomain);
                }, 100);
            });
        });
    }
    // 初始化时执行
    timeoutLoad();

    $scope.initializeData = function () {
        $scope.carCheckData = objCtrl.data.vehicle;
        $scope.carData = [];
        // objCtrl.data.timeDomain = "[[(h18m00)(h18m30)]+[(h17m00)(h19m30)]]";
        // objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        $scope.rdWarningInfoObj = objCtrl.data;
        $scope.typeCodeImg = objCtrl.data.typeCode; // 用于显示图片
        $scope.setTypeName(objCtrl.data.typeCode);
        $scope.getCheckData($scope.carCheckData);
        timeoutLoad();
        $timeout(function () {
            $scope.$broadcast('set-code', $scope.rdWarningInfoObj.timeDomain);
        }, 100);
    };

    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
