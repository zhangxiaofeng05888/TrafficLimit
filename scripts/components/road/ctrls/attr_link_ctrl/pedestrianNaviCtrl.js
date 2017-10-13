/**
 * Created by linglong on 2015/10/29.
 */
angular.module('app').controller('pedestrianNaviController', function ($scope) {
    // 隔离方式
    $scope.dividerTypeoptions = {
        0: '未调查',
        1: '高度差隔离(马路涯)',
        2: '物理栅栏隔离',
        3: '划线隔离',
        4: '无隔离'
    };
    // 位置关系
    $scope.sidewalkLocoptions = {
        0: '无',
        1: '右侧',
        2: '中间',
        3: '右侧+中间',
        4: '左侧',
        5: '右侧+左侧',
        6: '左侧+中间',
        7: '右侧+左侧+中间',
        8: '混合'
    };
    // 升降标识
    $scope.upAndDownFlag = {
        0: '未调查',
        1: '上坡',
        2: '下坡'
    };

    // 数据初始化;
    $scope.currentActiveSideWalk = null;
    $scope.currentActiveWalkStairs = null;
    $scope.currentSideWalkIndex = undefined;
    $scope.currentWalkStairsIndex = undefined;

    $scope.getCurrentEditSideWalkData = function ($index, data) {
        $scope.currentSideWalkIndex = $index;
        $scope.currentActiveSideWalk = data;
    };

    $scope.getCurrentEditWalkStairsData = function ($index, data) {
        $scope.currentWalkStairsIndex = $index;
        $scope.currentActiveWalkStairs = data;
    };


    // 增加行人便道信息;
    $scope.addSideWalkInfo = function () {
        $scope.linkData.sidewalks.push(FM.dataApi.rdLinkSideWalk({ linkPid: $scope.linkData.pid, dividerType: 0 }));
    };

    // 增加人行阶梯信息;
    $scope.addWalkStairs = function () {
        $scope.linkData.walkstairs.push(FM.dataApi.rdLinkWalkStair({ linkPid: $scope.linkData.pid, stairFlag: 0 }));
    };

    // 删除行人便道信息;
    $scope.deleteSideWalkInfo = function ($index, data, event) {
        if (data.rowId) {
            $scope.linkData.sidewalks = $scope.linkData.sidewalks.filter(function (item) {
                return item.rowId != data.rowId;
            });
        } else {
            $scope.linkData.sidewalks.splice($index, 1);
        }
        event.stopPropagation();
    };

    // 删除人行阶梯信息;
    $scope.deleteWalkStairs = function ($index, data, event) {
        if (data.rowId) {
            $scope.linkData.walkstairs = $scope.linkData.walkstairs.filter(function (item) {
                return item.rowId != data.rowId;
            });
        } else {
            $scope.linkData.walkstairs.splice($index, 1);
        }
        event.stopPropagation();
    };
});
