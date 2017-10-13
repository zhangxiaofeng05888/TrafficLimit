/**
 * Created by liuyang on 2016/8/5.
 */
angular.module('app').controller('addAssociateFaceCtrl', ['$scope', '$ocLazyLoad', 'dsEdit', 'appPath', 'ngDialog', '$modal',
    function ($scope, $ocLazyLoad, dsEdit, appPath, ngDialog, $modal) {
        var layerCtrl = fastmap.uikit.LayerController();
        var shapeCtrl = fastmap.uikit.ShapeEditorController();
        var tooltipsCtrl = fastmap.uikit.ToolTipsController();
        var eventController = fastmap.uikit.EventController();
        var adAdmin = layerCtrl.getLayerById('adAdmin');
        var adFace = layerCtrl.getLayerById('adFace');
        var zoneFace = layerCtrl.getLayerById('zoneFace');

        function computeCount(data, compareData) {
            var count = 0;
            for (var j = 0; j < data.length; j++) {
                if (data[j].pid === compareData) {
                    count++;
                }
            }
            return count;
        }
        /**
         * 添加geometry
         * @param type
         * @param num
         * @param event
         */
        $scope.adAdminToFace = function (event, type) {
            // 大于17级才可以选择地图上各种geometry
            if (map.getZoom() < 17) {
                swal('提示', '地图缩放等级必须大于16级才可操作', 'info');
                return;
            }
            // 开始启动工具
            $scope.$emit('Map-EnableTool', null);

            if (type === 'pointToFace') {
                shapeCtrl.setEditingType('adAdminToFace');
                tooltipsCtrl.setCurrentTooltip('请框选行政区划代表点!');
                map.currentTool = new fastmap.uikit.SelectForRectang({
                    map: map,
                    shapeEditor: shapeCtrl,
                    LayersList: [adAdmin, adFace, zoneFace]
                });
                map.currentTool.enable();
                var myOtherModal;

                eventController.off(eventController.eventTypes.GETRECTDATA);
                eventController.on(eventController.eventTypes.GETRECTDATA, function (events) {
                    var pointAndFacedata = { adFacePid: [], zoneFacePid: [], adAdminPid: [] };
                    for (var i = 0; i < events.data.length; i++) {
                        switch (events.data[i].data.properties.geoLiveType) {
                            case 'ADADMIN':
                                if (!computeCount(pointAndFacedata.adAdminPid, events.data[i].data.properties.id)) {
                                    pointAndFacedata.adAdminPid.push({
                                        pid: events.data[i].data.properties.id,
                                        kind: events.data[i].data.properties.kind,
                                        geoLiveType: events.data[i].data.properties.geoLiveType
                                    });
                                }
                                break;
                            case 'ADFACE':
                                if (!computeCount(pointAndFacedata.adFacePid, events.data[i].data.properties.id)) {
                                    pointAndFacedata.adFacePid.push({
                                        pid: events.data[i].data.properties.id,
                                        regionId: events.data[i].data.properties.regionId,
                                        geoLiveType: events.data[i].data.properties.geoLiveType
                                    });
                                }
                                break;
                            default:
                                if (!computeCount(pointAndFacedata.zoneFacePid, events.data[i].data.properties.id)) {
                                    pointAndFacedata.zoneFacePid.push({
                                        pid: events.data[i].data.properties.id,
                                        regionId: events.data[i].data.properties.regionId,
                                        geoLiveType: events.data[i].data.properties.geoLiveType
                                    });
                                }
                        }
                    }
                    // 将选中的数据塞进全局对象;
                    shapeCtrl.shapeEditorResult.setProperties(pointAndFacedata);
                    $ocLazyLoad.load(appPath.road + 'ctrls/attr_administratives_ctrl/adAdminToFaceController.js').then(function () {
                        if (myOtherModal) { myOtherModal.destroy(); }
                        myOtherModal = $modal({
                            scope: $scope,
                            backdrop: false,
                            controller: 'adAdminToFaceController', // 这是模态框的控制器,是用来控制模态框的
                            templateUrl: appPath.road + 'tpls/attr_adminstratives_tpl/adAdminToFaceTpl.html',
                            show: true
                        });
                    });
                });
            }

            // 选择工具启动
            if (map.currentTool.enabled()) {
                $scope.$emit('Map-ToolEnabled', {
                    event: event,
                    tool: map.currentTool,
                    operationType: 'ADD',
                    geoLiveType: type
                });
            }
        };
    }
]);
