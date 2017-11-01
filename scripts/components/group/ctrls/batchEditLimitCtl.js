/**
 * Created by zhaohang on 2017/10/31.
 */
/**
 * Created by zhaohang on 2017/10/11.
 */
angular.module('app').controller('batchEditLimitCtrl', ['$window', '$scope', '$timeout', 'NgTableParams', 'dsFcc', 'appPath', '$ocLazyLoad',
    function ($window, $scope, $timeout, NgTableParams, dsFcc, appPath, $ocLazyLoad) {
        var eventCtrl = new fastmap.uikit.EventController();
        $scope.boundaryLink = '1';
        $scope.limit = [{
            id: '1',
            label: '限行'
        }, {
            id: '2',
            label: '不限行'
        }];
        $scope.saveBatchEdit = function () {
            var ids = [];
            var limitData = $scope.limitData;
            for (var i = 0; i < limitData.length; i++) {
                ids.push(limitData[i].properties.id);
            }
            var param = {
                type: 'SCPLATERESGEOMETRY',
                command: 'UPDATE',
                objIds: ids,
                data: {
                    boundaryLink: $scope.boundaryLink,
                    objStatus: 'UPDATE'
                }
            };
            dsFcc.batchDelete(param).then(function (data) {
                if (data !== -1) {
                    $scope.$emit('Dialog-Closed', 'batchEditLimit');
                    eventCtrl.fire(eventCtrl.eventTypes.BATCHEDITLIMIT);
                    swal('提示', '编辑成功', 'success');
                }
            });
        };
        var initialize = function (event, data) {
            $scope.limitData = data.data;
        };

        var unbindHandler = $scope.$on('ReloadData-batchEditLimit', initialize);
        $scope.$on('$destroy', function (event, data) {

        });
    }
]);
