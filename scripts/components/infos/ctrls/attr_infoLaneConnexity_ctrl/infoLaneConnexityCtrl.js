/**
 * Created by Chensonglin on 17.3.30.
 */
angular.module('app').controller('laneConnexityCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = fastmap.uikit.SelectController();
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
    $scope.initializeData = function () {
        $scope.laneConnexity = objCtrl.data;
        $scope.lanes = [];
        for (var m = 0; m < $scope.laneConnexity.deep.info.length; m++) {
            $scope.lanes.push({
                direct: $scope.laneConnexity.deep.info[m].arwG, // 车道方向
                extend: $scope.laneConnexity.deep.info[m].ext === 1, // 附加标识
                busDirect: $scope.laneConnexity.deep.info[m].arwB // 默认非公交车道
            });
        }
        if ($scope.laneConnexity.feedback.f_array && $scope.laneConnexity.feedback.f_array.length > 0) {
            for (var i = 0; i < $scope.laneConnexity.feedback.f_array.length; i++) {
                if ($scope.laneConnexity.feedback.f_array[i].type == 3) {
                    $scope.laneConnexity.content = $scope.laneConnexity.feedback.f_array[i].content;
                }
            }
        }
    };
    $scope.changeDirectType = 0;
    $scope.onChangeDirect = function (index, flag) {
        $scope.changeDirectType = flag;
        $scope.currentLaneIndex = index;
        if (flag === 1) {
            $scope.lanes[index].busDirect = $scope.lanes[index].direct;
        }
        $scope.objChange();
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
        var a = $scope.laneConnexity;
        var directData = [];
        var outArray = [];
        for (var i = 0; i < $scope.lanes.length; i++) {
            directData.push({
                sq: i + 1,
                ext: $scope.lanes[i].extend ? 1 : 0,
                arwG: $scope.lanes[i].direct,
                arwB: $scope.lanes[i].busDirect
            });
            outArray.push({
                sq: i + 1,
                ext: $scope.lanes[i].extend ? 1 : 0,
                d_array: []
            });
        }
        $scope.laneConnexity.deep.info = directData;
        $scope.laneConnexity.deep.o_array = outArray;
    };
    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
