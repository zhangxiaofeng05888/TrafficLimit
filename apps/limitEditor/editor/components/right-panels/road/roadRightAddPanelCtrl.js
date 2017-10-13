/**
 * Created by zhaohang on 2016/11/29.
 */
angular.module('app').controller('RoadRightAddPanelCtrl', ['$scope', '$rootScope', 'dsLazyload', 'appPath',
    function ($scope, $rootScope, dsLazyload, appPath) {
        var initialize = function (event, data) {
            var geoLiveType = $rootScope.GeoLiveType;
            $scope.objectName = FM.uikit.Config.getName(geoLiveType);
            var attrTmpl = FM.uikit.Config.getAddTemplate(geoLiveType);
            if (attrTmpl) {
                dsLazyload.loadInclude($scope, 'roadAddTmpl', appPath.scripts + attrTmpl.ctrl, appPath.scripts + attrTmpl.tmpl).then(function () {
                    $scope.$broadcast('ReloadData', data);
                });
            }
        };

        $scope.$on('RoadRightAddPanelReload', initialize);
    }
]);
