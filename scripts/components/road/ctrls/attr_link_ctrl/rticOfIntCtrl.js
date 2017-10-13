/**
 * Created by linglong on 2016/12/29.
 */
angular.module('app').controller('rticOfInternetController', ['$scope', 'dsEdit', function ($scope, dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var layerCtrl = fastmap.uikit.LayerController();
    var eventController = fastmap.uikit.EventController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var editLayer = layerCtrl.getLayerById('edit');
    $scope.rticDroption = [
        { id: 0, label: '无' },
        { id: 1, label: '顺方向' },
        { id: 2, label: '逆方向' }
    ];
    $scope.rankoption = [
        { id: 0, label: '无' },
        { id: 1, label: '高速' },
        { id: 2, label: '城市高速' },
        { id: 3, label: '干线道路' },
        { id: 4, label: '其他道路' }
    ];

    $scope.changeArrowDirectInt = function (event) {
        $scope.currentInternetData.rticDir = parseInt(event.geometry.orientation, 10);
        tooltipsCtrl.setChangeInnerHtml('点击 保存,或者按ESC键取消!');
        $scope.$apply();
    };

    $scope.angleOfLink = function (pointA, pointB) {
        var PI = Math.PI;
        var angle;
        if ((pointA.x - pointB.x) === 0) {
            angle = PI / 2;
        } else {
            angle = Math.atan((pointA.y - pointB.y) / (pointA.x - pointB.x));
        }
        return angle;
    };

    // 切换等级的逻辑控制;
    $scope.changeRank = function (data) {
        if (data == 0) {
            swal('', 'RTIC等级不能为无，请选择RTIC等级', '');
            $scope.currentInternetData.rank = 0;
        }
        if (data == 1 && objCtrl.originalData.kind != 1) {
            swal('', 'RTIC等级为高速的link必须是高速种别', '');
            $scope.currentInternetData.rank = 0;
        }
        if (data == 2 && objCtrl.originalData.kind != 2) {
            swal('', 'RTIC等级为高速的link必须是城高种别', '');
            $scope.currentInternetData.rank = 0;
        }
    };

    // 修改updownFlag 类型问题
    $scope.checkUpdownFlag = function (index) {
        $scope.currentInternetData.updownFlag = parseInt(index, 10);
    };
}]);
