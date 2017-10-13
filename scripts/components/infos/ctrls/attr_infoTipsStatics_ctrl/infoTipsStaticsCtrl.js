/**
 * Created by zhongxiaoming on 2017/5/26.
 */
angular.module('app').controller('infoTipsStaticsCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    var initialize = function () {
        var fccService = fastmap.service.DataServiceTips.getInstance();
        fccService.getStaticsResult(App.Temp.subTaskId).then(function (data) {
            // $scope.check_loading = false;
            // $scope.check_done_error = true;
            // $scope.errorNum = data.total;
            $scope.result = data;
            $scope.$apply();
        });
    };
    initialize();
}]);
