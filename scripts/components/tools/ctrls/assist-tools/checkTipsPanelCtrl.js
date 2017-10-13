/**
 * Created by zhongxiaoming on 2017/5/16.
 */
angular.module('app').controller('CheckTipsPanelCtrl', ['$scope',
    function ($scope) {
        function resetStatus() {
            $scope.check_loading = true;
            $scope.check_done_error = false;
            $scope.check_done = false;
            $scope.errorNum = 0;
        }
        var unbindHandler = null;
        resetStatus();
        var initialize = function () {
            resetStatus();
            var fccService = fastmap.service.DataServiceTips.getInstance();
            fccService.checkTips(App.Temp.subTaskId, App.Temp.dbId).then(function (data) {
                $scope.check_loading = false;
                $scope.check_done_error = true;
                $scope.errorNum = data.total;
                $scope.$apply();
            });
        };
        $scope.getErrors = function () {
            $scope.$emit('getCheckErrors', { type: 'CheckTipsPanel' });
        };
        unbindHandler = $scope.$on('ShowCheckPageReload', initialize);
        $scope.$on('$destroy', function () {
            unbindHandler = null;
        });
    }
]);
