/**
 * Created by zhaohang on 2016/11/29.
 */
angular.module('app').controller('LeftFloatPanelCtrl', ['$scope', 'dsLazyload', 'appPath',
    function ($scope, dsLazyload, appPath) {
        var initialize = function (event, data) {
            var tmplFile = FM.uikit.Config.getUtilityTemplate(data.type);
            dsLazyload.loadInclude($scope, 'pageTmpl', appPath.scripts + tmplFile.ctrl, appPath.scripts + tmplFile.tmpl).then(function () {
                $scope.$broadcast('ReloadData', data.data);
            });
        };

        $scope.$on('LeftFloatPanelReload', initialize);
    }
]);
