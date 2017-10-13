/**
 * Created by liwanchong on 2016/3/3.
 */
var conditionSpeedApp = angular.module('app');
conditionSpeedApp.controller('conditionSpeedController', function ($scope, $timeout, $ocLazyLoad) {
    // 限速条件;
    $scope.speedDependentOption = [
        { id: 0, label: '无' },
        { id: 1, label: '雨天' },
        { id: 2, label: '雪天' },
        { id: 3, label: '雾天' },
        { id: 6, label: '学校' },
        { id: 10, label: '时间限制' },
        { id: 11, label: '车道限制' },
        { id: 12, label: '季节时段' },
        { id: 13, label: '医院' },
        { id: 14, label: '购物' },
        { id: 15, label: '居民区' },
        { id: 16, label: '企事业单位' },
        { id: 17, label: '景点景区' },
        { id: 18, label: '交通枢纽' }
    ];
    // 顺逆向来源
    $scope.fromLimitSrcOption = [
        { id: 0, label: '无' },
        { id: 1, label: '现场标牌' },
        { id: 2, label: '城区标识' },
        { id: 3, label: '高速标识' },
        { id: 4, label: '车道限速' },
        { id: 5, label: '方向限速' },
        { id: 6, label: '机动车限速' },
        { id: 7, label: '匝道未调查' },
        { id: 8, label: '缓速行驶' },
        { id: 9, label: '未调查' }
    ];

    // 改变条件限速值对限速来源的维护;
    $scope.changeClass = function (item, dir) {
        if (dir == 2) {
            if (item.fromSpeedLimit != 0) {
                item.fromLimitSrc = 1;
            } else {
                item.fromLimitSrc = 0;
            }
        }
        if (dir == 3) {
            if (item.toSpeedLimit != 0) {
                item.toLimitSrc = 1;
            } else {
                item.toLimitSrc = 0;
            }
        }
    };
    /* 时间控件*/
    $scope.fmdateTimer = function (str) {
        $scope.$on('get-date', function (event, data) {
            $scope.currentSpeedData.timeDomain = data;
        });
        $timeout(function () {
            $scope.$broadcast('set-code', str);
            $scope.currentSpeedData.timeDomain = str;
            $scope.$apply();
        }, 100);
    };
    
    $timeout(function () {
        $ocLazyLoad.load('../../scripts/components/tools/fmTimeComponent/fmdateTimer.js').then(function () {
            $scope.dateURL = '../../scripts/components/tools/fmTimeComponent/fmdateTimer.html';
            /* 查询数据库取出时间字符串*/
            $scope.fmdateTimer($scope.currentSpeedData.timeDomain);
            $scope.$broadcast('set-code', $scope.currentSpeedData.timeDomain);
        });
    });
});
