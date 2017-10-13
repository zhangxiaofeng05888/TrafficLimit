/**
 * Created by linglong on 2016/8/12.
 */
angular.module('app').controller('linkBorderCtrl', ['$scope', function ($scope) {
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var RdWorkPoint = layerCtrl.getLayerById('workPoint'); // 为了重绘接边数据;

    $scope.joinBorder = shapeCtrl.shapeEditorResult.getProperties();

    eventController.on('locationChange1', function (data) {
        $scope.$apply(function () {
            $scope.joinBorder.location = data.loc;
            $scope.joinBorder.memo = '';
        });
    });
    eventController.on('locationChange2', function (data) {
        $scope.joinBorder.location = data.loc;
        $scope.joinBorder.memo = '';
    });

    $scope.setMemo = function () {
        shapeCtrl.shapeEditorResult.getProperties().memo = $scope.joinBorder.memo;
    };

    $scope.$on('$destroy', function () {
        eventController.off('locationChange1');
        eventController.off('locationChange2');
    });
}]);
