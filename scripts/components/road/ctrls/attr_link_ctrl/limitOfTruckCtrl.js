/**
 * Created by linglong on 2016/12/26.
 */
var truckLimitApp = angular.module('app');
truckLimitApp.controller('truckLimitInfoController', function ($scope, $timeout, $ocLazyLoad) {
    var timer;
    $scope.oldResAxleCount = $scope.currentActiveTrucksLimits.resAxleCount;

    $scope.limitDirOptions = [
        { id: 0, label: '未调查' },
        { id: 1, label: '双方向' },
        { id: 2, label: '顺方向' },
        { id: 3, label: '逆方向' },
        { id: 9, label: '不应用' }
    ];
    // 点击输入框，如果为0则清空
    $scope.prepareAxleCount = function () {
        if ($scope.currentActiveTrucksLimits.resAxleCount == 0) {
            $scope.currentActiveTrucksLimits.resAxleCount = '';
        }
    };

    /* 时间控件*/
    $scope.fmdateTimer = function (str) {
        $scope.$on('get-date', function (event, data) {
            $scope.currentActiveTrucksLimits.timeDomain = data;
        });
        $timeout(function () {
            $scope.$broadcast('set-code', str);
            $scope.currentActiveTrucksLimits.timeDomain = str;
            $scope.$apply();
        }, 100);
    };
    // 验证限制轴树输入合法
    $scope.verifyAxleCount = function (newValue, oldValue) {
        var axleReg = /^(-)?\d{1,2}$/;
        if (newValue) {
            if (new RegExp(axleReg).test(newValue)) {
                // 判断是否以0开头
                $scope.oldResAxleCount = parseInt($scope.currentActiveTrucksLimits.resAxleCount, 10);
                $scope.currentActiveTrucksLimits.resAxleCount = $scope.oldResAxleCount;
            } else {
                $scope.currentActiveTrucksLimits.resAxleCount = oldValue;
            }
        } else {
            $scope.currentActiveTrucksLimits.resAxleCount = 0;
        }
    };
    // 车辆限重输入控制
    $scope.verifyResWeigh = function (newValue, oldValue) {
        var codeRange = [46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
        if (newValue) {
            if (new RegExp(/^(\d{1,3}|\d{1,3}\.\d{0,2})$/).test(newValue)) {
                var lastCode = newValue.charCodeAt(newValue.length - 1);
                // 开始输入不合法的情况：
                // 输入不为数字或.
                // 第一个字符为.
                // 0之前还有0
                // 连续输入两个.
                var notANumber = (codeRange.indexOf(lastCode) == -1);
                var isDotFirst = (lastCode == 46 && lastCode == newValue[0].charCodeAt(0));
                var isDoubleZeroFront = /^00/.test(newValue);
                var doubleDot = /\.\d*\./.test(newValue);
                var length = newValue.length;
                if (notANumber || isDotFirst || isDoubleZeroFront || doubleDot) {
                    $scope.currentActiveTrucksLimits.resWeigh = parseFloat(oldValue);
                    return;
                }
                // 开始输入合法的情况
                // 存在小数，最长不能超过6位，不存在小数，最长为5位
                var isFloatNumer = /\./.test(newValue);
                if (isFloatNumer) {
                    // 小数点不能超过2位
                    // length不能大于6
                    if (length > 6 || /\.\d{3,}/.test(newValue) || (length == 6 && newValue.charCodeAt(newValue.length - 1) == 46)) {
                        $scope.currentActiveTrucksLimits.resWeigh = parseFloat(oldValue);
                    }
                } else {
                    $scope.currentActiveTrucksLimits.resWeigh = length > 5 ? parseFloat(oldValue) : newValue;
                }
            } else {
                $scope.currentActiveTrucksLimits.resWeigh = parseFloat(oldValue);
            }
        } else {
            $scope.currentActiveTrucksLimits.resWeigh = 0;
        }
    };
    // 限制轴重输入控制
    $scope.verifyAxleLoad = function (newValue, oldValue) {
        var codeRange = [46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
        if (newValue) {
            if (new RegExp(/^(\d{1,3}|\d{1,3}\.\d{0,2})$/).test(newValue)) {
                var lastCode = newValue.charCodeAt(newValue.length - 1);
                // 开始输入不合法的情况：
                // 输入不为数字或.
                // 第一个字符为.
                // 0之前还有0
                // 连续输入两个.
                var notANumber = (codeRange.indexOf(lastCode) == -1);
                var isDotFirst = (lastCode == 46 && lastCode == newValue[0].charCodeAt(0));
                var isDoubleZeroFront = /^00/.test(newValue);
                var doubleDot = /\.\d*\./.test(newValue);
                var length = newValue.length;
                if (notANumber || isDotFirst || isDoubleZeroFront || doubleDot) {
                    $scope.currentActiveTrucksLimits.resAxleLoad = parseFloat(oldValue);
                    return;
                }
                // 开始输入合法的情况
                // 存在小数，最长不能超过6位，不存在小数，最长为5位
                var isFloatNumer = /\./.test(newValue);
                if (isFloatNumer) {
                    // 小数点不能超过2位
                    // length不能大于6
                    if (length > 6 || /\.\d{3,}/.test(newValue) || (length == 6 && newValue.charCodeAt(newValue.length - 1) == 46)) {
                        $scope.currentActiveTrucksLimits.resAxleLoad = parseFloat(oldValue);
                    }
                } else {
                    $scope.currentActiveTrucksLimits.resAxleLoad = length > 5 ? parseFloat(oldValue) : newValue;
                }
            } else {
                $scope.currentActiveTrucksLimits.resAxleLoad = parseFloat(oldValue);
            }
        } else {
            $scope.currentActiveTrucksLimits.resAxleLoad = 0;
        }
    };

    $timeout(function () {
        $ocLazyLoad.load('../../scripts/components/tools/fmTimeComponent/fmdateTimer.js').then(function () {
            $scope.dateURL = '../../scripts/components/tools/fmTimeComponent/fmdateTimer.html';
            /* 查询数据库取出时间字符串*/
            $scope.fmdateTimer($scope.currentActiveTrucksLimits.timeDomain);
            $scope.$broadcast('set-code', $scope.currentActiveTrucksLimits.timeDomain);
        });
    });

    $scope.setStyle = function () {
        var p = null;
        if ($scope.linkData.batchType == 'rectSelect') {
            p = {
                'pointer-events': 'none'
            };
        }
        return p;
    };
});
