/**
 * Created by zhaohang on 2017/4/25.
 */
var addDirectOfRest = angular.module('app');
addDirectOfRest.controller('normalRestrictionCtrl', function ($scope, $timeout) {
    var eventController = fastmap.uikit.EventController();
    var objCtrl = fastmap.uikit.ObjectEditController();

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
    var initialize = function () {
        $scope.selectedArray = [];
        $scope.nomalRestriction = objCtrl.data;
        for (var m = 0; m < $scope.nomalRestriction.deep.info.length; m++) {
            $scope.selectedArray.push({
                type: $scope.nomalRestriction.deep.info[m].flag,
                direct: $scope.nomalRestriction.deep.info[m].info
            });
        }
        if ($scope.nomalRestriction.feedback.f_array && $scope.nomalRestriction.feedback.f_array.length > 0) {
            for (var i = 0; i < $scope.nomalRestriction.feedback.f_array.length; i++) {
                if ($scope.nomalRestriction.feedback.f_array[i].type == 3) {
                    $scope.nomalRestriction.content = $scope.nomalRestriction.feedback.f_array[i].content;
                }
            }
        }
    };
    $scope.objChange = function () {
        var directData = [];
        var outArray = [];
        for (var i = 0; i < $scope.selectedArray.length; i++) {
            directData.push({
                sq: i + 1,
                flag: $scope.selectedArray[i].type,
                info: $scope.selectedArray[i].direct
            });
            outArray.push({
                sq: i + 1,
                oInfo: $scope.selectedArray[i].direct,
                out: [],
                flag: $scope.selectedArray[i].type,
                time: ''
            });
        }
        $scope.nomalRestriction.deep.info = directData;
        $scope.nomalRestriction.deep.o_array = outArray;
    };
    $scope.$on('ReloadData', initialize);
});
