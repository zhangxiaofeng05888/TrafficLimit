/**
 * Created by liuyang on 2016/12/9.
 */
angular.module('app').controller('paginationToolCtrl', ['$scope', 'appPath', '$ocLazyLoad', 'ngDialog', 'dsEdit',
    function ($scope, appPath, $ocLazyLoad, ngDialog, dsEdit) {
        var objectEditCtrl = new fastmap.uikit.ObjectEditController();
        var subTask = App.Util.getSessionStorage('SubTask');
        // if (subTask.monthTaskType) {
        //     $scope.paginationToolbarTpl = appPath.root + 'apps/webEditor/editor/components/toolbars/deepInfoPagingTmpl.htm';
        // } else {
        //     $scope.paginationToolbarTpl = appPath.root + 'apps/webEditor/editor/components/toolbars/mapPagingTmpl.htm';
        // }
        $scope.getPreDeep = function () {
            var poiPids = sessionStorage.getItem('deepPids').split(',');
            if (!(poiPids && poiPids.length > 0 && objectEditCtrl.data && objectEditCtrl.data.pid)) {
                return;
            }
            if (poiPids && objectEditCtrl.data.pid && poiPids.indexOf(objectEditCtrl.data.pid.toString()) > 0) {
                var feature = {
                    pid: parseInt(poiPids[poiPids.indexOf(objectEditCtrl.data.pid.toString()) - 1], 0),
                    geoLiveType: 'IXPOI'
                };
                $scope.$emit('ObjectSelected', {
                    feature: feature
                });
            } else if (poiPids && objectEditCtrl.data.pid && poiPids.indexOf(objectEditCtrl.data.pid.toString()) == 0) {
                swal('注意', '已经是第一条数据了！', 'info');
            } else {
                swal('注意', '没有找到上一条数据！', 'info');
            }
        };
        $scope.getNextDeep = function () {
            var poiPids = sessionStorage.getItem('deepPids').split(',');
            if (!(poiPids && poiPids.length > 0 && objectEditCtrl.data && objectEditCtrl.data.pid)) {
                return;
            }
            if (poiPids && objectEditCtrl.data.pid && poiPids.indexOf(objectEditCtrl.data.pid.toString()) > -1 && poiPids.indexOf(objectEditCtrl.data.pid.toString()) != (poiPids.length - 1)) {
                var feature = {
                    pid: parseInt(poiPids[poiPids.indexOf(objectEditCtrl.data.pid.toString()) + 1], 0),
                    geoLiveType: 'IXPOI'
                };
                $scope.$emit('ObjectSelected', {
                    feature: feature
                });
            } else if (poiPids && objectEditCtrl.data.pid && poiPids.indexOf(objectEditCtrl.data.pid.toString()) == (poiPids.length - 1)) {
                swal('注意', '已经是最后一条数据了！', 'info');
            } else {
                swal('注意', '没有找到下一条数据！', 'info');
            }
        };
    }
]);
