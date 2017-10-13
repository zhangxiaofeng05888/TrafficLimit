angular.module('app').controller('chargingPlotCtrl', function ($scope) {
    $scope.chainListPlot = {};
    $scope.chargingArr = $scope.poi.chargingplots;

    /* 初始化品牌*/
    $scope.initChain = function () {
        var charingChain = $scope.metaData.charingChain;
        for (var i = 0, len = charingChain.length; i < len; i++) {
            var temp = charingChain[i];
            if (temp.chainCode && temp.chainCode.length === 4) { // 只显示chainCode长度等于4的
                $scope.chainListPlot[temp.chainCode] = { // 转换成chosen-select可以解析的格式
                    chainCode: temp.chainCode,
                    chainName: temp.chainName,
                    hm_flag: temp.hm_flag
                };
            }
        }
    };

    $scope.rename = function (name, index) {
        return name + '$' + index + '$';
    };

    $scope.chargingPlugTypeChange = function (event, charging) {
        var obj = charging.plugType;
        var o;
        var flag = true;
        for (o in obj) {
            if (obj[o]) {
                flag = false;
                break;
            }
        }
        if (flag) {
            obj['9'] = true;
        }
    };
    $scope.changeCharginPayment = function (event, charging) {
        var obj = charging.payment;
        var o;
        var flag = true;
        for (o in obj) {
            if (obj[o]) {
                flag = false;
                break;
            }
        }
        if (flag) {
            obj['4'] = true;
        }
    };
    // $scope.ctrl = {
    //     open: true,
    //     btShow: true
    // };
    // for (var i = 0; i < $scope.chargingArr.length; i++) {
    //     // if ($scope.chargingArr[i].selectedChain || $scope.chargingArr[i].selectedChain < 99) {
    //     //     $scope.chargingArr[i].chargeChainObj = {};
    //     // } else {
    //     //     $scope.chargingArr[i].chargeChainObj = chargeChainFmt;
    //     // }
    //     $scope.chargingArr[i].chargeChainObj = {};
    // }
    $scope.changeOpenType = function (event, charging) {
        if (event.target.value == '1') {
            if (event.target.checked) {
                for (var key in charging.openType) {
                    if (key != '1') {
                        charging.openType[key] = false;
                    }
                }
                charging.isBrandOpen = false;
                charging.selectedChain = '';
            }
        } else if (event.target.checked) {
            charging.openType['1'] = false;
        }
    };
    $scope.changeBrandOpen = function (event, charging) {
        if (event.target.checked) {
            charging.openType['1'] = false;
        } else {
            charging.selectedChain = '';
        }
    };
    $scope.chargingPlugType = FM.dataApi.Constant.plugType;
    $scope.chargingOpenType = FM.dataApi.Constant.openType;
    $scope.charginPayment = FM.dataApi.Constant.plotPayment;
    $scope.chargingAvailableState = [   // 充电站类型
        { id: 0, label: '可以使用（有电）' },
        { id: 1, label: '不可使用（没电）' },
        { id: 2, label: '维修中' },
        { id: 3, label: '建设中' },
        { id: 4, label: '规划中' }
    ];
    $scope.addChargPole = function () {
        $scope.poi.chargingplots.unshift(new FM.dataApi.IxPoiChargingplot({}));
    };
    $scope.removeChargPole = function (index) {
        if ($scope.poi.chargingplots.length > 1) {
            $scope.poi.chargingplots.splice(index, 1);
        }
    };

    $scope.initChain();
});
