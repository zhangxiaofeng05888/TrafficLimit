/**
 * Created by zhaohang on 2017/4/25.
 */
angular.module('app').controller('TipRestrictionTopoEditCtrl', ['$scope', 'hotkeys',
    function ($scope, hotkeys) {
        var eventController = fastmap.uikit.EventController();

        $scope.selectedItemIndex = -1;
        $scope.selectedArray = [];

        // 添加
        $scope.addRestriction = function (item, event) {
            for (var i = 0; i < $scope.selectedArray.length; i++) {
                if ($scope.selectedArray[i].direct === item.direct) {
                    return;
                }
            }
            $scope.selectedArray.push(item);
            $scope.objChange();
        };

        // 删除指令
        $scope.deleteRestriction = function (index, event) {
            $scope.selectedArray.splice(index, 1);
            $scope.objChange();
        };

        $scope.restrictionData = [
            {
                type: 1,
                direct: 0
            },
            {
                type: 1,
                direct: 1
            },
            {
                type: 1,
                direct: 2
            },
            {
                type: 1,
                direct: 3
            },
            {
                type: 1,
                direct: 4
            },
            {
                type: 1,
                direct: 5
            },
            {
                type: 1,
                direct: 6
            },
            {
                type: 1,
                direct: 7
            },
            {
                type: 1,
                direct: 8
            },
            {
                type: 2,
                direct: 0
            },
            {
                type: 2,
                direct: 1
            },
            {
                type: 2,
                direct: 2
            },
            {
                type: 2,
                direct: 3
            },
            {
                type: 2,
                direct: 4
            },
            {
                type: 2,
                direct: 5
            },
            {
                type: 2,
                direct: 6
            },
            {
                type: 2,
                direct: 7
            },
            {
                type: 2,
                direct: 8
            }
        ];
        var initialize = function (event, data) {
            $scope.selectedArray = data ? data.directData || [] : [];
            $scope.selectedItemIndex = -1;
        };
        $scope.objChange = function () {
            eventController.fire(eventController.eventTypes.PARTSSELECTEDCHANGED, {
                directData: $scope.selectedArray
            });
        };
        hotkeys.bindTo($scope).add({
            combo: 'space',
            callback: function () {
                eventController.fire(eventController.eventTypes.TIPNORMALRESTRICTIONSPACE);
            }
        });
        var unbindHandler = $scope.$on('ReloadData', initialize);

        $scope.$on('$destroy', function () {
            unbindHandler = null;
            eventController.off(eventController.eventTypes.TIPNORMALRESTRICTIONSPACE);
            eventController.off(eventController.eventTypes.PARTSSELECTEDCHANGED);
        });
    }
]);
