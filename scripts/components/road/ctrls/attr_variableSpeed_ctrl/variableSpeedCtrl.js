/**
 * Created by linglong on 2016/8/15.
 */
angular.module('app').controller('variableSpeedCtl', ['$scope', function ($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    /* 限速条件*/
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

    var initViches = function () {
        var towbin = Utils.dec2bin($scope.variableSpeed.vehicle);
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
        if (originArray.length) {
            $scope.vehicleOptions.forEach(function (item) {
                item.checked = false;
            });
            for (var p = 0; p < originArray.length; p++) {
                $scope.vehicleOptions[originArray[p].id].checked = true;
            }
        }
    };

    // 选择车辆类型时，将选中的类型转成所要的格式;
    $scope.carSelect = function () {
        var bit32Value = getViche32BitValue($scope.vehicleOptions, $scope.checkValueFlag);
        $scope.variableSpeed.vehicle = parseInt(bin2dec(bit32Value), 10);
    };
    // 监听车辆类型是否选择允许;
    $scope.checkAllowed = function () {
        var bit32Value = getViche32BitValue($scope.vehicleOptions, $scope.checkValueFlag);
        $scope.variableSpeed.vehicle = parseInt(bin2dec(bit32Value), 10);
    };

    $scope.initializeData = function () {
        $scope.variableSpeed = objCtrl.data;
        initViches();
        // 十进制转二进制;
        $scope.variableSpeedPosition = {
            left: ($scope.variableSpeed.location & 1) == 1,
            right: ($scope.variableSpeed.location & 2) == 2,
            up: ($scope.variableSpeed.location & 4) == 4
        };
    };

    $scope.locationClick = function (checked, num) {
        if (checked) {
            $scope.variableSpeed.location ^= num;
        } else {
            $scope.variableSpeed.location |= num;
        }
    };

    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);
    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
