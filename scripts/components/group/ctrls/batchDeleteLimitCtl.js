/**
 * Created by zhaohang on 2017/11/1.
 */
angular.module('app').controller('batchDeleteLimitCtrl', ['$window', '$scope', '$timeout', 'NgTableParams', 'dsFcc', 'appPath', '$ocLazyLoad',
    function ($window, $scope, $timeout, NgTableParams, dsFcc, appPath, $ocLazyLoad) {
        var eventCtrl = new fastmap.uikit.EventController();
        var initialize = function (event, data) {
            $scope.limitData = data.data;
        };

        $scope.batchDelete = function () {
            var limitData = $scope.limitData;
            var ids = [];
            var type = '';
            var param = {
                command: 'DELETE'
            };
            for (var i = 0; i < limitData.length; i++) {
                ids.push(limitData[i].properties.id);
            }
            switch (limitData[0].properties.geoLiveType) {
                case 'COPYTOLINE':
                    type = 'SCPLATERESLINK';
                    param.objId = ids;
                    break;
                case 'COPYTOPOLYGON':
                case 'DRAWPOLYGON':
                    type = 'SCPLATERESFACE';
                    param.objId = ids;
                    break;
                case 'GEOMETRYLINE':
                case 'GEOMETRYPOLYGON':
                    type = 'SCPLATERESGEOMETRY';
                    param.objIds = ids;
                    break;
                default:
                    type = '';
            }
            param.type = type;
            dsFcc.batchDelete(param).then(function (data) {
                if (data !== -1) {
                    $scope.$emit('Dialog-Closed', 'batchDeleteLimit');
                    eventCtrl.fire(eventCtrl.eventTypes.BATCHDELETELIMIT);
                    swal('提示', '删除成功', 'success');
                }
            });
        };
        var unbindHandler = $scope.$on('ReloadData-batchDeleteLimit', initialize);
        $scope.$on('$destroy', function (event, data) {

        });
    }
]);
