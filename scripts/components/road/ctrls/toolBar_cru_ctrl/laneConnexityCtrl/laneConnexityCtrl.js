/**
 * Created by liwanchong on 2016/1/25.
 */
angular.module('app').controller('LaneConnexityTopoEditCtrl', ['$scope', 'hotkeys',
    function ($scope, hotkeys) {
        var eventCtrl = fastmap.uikit.EventController();

        $scope.laneDirectData = [{
            flag: 'd',
            log: '调'
        }, {
            flag: 'l',
            log: '调左'
        }, {
            flag: 'b',
            log: '左'
        }, {
            flag: 'g',
            log: '直左'
        }, {
            flag: 'a',
            log: '直'
        }, {
            flag: 'f',
            log: '直右'
        }, {
            flag: 'c',
            log: '右'
        }, {
            flag: 'e',
            log: '直调'
        }, {
            flag: 'i',
            log: '调直右'
        }, {
            flag: 'j',
            log: '调左直'
        }, {
            flag: 'k',
            log: '左右'
        }, {
            flag: 'h',
            log: '左直右'
        }, {
            flag: 'm',
            log: '调左右'
        }, {
            flag: 'o',
            log: '空'
        }];

        $scope.addLane = function (item) {
            if ($scope.lanes.length === 16) {
                swal('最多添加16个车道', null, 'info');
                return;
            }

            var lane = {
                direct: item.flag, // 车道方向
                extend: 0, // 附加标识
                busDirect: null // 默认非公交车道
            };
            $scope.lanes.push(lane);
            eventCtrl.fire('laneConnexity-addLane', {
                lane: lane
            });
            $scope.selectLane($scope.lanes.length - 1);
        };

        $scope.selectLane = function (index, event) {
            if ($scope.currentLaneIndex !== index) {
                $scope.currentLaneIndex = index;
                eventCtrl.fire('laneConnexity-selectLane', {
                    index: $scope.currentLaneIndex
                });
            } else {
                if (event && event.target.tagName !== 'IMG') { // 如果不是修改箭头方向
                    $scope.currentLaneIndex = -1;
                    eventCtrl.fire('laneConnexity-selectLane', {
                        index: $scope.currentLaneIndex
                    });
                }
            }
        };

        $scope.deleteLane = function (index, event) {
            $scope.lanes.splice(index, 1);
            if (index == $scope.currentLaneIndex) {
                $scope.currentLaneIndex = -1;
            }
            eventCtrl.fire('laneConnexity-deleteLane', {
                index: index
            });

            event.stopPropagation();
        };

        $scope.changeDirectType = 1;
        $scope.onChangeDirect = function (index, flag) {
            $scope.changeDirectType = flag;
        };

        $scope.changeDirect = function (item) {
            var currentLane = $scope.lanes[$scope.currentLaneIndex];
            if ($scope.changeDirectType == 1) {
                currentLane.direct = item.flag;
            } else {
                currentLane.busDirect = item.flag;
            }
            eventCtrl.fire('laneConnexity-changeLaneDirect', {
                index: $scope.currentLaneIndex,
                direct: item.flag,
                busFlag: $scope.changeDirectType == 2
            });
        };

        // 处理拖动车道改变序号的需求
        var dragStart = -1;
        $scope.onDragStart = function (index) {
            dragStart = index;
        };

        $scope.onDrop = function (index) {
            var dragEnd = index >= $scope.lanes.length ? ($scope.lanes.length - 1) : index;
            if (dragStart === dragEnd) {
                return;
            }

            var temp = $scope.lanes.splice(dragStart, 1);
            $scope.lanes.splice(dragEnd, 0, temp[0]);

            eventCtrl.fire('laneConnexity-swapLane', {
                srcIndex: dragStart,
                destDirect: dragEnd
            });

            $scope.selectLane(dragEnd);
        };

        // 按shift
        var toggleBusLane = function () {
            if ($scope.currentLaneIndex >= 0) {
                var currentLane = $scope.lanes[$scope.currentLaneIndex];
                if (currentLane.busDirect) {
                    currentLane.busDirect = null;
                } else {
                    currentLane.busDirect = currentLane.direct;
                }

                eventCtrl.fire('laneConnexity-toggleBusLane', {
                    index: $scope.currentLaneIndex
                });
            }
        };

        // 按ctrl
        var toggleExtendLane = function () {
            if ($scope.currentLaneIndex >= 0) {
                var currentLane = $scope.lanes[$scope.currentLaneIndex];
                currentLane.extend = 1 - currentLane.extend;

                eventCtrl.fire('laneConnexity-toggleExtendLane', {
                    index: $scope.currentLaneIndex
                });
            }
        };

        hotkeys.bindTo($scope).add({
            combo: 'r',
            description: '公交车道',
            callback: function () {
                // 临时方案，解决bug4049
                if ($('.sweet-alert:visible').length > 0) {
                    return;
                }
                toggleBusLane();
            }
        }).add({
            combo: 'e',
            description: '附加车道',
            callback: function () {
                if ($('.sweet-alert:visible').length > 0) {
                    return;
                }
                toggleExtendLane();
            }
        });

        var initialize = function (event, data) {
            $scope.lanes = data.lanes || [];
        };

        $scope.$on('ReloadData', initialize);
    }
]);
