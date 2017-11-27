/**
 * Created by zhaohang on 2017/10/19.
 */
/**
 * Created by zhaohang on 2017/1/4.
 */
angular.module('app').controller('geometryPolygonCtl', ['$scope', '$timeout', 'dsFcc', 'appPath', '$ocLazyLoad', function ($scope, $timeout, dsFcc, appPath, $ocLazyLoad) {
    var eventCtrl = fastmap.uikit.EventController();
    var selectCtrl = fastmap.uikit.SelectController();
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();

    $scope.limit = [{
        id: '1',
        label: '限行'
    }, {
        id: '2',
        label: '不限行'
    }];
    $scope.initializeData = function () {
        $scope.geometryLineDate = objCtrl.data;
        $scope.infoCode = 0;
        var params = {
            type: 'SCPLATERESINFO',
            condition: {
                groupId: $scope.geometryLineDate.groupId
            }
        };
        dsFcc.getInfoCode(params).then(function (data) {
            if (data.data && data.data.length !== 0 && data != -1) {
                $scope.infoCode = data.data[0].infoCode;
            }
        });
    };

    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
