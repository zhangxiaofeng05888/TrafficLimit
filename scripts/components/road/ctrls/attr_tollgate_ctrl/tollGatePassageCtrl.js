/**
 * Created by wangmingdong on 2016/8/10.
 */
var tollApp = angular.module('app');
tollApp.controller('TollGatePassageCtl', ['$scope', 'dsEdit', function ($scope, dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    /* 领卡类型*/
    $scope.cardTypeObj = [
        { id: 0, label: '未调查', name: '未调查' },
        { id: 1, label: 'ETC', name: 'ETC通道' },
        { id: 2, label: '人工', name: '人工通道' },
        { id: 3, label: '自助', name: '自助通道' }
    ];
    /* 通道类型*/
    $scope.laneTypeObj = [
        { id: 0, label: '通用车道' },
        { id: 1, label: '称重车道' }
    ];
    /* 领卡类型*/
    $scope.cardTypeLimitObj = [
        { id: 1, label: 'ETC', name: 'ETC通道' },
        { id: 2, label: '人工', name: '人工通道' }
    ];
    /* 收费方式*/
    $scope.tollFormObj = [
        { id: 100, label: '未调查', checked: false },
        { id: 101, label: 'ETC', checked: false },
        { id: 102, label: '现金', checked: false },
        { id: 103, label: '银行卡（借记卡）', checked: false },
        { id: 104, label: '信用卡', checked: false },
        { id: 105, label: 'IC卡', checked: false },
        { id: 106, label: '预付卡', checked: false }
    ];
    /* 汽车类型*/
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
    /**
     *
     * @param vehicle
     * @param $index
     */
    function showvehicle(vehicle) {
        var towbin = Utils.dec2bin(vehicle);
        // 循环车辆值域，根据数据库数据取出新的数组显示在页面
        var originArray = [];
        $scope.isAllowed = false;
        // 长度小于32即是没有选中checkbox，不允许
        if (towbin.length < 32) {
            var len = towbin.length - 1;
            $scope.isAllowed = false;
        } else {
            len = towbin.length - 2;
            $scope.isAllowed = true;
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
    }

    /**
     * 每次选择车辆类型计算选择后的车辆类型数值;
     */
    $scope.checkViche = function () {
        var newArray = [];
        var result = '';
        for (var j = 0; j < $scope.carData.length; j++) {
            newArray.push($scope.carData[j].id);
        }
        for (var i = 31; i >= 0; i--) {
            if (i == 31) {
                if ($scope.isAllowed) {
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
        objCtrl.data.passages[$scope.tdIndex].vehicle = parseInt(result, 2);
    };

    /**
     *初始化洗车类型选项;
     */
    function reSetVehicleOptions() {
        for (var i = 0; i < $scope.vehicleOptions.length; i++) {
            if ($scope.vehicleOptions[i].checked) {
                $scope.vehicleOptions[i].checked = !$scope.vehicleOptions[i].checked;
            }
        }
    }

    /**
     * 显示收费方式当前选项;
     * @param tollType
     * @param $index
     */
    function showChargeWay(tollType) {
        if (tollType === 0) {
            $scope.chargeWay[0].checked = true;
        } else {
            var towbin = tollType.toString();
            if (towbin.length) {
                towbin += '0';
                for (var i = 0; i < towbin.length; i++) {
                    if (towbin.split('').reverse()[i] == '1') {
                        $scope.chargeWay[i].checked = true;
                    }
                }
            } else {
                $scope.chargeWay[0].checked = true;
            }
        }
    }

    /**
     * 车辆类型复选并将选中的类型转化为二进制;
     * @param item
     */
    $scope.carSelect = function (item, e) {
        // 根据点击的位置必须要更新当前编辑数组的下标;
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
        $scope.checkViche();
    };

    /* 切换领卡类型*/
    $scope.changeCardType = function () {
        $scope.$emit('refreshEtcCode', true);
    };

    /**
     * 隐藏车辆类型面板;
     */
    $scope.closePopover = function () {
        $('body .carTypeTip:last').hide();
    };
    /**
     * 显示车辆类型面板
     * @param e
     * @param index
     */
    $scope.showPopover = function (e, index) {
        /* 将车辆类型面板显示到指定位置*/
        var dateTimeWell = $(e.target).parents('.fm-container').parent();
        $('body').append($(e.target).parents('.fm-container').find('.carTypeTip'));
        $('.carTypeTip').css({
            top: ($(e.target).offset().top - 80) + 'px',
            right: (dateTimeWell.attr('data-type') == 1) ? '300px' : '600px'
        });
        $('body .carTypeTip:last').show();

        $scope.passageIndex = index;
        // 每次显示车辆类型复选面板时初始化面板全为不选;
        reSetVehicleOptions();
        $scope.carData = [];
        showvehicle($scope.tollGatePassageData.vehicle, index);
    };

    /**
     * 收费类型选择事件监听
     * @param num
     */
    $scope.selectChargeType = function (value) {
        if (value.id === 100 || value.id === 101) {
            value.id -= 100;
        }
        var newArray = [];
        var result = '';
        var j;
        if (value.id == 1) {
            if ($scope.chargeWay[1].checked) {
                for (j = 0; j < $scope.chargeWay.length; j++) {
                    if (j != 1) {
                        $scope.chargeWay[j].checked = false;
                    } else {
                        $scope.chargeWay[j].checked = true;
                    }
                }
                newArray = [1];
            }
        } else if (value.id == 0) {
            if ($scope.chargeWay[0].checked) {
                for (j = 0; j < $scope.chargeWay.length; j++) {
                    if (j != 0) {
                        $scope.chargeWay[j].checked = false;
                    } else {
                        $scope.chargeWay[j].checked = true;
                    }
                }
                newArray = [0];
            }
        } else {
            for (j = 0; j < $scope.chargeWay.length; j++) {
                if ($scope.chargeWay[j].checked) {
                    if ($scope.chargeWay[j].id === 1 || $scope.chargeWay[j].id === 0) {
                        $scope.chargeWay[0].checked = false;
                        $scope.chargeWay[1].checked = false;
                    } else {
                        newArray.push($scope.chargeWay[j].id - 100);
                    }
                }
            }
            /* if (newArray.indexOf(1) > -1) {
                for (j = 0; j < $scope.chargeWay.length; j++) {
                    if (j != 1) {
                        $scope.chargeWay[j].checked = false;
                    } else {
                        $scope.chargeWay[j].checked = true;
                    }
                }
                newArray = [1];
            }
            if (newArray.indexOf(0) > -1) {
                for (j = 0; j < $scope.chargeWay.length; j++) {
                    if (j != 0) {
                        $scope.chargeWay[j].checked = false;
                    } else {
                        $scope.chargeWay[j].checked = true;
                    }
                }
                newArray = [0];
            }*/
        }

        for (var i = 6; i >= 0; i--) {
            if ($.inArray(i, newArray) != -1) {
                result += '1';
            } else {
                result += '0';
            }
        }
        result = result.substr(0, result.length - 1);
        objCtrl.data.passages[$scope.tdIndex].tollForm = parseInt(result, 10);
        // $scope.$emit('tollGateCardType', true);
    };

    /* ---------------------------------------------公共方法---------------------------------------------*/


    /* 初始化*/
    $scope.initPassage = function () {
        $scope.passageType = objCtrl.data.type;
        $scope.tollGateInfo = $scope.tollGatePassageData;
        $scope.tdIndex = $scope.passagesIndex;
        $scope.passageIndex = 0;
        $scope.carData = [];
        $scope.chargeWay = [];
        $scope.chargeWay = angular.copy($scope.tollFormObj);
        $scope.isAllowed = false;
        showvehicle($scope.tollGateInfo.vehicle);
        showChargeWay($scope.tollGateInfo.tollForm);
    };

    /* 初始化*/
    $scope.initPassage();
    $scope.$on('refreshTollgatePassage', $scope.initPassage);
}]);
