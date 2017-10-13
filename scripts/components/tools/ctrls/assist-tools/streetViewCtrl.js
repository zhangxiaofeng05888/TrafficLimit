/**
 * Created by wangtun on 2017/5/3.
 */
angular.module('app').controller('StreetViewCtrl', ['$scope', '$interval', 'dsEdit',
    function ($scope, $interval, dsEdit) {
        var container = document.getElementById('streetViewContainer');
        var pano = new qq.maps.Panorama(container);
        var eventController = fastmap.uikit.EventController();
        qq.maps.event.addDomListener(pano, 'position_changed', function () {
            var center = pano.getPosition();
            var pov = pano.getPov();
            $scope.$emit('LocateObject', {
                feature: {
                    geometry: {
                        type: 'Point',
                        coordinates: [center.lng, center.lat]
                    }
                }
            });

            eventController.fire(L.Mixin.EventTypes.STREETVIEWHEADINGCHANGED, { center: center, heading: pov.heading });
        });

        qq.maps.event.addDomListener(pano, 'pov_changed', function () {
            var center = pano.getPosition();
            var pov = pano.getPov();
            eventController.fire(L.Mixin.EventTypes.STREETVIEWHEADINGCHANGED, { center: center, heading: pov.heading });
        });

        /**
         * 初始化方法
         */
        $scope.onRefresh = function (event, data) {
            if (!data.data.result) {
                swal('该地点没有街景数据', data.errmsg, 'info');
                return;
            }
            var result = data.data.result;
            pano.setPano(result.svid);
            var x1 = result.latlng.lng;
            var y1 = result.latlng.lat;
            var x2 = data.data.event.latlng.lng;
            var y2 = data.data.event.latlng.lat;

            var alpha = Math.acos((y2 - y1) / Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
            if (x2 - x1 < 0) {
                alpha = Math.PI * 2 - alpha;
            }
            // 修改场景的俯仰角
            pano.setPov({ heading: (alpha / Math.PI) * 180, pitch: 0 });
        };


        var unbindHandler = $scope.$on('ReloadData', $scope.onRefresh);

        $scope.$on('$destroy', function () {
            unbindHandler = null;
        });
    }
]);
