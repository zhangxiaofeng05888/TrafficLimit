/**
 * Created by linglong on 2016/12/22.
 */
angular.module('app').controller('restrictInfoController', function ($scope) {
    var layerCtrl = fastmap.uikit.LayerController();
    // 供用信息
    $scope.appInfoOptions = [
        {
            id: 0,
            label: '调查中'
        },
        {
            id: 1,
            label: '可以通行'
        },
        {
            id: 2,
            label: '不可通行'
        },
        {
            id: 3,
            label: '未供用'
        },
        {
            id: 5,
            label: '计划'
        }
    ];
    // 限制类型;
    $scope.typeOptions = {
        0: '道路维修中',
        1: '单行限制',
        2: '车辆限制',
        3: '穿行限制',
        4: '施工中不开放',
        5: '季节性关闭道路',
        6: 'Usage Fee Required',
        7: '超车限制',
        8: '外地车限行',
        9: '尾号限行',
        10: '在建'
    };
    // 限制方向
    $scope.limitDirOptions = {
        0: '未调查',
        1: '双方向',
        2: '顺方向',
        3: '逆方向',
        9: '不应用'
    };

    // 数据初始化;
    $scope.currentActiveOrdinaryLimits = null;
    $scope.currentActiveTrucksLimits = null;
    $scope.currentOrdinaryIndex = undefined;
    $scope.currentActiveOrdinaryLimits = undefined;


    // 选中行进行普通限制信息编辑时更新当前数据
    $scope.getCurrentEditOrdinaryData = function ($index, data) {
        $scope.currentOrdinaryIndex = $index;
        $scope.currentActiveOrdinaryLimits = data;
    };

    // 选中行进行卡车限制信息编辑时更新当前数据
    $scope.getCurrentEditTruckData = function ($index, data) {
        $scope.currentTruckIndex = $index;
        $scope.currentActiveTrucksLimits = data;
    };

    // 增加普通限制信息数据;
    $scope.addNormalLimitInfo = function () {
        $scope.linkData.limits.push(FM.dataApi.rdLinkLimit({ linkPid: $scope.linkData.pid, type: 3, processFlag: 2 })); // 有需求指出processFlag默认值是2和模型稍有区别
    };

    // 增加卡车限制信息数据;
    $scope.addTruckLimitInfo = function () {
        $scope.linkData.limitTrucks.push(FM.dataApi.rdLinkTruckLimit({ linkPid: $scope.linkData.pid, limitDir: 0 }));
    };

    // 删除普通限制信息数据;
    $scope.deleteNormalLimitInfo = function ($index, data, event) {
        if (data.rowId) {
            $scope.linkData.limits = $scope.linkData.limits.filter(function (item) {
                return item.rowId != data.rowId;
            });
        } else {
            $scope.linkData.limits.splice($index, 1);
        }
        event.stopPropagation();
    };

    // 删除卡车限制信息数据;
    $scope.deleteTruckLimitInfo = function ($index, data, event) {
        if (data.rowId) {
            $scope.linkData.limitTrucks = $scope.linkData.limitTrucks.filter(function (item) {
                return item.rowId != data.rowId;
            });
        } else {
            $scope.linkData.limitTrucks.splice($index, 1);
        }
        event.stopPropagation();
    };
});
