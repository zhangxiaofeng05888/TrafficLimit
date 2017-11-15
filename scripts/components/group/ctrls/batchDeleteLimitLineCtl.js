/**
 * Created by zhaohang on 2017/11/15.
 */
angular.module('app').controller('batchDeleteLimitLineCtrl', ['$window', '$scope', '$timeout', 'NgTableParams', 'dsFcc', 'appPath', '$ocLazyLoad',
    function ($window, $scope, $timeout, NgTableParams, dsFcc, appPath, $ocLazyLoad) {
        var eventCtrl = new fastmap.uikit.EventController();
        var initialize = function (event, data) {
            $scope.limitData = data.data;
        };

        $scope.batchDelete = function () {
            var ids = [];
            var limitData = $scope.limitData;
            for (var i = 0; i < limitData.length; i++) {
                ids.push({
                    geometryId: limitData[i].properties.geometryId,
                    linkPid: limitData[i].properties.id
                });
            }
            var param = {
                type: 'SCPLATERESRDLINK',
                command: 'DELETE',
                dbId: App.Temp.dbId,
                limitDir: $scope.linkDir,
                data: ids
            };
            dsFcc.batchDelete(param).then(function (data) {
                if (data !== -1) {
                    $scope.$emit('Dialog-Closed', 'batchDeleteLimitLine');
                    eventCtrl.fire(eventCtrl.eventTypes.BATCHDELETELIMIT);
                    swal('提示', '删除成功', 'success');
                }
            });
        };
        var unbindHandler = $scope.$on('ReloadData-batchDeleteLimitLine', initialize);
        $scope.$on('$destroy', function (event, data) {

        });
    }
]);
