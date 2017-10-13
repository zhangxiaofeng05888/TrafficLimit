/**
 * Created by zhaohang on 2016/11/29.
 */
angular.module('app').controller('BatchRightEditPanelCtrl', ['$scope', '$rootScope', 'dsLazyload', 'appPath', 'dsEdit',
    function ($scope, $rootScope, dsLazyload, appPath, dsEdit) {
        var eventCtrl = fastmap.uikit.EventController();
        var initialize = function (event, data) {
            if ($rootScope.CurrentObject) {
                var geoLiveType = $rootScope.CurrentObject.geoLiveType;
                $scope.objectName = FM.uikit.Config.getName(geoLiveType);
                var attrTmpl = FM.uikit.Config.getEditTemplate(geoLiveType);
                if (attrTmpl) {
                    dsLazyload.loadInclude($scope, 'batchEditTmpl', appPath.scripts + attrTmpl.ctrl, appPath.scripts + attrTmpl.tmpl).then(function () {
                        $scope.$broadcast('ReloadData', {
                            data: $rootScope.CurrentObject
                        });
                    });
                }
                eventCtrl.fire('deleteRoadBatchToToolPanel', {
                    context: $scope,
                    panelType: 'batchPanel'
                });
            }
        };

        $scope.doSave = function () {
            var objectEditCtrl = FM.uikit.ObjectEditController();
            var changes = objectEditCtrl.data.getChanges(true);

            if (changes) {
                var changedProperty;

                if (objectEditCtrl.data.geoLiveType === 'RDLINK') {
                    changedProperty = objectEditCtrl.restoreDatas(changes);
                } else if (objectEditCtrl.data.geoLiveType === 'RDNODE') {
                    changedProperty = objectEditCtrl.restoreNodeDatas(changes);
                }

                var param = {
                    command: 'BATCH',
                    type: $rootScope.GeoLiveType,
                    dbId: App.Temp.dbId,
                    data: changedProperty
                };

                dsEdit.save(param).then(function (rest) {
                    if (rest) {
                        $scope.$emit('BatchUpdated', {
                            features: objectEditCtrl.datas,
                            updateLogs: rest.log
                        });
                    }
                });
            }
        };

        $scope.doDelete = function () {
            var objectEditCtrl = FM.uikit.ObjectEditController();
            var geoLiveType = objectEditCtrl.data.geoLiveType;
            var pids = objectEditCtrl.datas.map(function (item) {
                return item.pid;
            });
            var simpleFeature = new FM.dataApi.Feature({
                pid: pids,
                geoLiveType: objectEditCtrl.data.geoLiveType
            });

            swal({
                title: '确定删除？',
                type: 'warning',
                showCancelButton: true,
                closeOnConfirm: true,
                confirmButtonText: '我要删除',
                confirmButtonColor: '#ec6c62'
            }, function (f) {
                if (f) {
                    var infect = 0;
                    if (['RDLINK', 'RDNODE'].indexOf(geoLiveType) > -1) {
                        infect = 1;
                    }
                    dsEdit.BatchDelete(pids, geoLiveType, infect)
                        .then(function (rest) {
                            $scope.$emit('ObjectDeleted', {
                                feature: simpleFeature,
                                updateLogs: rest.log
                            });
                        });
                }
            });
        };

        $scope.$on('BatchRightEditPanelReload', initialize);
    }
]);
