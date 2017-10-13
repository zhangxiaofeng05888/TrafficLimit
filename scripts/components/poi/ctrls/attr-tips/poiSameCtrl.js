/**
 * Created by liuyang on 2016/8/30.
 */
angular.module('app').controller('SamePoiController', ['$scope', '$ocLazyLoad', 'appPath', 'dsEdit', '$timeout', 'ngDialog', function ($scope, $ocLazyLoad, appPath, dsEdit, $timeout, ngDialog) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventCtrl = new fastmap.uikit.EventController();
    var transform = new fastmap.mapApi.MecatorTranform();

    var kindFormat = $scope.metaData.kindFormat;

    $scope.same = {};
    /**
     * 初始化方法
     */
    $scope.initializeData = function (data) {
        $scope.same.sameNameList = [];
        for (var i = 0, len = data.length; i < len; i++) {
            if (data[i].properties.kindCode) {
                $scope.same.sameNameList.push({
                    id: data[i].properties.id,
                    name: data[i].properties.name,
                    kindName: kindFormat[data[i].properties.kindCode].kindName,
                    kindCode: data[i].properties.kindCode,
                    geo: data[i].geometry.coordinates
                });
            }
        }
    };

    $scope.minusSamePoi = function (num) {
        if ($scope.same.sameNameList.length > 1) {
            $scope.same.sameNameList.splice(num, 1);
        }
        // if ($scope.same.sameNameList.length == 1) {
        //     $scope.same.sameNameList.splice(num, 1);
        //     ngDialog.close();
        // } else {
        //     $scope.same.sameNameList.splice(num, 1);
        // }
    };

    /**
     * 保存
     */
    $scope.saveSame = function () {
        var ids = [];
        // var actualDistance; // 根据用户的建议，将距离的判断放置在了samePoiTool.js工具中
        if ($scope.same.sameNameList.length === 1) {
            // actualDistance = transform.distance($scope.same.sameNameList[0].geo[1], $scope.same.sameNameList[0].geo[0], objCtrl.data.geometry.coordinates[1], objCtrl.data.geometry.coordinates[0]);
            // if (actualDistance > 5) {
            //     swal('提示', '组成同一关系的POI距离不能大于5米', 'info');
            //     return;
            // }
            ids.push($scope.same.sameNameList[0].id);
            ids.push(objCtrl.data.pid);
        } else {
            swal('提示', '只能选择一个poi创建同一关系', 'info');
            return;
        }
        eventCtrl.fire(L.Mixin.EventTypes.PARTSSELECTEDCHANGED, { samePids: ids });
    };

    var unbindHandler = $scope.$on('ReloadData', function (event, obj) {
        $scope.initializeData(obj);
    });

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
