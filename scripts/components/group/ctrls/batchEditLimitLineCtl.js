/**
 * Created by zhaohang on 2017/11/15.
 */
angular.module('app').controller('batchEditLimitLineCtrl', ['$window', '$scope', '$timeout', 'NgTableParams', 'dsFcc', 'appPath', '$ocLazyLoad',
    function ($window, $scope, $timeout, NgTableParams, dsFcc, appPath, $ocLazyLoad) {
        var eventCtrl = new fastmap.uikit.EventController();
        $scope.linkDir = 0;
        $scope.limit = [{
            id: 0,
            label: '未限制'
        }, {
            id: 1,
            label: '双方向限行'
        }, {
            id: 2,
            label: '顺方向限行'
        }, {
            id: 3,
            label: '逆方向限行'
        }];
        $scope.saveBatchEdit = function () {
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
                command: 'UPDATE',
                dbId: App.Temp.dbId,
                limitDir: $scope.linkDir,
                data: ids
            };
            dsFcc.batchDelete(param).then(function (data) {
                if (data !== -1) {
                    $scope.$emit('Dialog-Closed', 'batchEditLimitLine');
                    eventCtrl.fire(eventCtrl.eventTypes.BATCHEDITLIMIT);
                    swal('提示', '编辑成功', 'success');
                }
            });
        };
        var initialize = function (event, data) {
            $scope.limitData = data.data;
        };

        var unbindHandler = $scope.$on('ReloadData-batchEditLimitLine', initialize);
        $scope.$on('$destroy', function (event, data) {

        });
    }
]);
