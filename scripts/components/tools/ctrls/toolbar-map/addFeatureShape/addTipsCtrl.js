/**
 * Created by linglong on 2016/11/30.
 */
angular.module('app').controller('addTipsCtrl', ['$scope', function ($scope) {
    var layerCtrl = fastmap.uikit.LayerController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var selectCtrl = fastmap.uikit.SelectController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var eventController = fastmap.uikit.EventController();
    var objCtrl = fastmap.uikit.ObjectEditController();


    $scope.addTips = function (event) {
        // 大于17级才可以选择地图上各种geometry
        if (map.getZoom() < 17) {
            swal('提示', '地图缩放等级必须大于16级才可操作', 'info');
            return;
        }
        // 开始启动工具
        $scope.$emit('Map-EnableTool', null);
        if (shapeCtrl.shapeEditorResult) {
            shapeCtrl.shapeEditorResult.setFinalGeometry(
                fastmap.mapApi.multiPolyline([fastmap.mapApi.lineString([fastmap.mapApi.point(0, 0)])])
            );
            shapeCtrl.shapeEditorResult.setProperties({
                location: [0, 0],
                memo: ''
            });
            eventController.fire('locationChange2', {
                loc: [0, 0]
            });
            selectCtrl.selectByGeometry(shapeCtrl.shapeEditorResult.getFinalGeometry());
            layerCtrl.pushLayerFront('edit');
        }
        shapeCtrl.setEditingType(fastmap.mapApi.ShapeOptionType.ADDBORDERTIPS);
        shapeCtrl.setEditFeatType('TIPBORDER');
        shapeCtrl.startEditing();
        map.currentTool = shapeCtrl.getCurrentTool();

        tooltipsCtrl.setEditEventType(fastmap.mapApi.ShapeOptionType.ADDBORDERTIPS);
        tooltipsCtrl.setCurrentTooltip('开始制作接边标识！');
        tooltipsCtrl.setChangeInnerHtml('按下鼠标移动进行绘制!');

        // 工具启动成功
        if (map.currentTool.enabled()) {
            $scope.$emit('Map-ToolEnabled', {
                event: event,
                tool: map.currentTool,
                operationType: 'ADD',
                geoLiveType: 'TIPBORDER'
            });
        }
    };
}]);
