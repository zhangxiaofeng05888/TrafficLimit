/**
 * Created by liuzhaoxia on 2015/12/11.
 */

var selectApp = angular.module('app');
selectApp.controller('speedlimitTeplController', ['$scope', '$timeout', '$ocLazyLoad', 'dsEdit', function ($scope, $timeout, $ocLazyLoad, dsEdit) {
    var objectEditCtrl = fastmap.uikit.ObjectEditController();
    // var outputCtrl = fastmap.uikit.OutPutController({});
    var layerCtrl = fastmap.uikit.LayerController();
    var selectCtrl = fastmap.uikit.SelectController();
    var speedLimit = layerCtrl.getLayerById('relationData');
    var eventController = fastmap.uikit.EventController();
    // var shapeCtrl = fastmap.uikit.ShapeEditorController();
    // var highRenderCtrl = fastmap.uikit.HighRenderController();

    $scope.carSpeedType = false;
    $scope.speedTypeOptions = [
        { id: 0, label: '普通' },
        { id: 1, label: '指示牌' },
        { id: 3, label: '特定条件' },
        { id: 4, label: '车道限速' }
    ];
    $scope.speedDirectTypeOptions = [
        { id: 0, label: '0  未调查' },
        { id: 2, label: '2 顺方向' },
        { id: 3, label: '3 逆方向' }
    ];
    $scope.speedDependentOption = [
        { id: 0, label: '0  无' },
        { id: 1, label: '1 雨天(Rain)' },
        { id: 2, label: '2 雪天(Snow)' },
        { id: 3, label: '3 雾天(Fog)' },
        { id: 6, label: '6 学校(School)' },
        { id: 10, label: '10 时间限制' },
        { id: 11, label: '11 车道限制' },
        { id: 12, label: '12 季节时段' },
        { id: 13, label: '13 医院' },
        { id: 14, label: '14 购物' },
        { id: 15, label: '15 居民区' },
        { id: 16, label: '16 企事业单位' },
        { id: 17, label: '17 景点景区' },
        { id: 18, label: '18 交通枢纽' }
    ];
    $scope.limitSrcOption = [
        { id: 0, label: '0  无' },
        { id: 1, label: '1 现场标牌' },
        { id: 2, label: '2 城区标识' },
        { id: 3, label: '3 高速标识' },
        { id: 4, label: '4 车道限速' },
        { id: 5, label: '5 方向限速' },
        { id: 6, label: '6 机动车限速' },
        { id: 7, label: '7 匝道未调查' },
        { id: 8, label: '8 缓速行驶' },
        { id: 9, label: '9 未调查' }
    ];
    $scope.captureFlagOption = [
        { id: 0, label: '0 现场采集' },
        { id: 1, label: '1 理论判断' },
        { id: 2, label: '2 现场自动识别' }
    ];
    $scope.changeSpeedDependent = function () {
        if ($scope.speedLimitData.speedDependent != 12) {
            eventController.fire('disableFuzzy', { isFuzzy: true });
            $scope.$broadcast('Cancel-Checked', false);
        } else if ($scope.speedLimitData.speedDependent === 12) {
            eventController.fire('disableFuzzy', { isFuzzy: false });
        }
    };
    $scope.initTimer = function () {
        $timeout(function () {
            $ocLazyLoad.load('../../scripts/components/tools/fmTimeComponent/fmdateTimer.js').then(function () {
                $scope.dateURL = '../../scripts/components/tools/fmTimeComponent/fmdateTimer.html';
                /* 查询数据库取出时间字符串*/
                $scope.fmdateTimer($scope.speedLimitData.timeDomain);
                $scope.$broadcast('set-code', $scope.speedLimitData.timeDomain);
                $timeout(function () {
                    $scope.changeSpeedDependent();
                });
            });
        });
    };

    $scope.initializeData = function () {
        $scope.speedLimitData = objectEditCtrl.data;
        $scope.speedLimitGeometryData = objectEditCtrl.data.geometry;
        var geo = {};
        geo.points = [];
        geo.points.push(fastmap.mapApi.point($scope.speedLimitData.geometry.coordinates[0], $scope.speedLimitData.geometry.coordinates[1]));
        geo.components = geo.points;
        geo.type = 'SpeedLimit';
        selectCtrl.onSelected({
            geometry: geo,
            id: $scope.speedLimitData.pid,
            linkPid: $scope.speedLimitData.linkPid,
            type: 'Marker',
            direct: $scope.speedLimitData.direct,
            point: $scope.speedLimitData.geometry.coordinates
        });

        $scope.initTimer();
    };
    // if (objectEditCtrl.data) {
    //     $scope.initializeData();
    // }
    // $scope.speedLimitValue = $scope.speedLimitData.speedValue / 10;
    // $scope.initTimer();
    /* 时间控件*/
    $scope.fmdateTimer = function (str) {
        $scope.$on('get-date', function (event, data) {
            $scope.speedLimitData.timeDomain = data;
        });
        $timeout(function () {
            $scope.$broadcast('set-code', str);
            $scope.speedLimitData.timeDomain = str;
            $scope.$apply();
        }, 100);
    };
    // 切换限速类型
    $scope.changeSpeedType = function () {
        $scope.speedLimitData.speedDependent = 1;
        $scope.speedLimitData.laneSpeedValue = '';
        if ($scope.speedLimitData.speedType == 3) {
            $timeout(function () {
                eventController.fire('disableFuzzy', { isFuzzy: true });
                $scope.$broadcast('Cancel-Checked', false);
            });
        }
    };
    $scope.roadwayEntry = function (event) {
        if (event.keyCode === 32) {
            $scope.speedLimitData.laneSpeedValue += '|';
        }
    };
    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
