/**
 * Created by zhaohang on 2016/11/22.
 */
angular.module('app').controller('userToolCtrl', ['$rootScope', '$scope', '$ocLazyLoad', 'ngDialog', 'appPath', 'dsEdit', 'dsColumn', 'dsManage', 'dsFcc', '$interval', 'dsOutput', '$timeout',
    function ($rootScope, $scope, $ocLazyLoad, ngDialog, appPath, dsEdit, dsColumn, dsManage, dsFcc, $interval, dsOutput, $timeout) {
        var eventCtrl = fastmap.uikit.EventController();
        var sceneController = fastmap.mapApi.scene.SceneController.getInstance();
        $scope.menuList = []; // 控制菜单是否可用

        var initMenuList = function () {
            $scope.menuList = ['policyTable', 'submit'];
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
        // 提交几何
        $scope.submitGeometry = function (flag) {
            if (flag) {
                return;
            }
            var params = {
                command: 'CREATE',
                type: 'SCPLATERESGEOMETRY',
                data: {
                    groupId: App.Temp.groupId
                }
            };
            dsFcc.submitGeo(params).then(function (data) {
                if (data !== -1) {
                    swal('提示', '提交成功', 'success');
                    sceneController.redrawLayerByGeoLiveTypes(['COPYTOLINE', 'COPYTOPOLYGON', 'DRAWPOLYGON', 'GEOMETRYLINE', 'GEOMETRYPOLYGON']);
                }
            });
        };

        var initUserTool = function () {
            initMenuList();
        };

        initUserTool();
    }
]);
