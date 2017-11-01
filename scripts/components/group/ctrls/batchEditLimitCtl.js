/**
 * Created by zhaohang on 2017/10/31.
 */
/**
 * Created by zhaohang on 2017/10/11.
 */
angular.module('app').controller('batchEditLimitCtrl', ['$window', '$scope', '$timeout', 'NgTableParams', 'dsFcc', 'appPath', '$ocLazyLoad',
    function ($window, $scope, $timeout, NgTableParams, dsFcc, appPath, $ocLazyLoad) {
        $scope.boundaryLink = '1';
        $scope.limit = [{
            id: '1',
            label: '限行'
        }, {
            id: '2',
            label: '不限行'
        }];
        var initialize = function (event, data) {
            $scope.limitData = data.data;
        };

        var unbindHandler = $scope.$on('ReloadData-batchEditLimit', initialize);
        $scope.$on('$destroy', function (event, data) {

        });
    }
]);
