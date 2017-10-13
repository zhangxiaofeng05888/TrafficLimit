/**
 * Created by zhaohang on 2016/11/29.
 */
angular.module('app').controller('TipRightAddPanelCtrl', ['$scope', '$rootScope', 'dsLazyload', 'appPath',
    function ($scope, $rootScope, dsLazyload, appPath) {
        var initialize = function () {
            var geoLiveType = $rootScope.CurrentObject.geoLiveType;
            $scope.objectName = FM.uikit.Config.getName(geoLiveType);
            var attrTmpl = FM.uikit.Config.getAddTemplate(geoLiveType);
            if (attrTmpl) {
                dsLazyload.loadInclude($scope, 'tipAddTmpl', appPath.scripts + attrTmpl.ctrl, appPath.scripts + attrTmpl.tmpl).then(function () {
                    $scope.$broadcast('ReloadData', {
                        data: $rootScope.CurrentObject
                    });
                });
            }
        };

        $scope.$on('TipRightAddPanelReload', initialize);
    }
]);
