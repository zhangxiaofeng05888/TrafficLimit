/**
 * Created by linglong on 2016/12/26.
 */
angular.module('app').controller('ordinaryLimitController', function ($scope, $timeout, $ocLazyLoad) {
    var eventController = fastmap.uikit.EventController();
    // 限制类型
    $scope.typeOptions = [
        {
            id: 0,
            label: '道路维修中'
        },
        {
            id: 1,
            label: '单行限制'
        },
        {
            id: 2,
            label: '车辆限制'
        },
        {
            id: 3,
            label: '穿行限制'
        },
        {
            id: 4,
            label: '施工中不开放'
        },
        {
            id: 5,
            label: '季节性关闭道路'
        },
        {
            id: 7,
            label: '超车限制'
        },
        {
            id: 6,
            label: 'Usage Fee Required'
        },
        {
            id: 8,
            label: '外地车限行'
        },
        {
            id: 9,
            label: '尾号限行'
        },
        {
            id: 10,
            label: '在建'
        }
    ];
    // 限制方向
    $scope.limitDirOptions = [
        {
            id: 0,
            label: '未调查'
        },
        {
            id: 1,
            label: '双方向'
        },
        {
            id: 2,
            label: '顺方向'
        },
        {
            id: 3,
            label: '逆方向'
        },
        {
            id: 9,
            label: '不应用'
        }
    ];
    // 收费类型
    $scope.tollTypeOptions = [
        {
            id: 0,
            label: '无'
        },
        {
            id: 1,
            label: '收费道路'
        },
        {
            id: 2,
            label: '桥'
        },
        {
            id: 3,
            label: '隧道'
        },
        {
            id: 4,
            label: '公园'
        },
        {
            id: 5,
            label: '山径'
        },
        {
            id: 6,
            label: '风景路线'
        },
        {
            id: 9,
            label: '不应用'
        }
    ];
    // 天气条件
    $scope.weatherOptions = [
        {
            id: 0,
            label: '无'
        },
        {
            id: 1,
            label: '雨天'
        },
        {
            id: 2,
            label: '雪天'
        },
        {
            id: 3,
            label: '雾天'
        },
        {
            id: 9,
            label: '不应用'
        }
    ];
    // 车辆类型;
    $scope.vehicleOptions = [
        {
            id: 0,
            label: '客车(小汽车)',
            checked: false
        },
        {
            id: 1,
            label: '配送卡车',
            checked: false
        },
        {
            id: 2,
            label: '运输卡车',
            checked: false
        },
        {
            id: 3,
            label: '步行者',
            checked: false
        },
        {
            id: 4,
            label: '自行车',
            checked: false
        },
        {
            id: 5,
            label: '摩托车',
            checked: false
        },
        {
            id: 6,
            label: '机动脚踏两用车',
            checked: false
        },
        {
            id: 7,
            label: '急救车',
            checked: false
        },
        {
            id: 8,
            label: '出租车',
            checked: false
        },
        {
            id: 9,
            label: '公交车',
            checked: false
        },
        {
            id: 10,
            label: '工程车',
            checked: false
        },
        {
            id: 11,
            label: '本地车辆',
            checked: false
        },
        {
            id: 12,
            label: '自用车辆',
            checked: false
        },
        {
            id: 13,
            label: '多人乘坐车辆',
            checked: false
        },
        {
            id: 14,
            label: '军车',
            checked: false
        },
        {
            id: 15,
            label: '有拖车的车',
            checked: false
        },
        {
            id: 16,
            label: '私营公共汽车',
            checked: false
        },
        {
            id: 17,
            label: '农用车',
            checked: false
        },
        {
            id: 18,
            label: '载有易爆品的车辆',
            checked: false
        },
        {
            id: 19,
            label: '载有水污染品的车辆',
            checked: false
        },
        {
            id: 20,
            label: '载有其它危险品的车辆',
            checked: false
        },
        {
            id: 21,
            label: '电车',
            checked: false
        },
        {
            id: 22,
            label: '轻轨',
            checked: false
        },
        {
            id: 23,
            label: '校车',
            checked: false
        },
        {
            id: 24,
            label: '四轮驱动车',
            checked: false
        },
        {
            id: 25,
            label: '装有防雪链的车',
            checked: false
        },
        {
            id: 26,
            label: '邮政车',
            checked: false
        },
        {
            id: 27,
            label: '槽罐车',
            checked: false
        },
        {
            id: 28,
            label: '残疾人车',
            checked: false
        }
    ];
    // 二进制转10进制
    function bin2dec(bin) {
        var c = bin.split('');
        var dec = 0;
        var temp;
        for (var i = 0; i < c.length; i++) {
            temp = 1;
            if (c[i] == 1) {
                for (var j = i + 1; j < c.length; j++) temp *= 2;
                dec += temp;
            } else if (c[i] != 0) {
                return 0;
            }
        }
        return dec;
    }
    // 获取汽车的组合字符
    function getViche32BitValue(data, flag) {
        var newArray = [];
        var result = '';
        data.forEach(function (item) {
            if (item.checked) {
                newArray.push(item.id);
            }
        });
        for (var i = 31; i >= 0; i--) {
            if (i == 31) {
                if (flag) {
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
        return result;
    }
    // 初始化车辆限制数据
    var initViches = function () {
        var towbin = Utils.dec2bin($scope.currentActiveOrdinaryLimits.vehicle);
        // 循环车辆值域，根据数据库数据取出新的数组显示在页面
        var originArray = [];
        var len = towbin.length - 1;

        if (!towbin) {  //  towbin 是字符串类型
            $scope.checkValueFlag = true;
        } else if (towbin.length < 32) {    // 长度小于32即是没有选中checkbox，不允许
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
        if (originArray.length) {
            $scope.vehicleOptions.forEach(function (item) {
                item.checked = false;
            });
            for (var p = 0; p < originArray.length; p++) {
                $scope.vehicleOptions[originArray[p].id].checked = true;
            }
        }
    };

    var initializeFn = function () {
        initViches();
    };

    // 选择车辆类型时，将选中的类型转成所要的格式;
    $scope.carSelect = function () {
        var bit32Value = getViche32BitValue($scope.vehicleOptions, $scope.checkValueFlag);
        $scope.currentActiveOrdinaryLimits.vehicle = parseInt(bin2dec(bit32Value), 10);
    };

    // 监听车辆类型是否选择允许;
    $scope.checkAllowed = function () {
        var bit32Value = getViche32BitValue($scope.vehicleOptions, $scope.checkValueFlag);
        $scope.currentActiveOrdinaryLimits.vehicle = parseInt(bin2dec(bit32Value), 10);
    };

    eventController.on('limitTimeCtrl', function () {
        if ($scope.currentActiveOrdinaryLimits.type == 5) {
            eventController.fire('disableFuzzy', { isFuzzy: false });
        } else {
            eventController.fire('disableFuzzy', { isFuzzy: true });
        }
    });

    // 改变限制类型的关联维护;
    $scope.limitTypeChange = function () {
        // 限制类型为usage Fee Required时对收费信息的维护;
        if ($scope.currentActiveOrdinaryLimits.type == 6) {
            $scope.currentActiveOrdinaryLimits.tollType = 2;
        } else {
            $scope.currentActiveOrdinaryLimits.tollType = 9;
        }
        // 限制类型为“施工中不开放”、“道路维修中”,对录入时间的维护;
        if ($scope.currentActiveOrdinaryLimits.type != 0 && $scope.currentActiveOrdinaryLimits.type != 4) {
            if ($scope.currentActiveOrdinaryLimits.inputTime) {
                $scope.currentActiveOrdinaryLimits.inputTime = '';
            }
        } else {
            $scope.currentActiveOrdinaryLimits.inputTime = new Date().getTime().toString();
        }
        // 限制类型为不为超车限制对天气条件的维护
        //  当为7但是车辆类型不包含卡车是维护为9（下次做）
        // （当不为7时，天气条件维护为9）
        if ($scope.currentActiveOrdinaryLimits.type != 7) {
            $scope.currentActiveOrdinaryLimits.weather = 9;
        }
        // 限制类型为穿行限制、在建时，赋值方式维护为未验证
        if ($scope.currentActiveOrdinaryLimits.type == 3 || $scope.currentActiveOrdinaryLimits.type == 10) {
            $scope.currentActiveOrdinaryLimits.processFlag = 2;
        } else {
            $scope.currentActiveOrdinaryLimits.processFlag = 0;
        }
        // 除季节性关闭道路类型的限制之外，其余限制信息中，时间段信息中的“模糊时间域”置灰，不可编辑
        if ($scope.currentActiveOrdinaryLimits.type == 5) {
            eventController.fire('disableFuzzy', { isFuzzy: false });
        } else {
            eventController.fire('disableFuzzy', { isFuzzy: true });
        }
        // 当限制类型为单行限制、季节性关闭道路、Usage Fee Required、超车限制时，限制方向为未调查，并允许编辑
        if ([0, 2, 3, 4, 8, 9, 10].indexOf($scope.currentActiveOrdinaryLimits.type) != -1) {
            $scope.currentActiveOrdinaryLimits.limitDir = 0;
        }
    };

    /* 时间控件*/
    $scope.fmdateTimer = function (str) {
        $scope.$on('get-date', function (event, data) {
            $scope.currentActiveOrdinaryLimits.timeDomain = data;
        });
        $timeout(function () {
            $scope.$broadcast('set-code', str);
            $scope.currentActiveOrdinaryLimits.timeDomain = str;
            $scope.$apply();
        }, 100);
    };

    $timeout(function () {
        $ocLazyLoad.load('../../scripts/components/tools/fmTimeComponent/fmdateTimer.js').then(function () {
            $scope.dateURL = '../../scripts/components/tools/fmTimeComponent/fmdateTimer.html';
            /* 查询数据库取出时间字符串*/
            $scope.fmdateTimer($scope.currentActiveOrdinaryLimits.timeDomain);
            $scope.$broadcast('set-code', $scope.currentActiveOrdinaryLimits.timeDomain);
        });
    });
    $scope.setStyle = function () {
        var p = null;
        if ($scope.linkData.batchType == 'rectSelect') {
            p = { 'pointer-events': 'none' };
        }
        return p;
    };
    initializeFn();
});
