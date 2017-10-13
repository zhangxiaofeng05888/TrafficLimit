/**
 * Created by liwanchong on 2016/2/29.
 */
var addDirectOfRest = angular.module('app');
addDirectOfRest.controller('RestrictionTopoEditCtrl', function ($scope, $timeout) {
    var eventController = fastmap.uikit.EventController();


    $scope.selectedItemIndex = -1;
    $scope.selectedArray = [];

    // 添加
    $scope.addRestriction = function (item, event) {
        var index = $scope.selectedArray.push(item);

        // 发送添加指令
        eventController.fire(eventController.eventTypes.PARTSADD, {
            key: item.direct,
            flag: item.type,
            index: $scope.selectedArray.length - 1
        });

        $scope.selectItem($scope.selectedArray.length - 1);
    };

    // 删除指令
    $scope.deleteRestriction = function (index, event) {
        $scope.selectedArray.splice(index, 1);
        if (this.selectedItemIndex >= index) {
            $scope.selectedItemIndex--;
        }

        // 发送删除指令
        eventController.fire(eventController.eventTypes.PARTSDEL, {
            index: index
        });

        event.stopPropagation();
    };

    // 选中
    $scope.selectItem = function (index, e) {
        if (index !== $scope.selectedItemIndex) {
            $scope.selectedItemIndex = index;

            // 发送选中指令
            eventController.fire(eventController.eventTypes.PARTSSELECTEDCHANGED, {
                index: $scope.selectedItemIndex
            });
        }
    };

    $scope.filterRestriction = function (item) {
        if ($scope.truckFlag) {
            if (item.type === 0) {
                return true;
            }
        } else {
            if (item.type > 0) {
                return true;
            }
        }

        return false;
    };

    $scope.restrictionData = [];
    var initialize = function (event, data) {
        $scope.selectedArray = data.items;
        $scope.selectedItemIndex = data.index;

        var direct = [1, 2, 3, 4];
        if ($scope.truckFlag !== data.truckFlag) {
            $scope.truckFlag = data.truckFlag;

            var arr;
            if ($scope.truckFlag) {
                arr = direct.map(function (item) {
                    return {
                        direct: item,
                        type: 0
                    };
                });
                Array.prototype.push.apply($scope.restrictionData, arr);
            } else {
                arr = direct.map(function (item) {
                    return {
                        direct: item,
                        type: 1
                    };
                });
                Array.prototype.push.apply($scope.restrictionData, arr);
                arr = direct.map(function (item) {
                    return {
                        direct: item,
                        type: 2
                    };
                });
                Array.prototype.push.apply($scope.restrictionData, arr);
            }
        }
    };

    $scope.$on('ReloadData', initialize);
});
