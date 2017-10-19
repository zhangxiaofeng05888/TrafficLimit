/**
 * Created by zhaohang on 2016/11/22.
 */
angular.module('app').controller('userToolCtrl', ['$rootScope', '$scope', '$ocLazyLoad', 'ngDialog', 'appPath', 'dsEdit', 'dsColumn', 'dsManage', 'dsFcc', '$interval', 'dsOutput', '$timeout',
    function ($rootScope, $scope, $ocLazyLoad, ngDialog, appPath, dsEdit, dsColumn, dsManage, dsFcc, $interval, dsOutput, $timeout) {
        var eventCtrl = fastmap.uikit.EventController();
        $scope.menuList = []; // 控制菜单是否可用

        var initMenuList = function () {
            $scope.menuList = ['policyTable', 'resultList'];
        };

        // 打开策略表
        $scope.showPolicyTool = function (flag) {
            if (flag) {
                return;
            }
            $scope.$emit('ShowInfoPage', {
                type: 'showPolicyPanel'
            });
        };

        // 打开几何成果列表
        $scope.showResultListPanel = function (flag) {
            if (flag) {
                return;
            }

            $scope.$emit('ShowInfoPage', {
                type: 'ResultListPanel'
            });
        };

        var initUserTool = function () {
            initMenuList();
        };

        initUserTool();
    }
]);
