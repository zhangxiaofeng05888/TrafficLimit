/**
 * Created by wuzhen on 2017/5/8.
 */
angular.module('app').controller('startBatchEditCtrl', ['$scope',
    function ($scope) {
        $scope.closePanel = function () {
            $scope.$hide();
        };
    }
]);
