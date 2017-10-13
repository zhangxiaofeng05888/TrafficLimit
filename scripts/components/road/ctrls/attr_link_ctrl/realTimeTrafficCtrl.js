/**
 * Created by linglong on 2015/10/29.
 */
angular.module('app').controller('realTimeTrafficController', function ($scope, dsMeta, dsEdit) {
    var eventController = fastmap.uikit.EventController();

    $scope.rankoption = {
        0: '无',
        1: '高速',
        2: '城市高速',
        3: '干线道路',
        4: '其他道路'
    };
    $scope.rticDroption = {
        0: '无',
        1: '顺方向',
        2: '逆方向'
    };

    // 数据初始化;
    $scope.currentInternetData = null;
    $scope.currentCarFactoryData = null;
    $scope.currentInternetIndex = undefined;
    $scope.currentCarFactoryIndex = undefined;


    // 选中行进行互联网编辑时更新当前数据
    $scope.getCurrentInternetData = function ($index, data) {
        $scope.currentInternetIndex = $index;
        $scope.currentInternetData = data;
    };

    // 选中行进行车场编辑时更新当前数据
    $scope.getCurrentCarFactoryData = function ($index, data) {
        $scope.currentCarFactoryIndex = $index;
        $scope.currentCarFactoryData = data;
    };

    // 增加互联网信息数据;
    $scope.addInternetData = function () {
        if ($scope.linkData.kind > 8) {
            swal('', '等级小于8级的道路link，不能设置RTIC信息', '');
            return;
        }
        var rticDir = 1; // 1表示顺方向，2表示逆方向
        if ($scope.linkData.direct === 3) { // 道路线逆方向
            rticDir = 2;
        } else {   // 道路线双方向和顺方向都默认1
            rticDir = 1;
        }
        $scope.linkData.intRtics.push(fastmap.dataApi.rdLinkIntRtic({ linkPid: $scope.linkData.pid, rticDir: rticDir }));
    };

    // 增加卡车限制信息数据;
    $scope.addCarFactory = function () {
        for (var i = 0; i < $scope.linkData.forms.length; i++) {
            if ($scope.linkData.forms[i].formOfWay === 33 && !$scope.linkData.forms[i]._deleted) {
                swal('', 'RTIC表：环岛上不能有RTIC信息', '');
                return;
            }
        }
        for (var j = 0; j < $scope.linkData.forms.length; j++) {
            if ($scope.linkData.forms[j].formOfWay === 22 && !$scope.linkData.forms[j]._deleted) {
                swal('', 'RTIC表：公交专用道上不能有RTIC信息', '');
                return;
            }
        }
        for (var k = 0; k < $scope.linkData.forms.length; k++) {
            if ($scope.linkData.forms[k].formOfWay === 52 && !$scope.linkData.forms[k]._deleted) {
                swal('', 'RTIC表：区域内道路上不能有RTIC信息', '');
                return;
            }
        }
        if ($scope.linkData.specialTraffic) {
            swal('', '特殊交通上不能有RTIC信息', '');
            return;
        }
        $scope.linkData.rtics.push(fastmap.dataApi.rdLinkRtic({ linkPid: $scope.linkData.pid }));
    };

    // 删除普通限制信息数据;
    $scope.deleteInternetData = function ($index, data, event) {
        if (data.rowId) {
            $scope.linkData.intRtics = $scope.linkData.intRtics.filter(function (item) {
                return item.rowId != data.rowId;
            });
        } else {
            $scope.linkData.intRtics.splice($index, 1);
        }
        event.stopPropagation();
    };

    // 删除卡车限制信息数据;
    $scope.deleteCarFactoryData = function ($index, data, event) {
        if (data.rowId) {
            $scope.linkData.rtics = $scope.linkData.rtics.filter(function (item) {
                return item.rowId != data.rowId;
            });
        } else {
            $scope.linkData.rtics.splice($index, 1);
        }
        event.stopPropagation();
    };

    var unInstallIntRticsLength = $scope.$watch('linkData.intRtics', function (newValue) {
        $scope.initRticLength = 0;
        for (var i = 0; i < newValue.length; i++) {
            if (!newValue[i]._deleted) {
                $scope.initRticLength++;
            }
        }
    }, true);

    var unInstallRtrticLength = $scope.$watch('linkData.rtics', function (newValue) {
        $scope.rticsLength = 0;
        for (var i = 0; i < newValue.length; i++) {
            if (!newValue[i]._deleted) {
                $scope.rticsLength++;
            }
        }
    }, true);

    var initialize = function () {
        eventController.fire(eventController.eventTypes.CHANGESCENE, {
            data: '互联网RTIC场景'
        });
        eventController.fire(eventController.eventTypes.CHANGESCENE, {
            data: '车厂RTIC场景'
        });
    };

    initialize();

    $scope.$on('$destroy', function () {
        unInstallIntRticsLength();
        unInstallRtrticLength();
        eventController.fire(eventController.eventTypes.CHANGESCENE, {
            data: '常规场景'
        });
    });
});
