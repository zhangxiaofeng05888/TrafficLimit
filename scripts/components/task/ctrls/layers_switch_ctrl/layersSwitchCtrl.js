/**
 * Created by liwanchong on 2017/5/10.
 */
angular.module('app').controller('LayersSwitchController', ['$scope',
    function ($scope) {
        var sceneCtrl = fastmap.mapApi.scene.SceneController.getInstance();
        var sourceCtrl = fastmap.mapApi.source.SourceController.getInstance();
        $scope.layers = sceneCtrl.getLayers();
        $scope.statusArr = [0, 1];
        $scope.statusObj = {
            1: 1,
            2: 2
        };
        $scope.geometryObj = {
            0: 0,
            1: 1
        };
        $scope.status = [
            {
                id: 1,
                label: '中线',
                visible: true
            },
            {
                id: 2,
                label: '无任务',
                visible: true
            }
        ];
        $scope.geometryType = [
            {
                id: 0,
                label: 'tips',
                visible: true
            },
            {
                id: 1,
                label: 'poi',
                visible: true
            }
        ];
        if (sessionStorage.status) {
            var status = JSON.parse(sessionStorage.status);
            $scope.statusObj = status;
            if (status['1']) {
                $scope.status[0].visible = true;
            } else {
                $scope.status[0].visible = false;
            }
            if (status['2']) {
                $scope.status[1].visible = true;
            } else {
                $scope.status[1].visible = false;
            }
        }
        if (sessionStorage.geometryObj) {
            var geometryObj = JSON.parse(sessionStorage.geometryObj);
            $scope.geometryObj = geometryObj;
            $scope.geometryType[0].visible = (geometryObj['0'] === 0);
            $scope.geometryType[1].visible = (geometryObj['1']);
        }
        $scope.getStatus = function (item) {
            item.visible = !item.visible;
            if (item.visible) {
                $scope.statusObj[item.id] = item.id;
            } else {
                delete $scope.statusObj[item.id];
            }
            $scope.statusArr = Object.keys($scope.statusObj);
            sessionStorage.setItem('status', JSON.stringify($scope.statusObj));
            if ($scope.statusArr.length === 0) {
                sourceCtrl.getSource('tipSource').setParameter('noQFilter', []);
                sourceCtrl.getSource('objSource').setParameter('noQFilter', []);
            } else {
                sourceCtrl.getSource('tipSource').setParameter('noQFilter', $scope.statusArr.map(function (obj) {
                    return parseInt(obj, 10);
                }));
                sourceCtrl.getSource('objSource').setParameter('noQFilter', $scope.statusArr.map(function (obj) {
                    return parseInt(obj, 10);
                }));
            }
            sceneCtrl.redrawLayerByGeoLiveTypes(sceneCtrl.getLoadedFeatureTypes());
            // sceneCtrl.refreshMap();
        };
        $scope.getGeometryType = function (item) {
            var layers = [];
            var layerIds;
            item.visible = !item.visible;
            if (item.visible) {
                $scope.geometryObj[item.id] = item.id;
                if (item.id === 0) {
                    layers.length = 0;
                    layers = $scope.layers.filter(function (obj) {
                        if (obj.label === 'tip') {
                            return true;
                        }
                        return false;
                    });
                    sceneCtrl.addToScene(layers);
                }
                if (item.id === 1) {
                    layers.length = 0;
                    layers = $scope.layers.filter(function (obj) {
                        if (obj.id === 'IxPoi') {
                            return true;
                        }
                        return false;
                    });
                    sceneCtrl.addToScene(layers);
                }
            } else {
                delete $scope.geometryObj[item.id];
                if (item.id === 0) {
                    layerIds = [];
                    for (var i = 0; i < $scope.layers.length; i++) {
                        if ($scope.layers[i].label === 'tip') {
                            layerIds.push($scope.layers[i].id);
                        }
                    }
                    sceneCtrl.removeFromScene(layerIds);
                }
                if (item.id === 1) {
                    sceneCtrl.removeFromScene(['IxPoi']);
                }
            }
            sessionStorage.setItem('geometryObj', JSON.stringify($scope.geometryObj));
        };
    }
]);
