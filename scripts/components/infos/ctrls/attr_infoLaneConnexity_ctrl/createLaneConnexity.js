/**
 * Created by zhaohang on 2017/4/25.
 */

angular.module('app').controller('TipLaneConnexityTopoEditCtrl', ['$scope', 'hotkeys',
    function ($scope, hotkeys) {
        var eventCtrl = fastmap.uikit.EventController();
        $scope.laneDirectData = [
            {
                flag: 'd',
                log: '调'
            },
            {
                flag: 'l',
                log: '调左'
            },
            {
                flag: 'b',
                log: '左'
            },
            {
                flag: 'g',
                log: '直左'
            },
            {
                flag: 'a',
                log: '直'
            },
            {
                flag: 'f',
                log: '直右'
            },
            {
                flag: 'c',
                log: '右'
            },
            {
                flag: 'e',
                log: '直调'
            },
            {
                flag: 'i',
                log: '调直右'
            },
            {
                flag: 'j',
                log: '调左直'
            },
            {
                flag: 'k',
                log: '左右'
            },
            {
                flag: 'h',
                log: '左直右'
            },
            {
                flag: 'm',
                log: '调左右'
            },
            {
                flag: 'o',
                log: '空'
            },
            {
                flag: '',
                log: 'null'
            }
        ];
        var initialize = function (event, data) {
            $scope.lanes = data ? data.directData || [] : [];
            $scope.currentLaneIndex = -1;
        };
        $scope.changeDirectType = 0;
        $scope.onChangeDirect = function (index, flag) {
            $scope.changeDirectType = flag;
            $scope.currentLaneIndex = index;
            if (flag === 1) {
                $scope.lanes[index].busDirect = $scope.lanes[index].direct;
            }
        };
        $scope.addLaneConnexity = function (data) {
            var lane = {
                direct: data.flag, // 车道方向
                extend: false, // 附加标识
                busDirect: '' // 默认非公交车道
            };
            if ($scope.lanes.length < 16) { // 最多创建16车道
                $scope.lanes.push(lane);
            }
            $scope.objChange();
        };
        $scope.changeLaneDirect = function (data) {
            var currentLane = $scope.lanes[$scope.currentLaneIndex];
            if ($scope.changeDirectType === 0) {
                currentLane.direct = data.flag;
            } else {
                currentLane.busDirect = data.flag;
            }
            $scope.objChange();
        };
        $scope.deleteDirect = function (index) {
            $scope.lanes.splice(index, 1);
            $scope.objChange();
        };
        $scope.objChange = function () {
            eventCtrl.fire(eventCtrl.eventTypes.PARTSSELECTEDCHANGED, {
                directData: $scope.lanes
            });
        };
        hotkeys.bindTo($scope).add({
            combo: 'space',
            callback: function () {
                eventCtrl.fire(eventCtrl.eventTypes.TIPLANECONNEXITYSPACE);
            }
        });
        var unbindHandler = $scope.$on('ReloadData', initialize);

        $scope.$on('$destroy', function () {
            unbindHandler = null;
            eventCtrl.off(eventCtrl.eventTypes.PARTSSELECTEDCHANGED);
            eventCtrl.off(eventCtrl.eventTypes.TIPLANECONNEXITYSPACE);
        });
    }
]);
