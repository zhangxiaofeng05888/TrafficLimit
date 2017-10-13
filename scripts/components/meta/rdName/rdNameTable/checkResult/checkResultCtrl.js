/**
 * Created by mali on 2017/4/8.
 * 检查结果界面
 */
angular.module('app').controller('CheckResultCtrl', ['$scope', '$ocLazyLoad', 'appPath', '$interval', 'dsMeta',
    function ($scope, $ocLazyLoad, appPath, $interval, dsMeta) {
        $scope.getCheckResult = function () {
            $ocLazyLoad.load(appPath.meta + 'rdName/rdNameTable/checkResult/checkResultDetailCtrl.js');
            // window.location.href = appPath.meta + 'rdName/rdNameTable/checkResult/checkResultDetail.html?access_token=' + App.Temp.accessToken;
            window.location.href = '#/checkResultDetail?access_token=' + App.Temp.accessToken;
        };
    }
]);
