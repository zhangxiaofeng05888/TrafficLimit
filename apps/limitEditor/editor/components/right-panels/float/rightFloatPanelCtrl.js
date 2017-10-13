/**
 * Created by zhaohang on 2016/11/29.
 */
angular.module('app').controller('RightFloatPanelCtrl', ['$scope', '$rootScope', 'dsLazyload', 'appPath',
    function ($scope, $rootScope, dsLazyload, appPath) {
        var initialize = function (event, data) {
            var tmplFile = FM.uikit.Config.getUtilityTemplate(data.type);
            if (tmplFile) {
                dsLazyload.loadInclude($scope, 'pageTmpl', appPath.scripts + tmplFile.ctrl, appPath.scripts + tmplFile.tmpl).then(function () {
                    $scope.$broadcast('ReloadData', data.data);
                });
            }
        };

        $scope.$on('RightFloatPanelReload', initialize);
    }
]);
