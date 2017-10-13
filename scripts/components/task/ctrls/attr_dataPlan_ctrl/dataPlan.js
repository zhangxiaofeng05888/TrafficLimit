/**
 * Created by zhaohang on 2017/7/6.
 */
angular.module('app').controller('dataPlanCtrl', ['$scope', function ($scope) {
    var eventController = new fastmap.uikit.EventController();
    var dataServiceFcc = fastmap.service.DataServiceFcc.getInstance();
    var sceneController = fastmap.mapApi.scene.SceneController.getInstance();
    var geometryAlgorithm = fastmap.mapApi.geometry.GeometryAlgorithm.getInstance();
    $scope.same = {};
    /**
     * 初始化方法
     */
    var initializeData = function (data) {
        $scope.workData = 1;
        $scope.planGeo = data;
    };
    /*
     * 创建同一点要素;
     * */
    $scope.saveDataPlan = function () {
        eventController.fire(L.Mixin.EventTypes.PARTSCLOSEPANEL, { panelName: 'dataPlanPanel' });
        var param = {
            taskId: App.Temp.taskId,
            isPlanStatus: parseInt($scope.workData, 10),
            dataType: App.Temp.dataType,
            condition: {
                wkt: geometryAlgorithm.geoJsonToWkt($scope.planGeo)
            }
        };
        dataServiceFcc.savePlanByTaskId(param).then(function (data) {
            var geoLiveTypes = sceneController.getLoadedFeatureTypes();
            sceneController.redrawLayerByGeoLiveTypes(geoLiveTypes);
            swal('提示', '规划成功！', 'success');
        }).catch(function (data) {
            swal('错误', data, 'error');
        });
    };

    var unbindHandler = $scope.$on('ReloadData-dataPlanPanel', function (event, data) {
        initializeData(data.data);
    });
    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
