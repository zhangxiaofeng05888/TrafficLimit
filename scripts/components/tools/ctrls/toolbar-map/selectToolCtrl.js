 /**
  * Created by liwanchong on 2015/10/28.
  * Rebuild by chenx on 2016-07-05
  */
 angular.module('app').controller('selectToolCtrl', ['$scope', 'appPath',
     function ($scope, appPath) {
         var layerCtrl = fastmap.uikit.LayerController();
         var tooltipsCtrl = fastmap.uikit.ToolTipsController();
         var eventCtrl = fastmap.uikit.EventController();
         var shapeCtrl = fastmap.uikit.ShapeEditorController();
         var objCtrl = fastmap.uikit.ObjectEditController();

         /**
          * 根据选择的geomtry从后台返回的数据 打开不同的属性面板
          * @param data
          */
         var onSelect = function (data) {
             $scope.$emit('Map-ObjectSelected', {
                 feature: data.feature,
                 originalEvent: data.event.originalEvent
             });
             tooltipsCtrl.disable();
         };

         $scope.selectShape = function (event, type) {
             // 大于17级才可以选择地图上各种geometry
             if (map.getZoom() < 17) {
                 swal('提示', '地图缩放等级必须大于16级才可操作', 'info');
                 return;
             }

             // 开始启动工具
             $scope.$emit('Map-EnableTool', {
                 /*
                     add by chenx on 2017-3-1
                     用于区分工具类型
                     值域：select, edit
                     在mainMapCtrl中对不同的工具类型有不同特殊处理，如type='select'的工具不会清理临时加载的图层
                 */
                 type: 'select'
             });

             if (type === 'all') {
                 map.currentTool = new fastmap.uikit.SelectFeature({
                     map: map,
                     shapeEditor: shapeCtrl
                 });
                 map.currentTool.enable();
                 tooltipsCtrl.setCurrentTooltip('请选择要素！');
                 eventCtrl.on(eventCtrl.eventTypes.SELECTEDCHANGED, onSelect);
             }

             // 工具启动成功
             if (map.currentTool.enabled()) {
                 $scope.$emit('Map-ToolEnabled', {
                     event: event,
                     tool: map.currentTool,
                     operationType: 'EDIT'
                 });
             }
         };

         $scope.resetDeepInfo = function () {
             var geo = objCtrl.data.geometry;
             map.setView([geo.coordinates[1], geo.coordinates[0]], 17);
         };
     }
 ]);
