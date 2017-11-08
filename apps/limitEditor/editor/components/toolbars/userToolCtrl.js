/**
 * Created by zhaohang on 2016/11/22.
 */
angular.module('app').controller('userToolCtrl', ['$rootScope', '$scope', '$ocLazyLoad', 'ngDialog', 'appPath', 'dsEdit', 'dsColumn', 'dsManage', 'dsFcc', '$interval', 'dsOutput', '$timeout',
    function ($rootScope, $scope, $ocLazyLoad, ngDialog, appPath, dsEdit, dsColumn, dsManage, dsFcc, $interval, dsOutput, $timeout) {
        var eventCtrl = fastmap.uikit.EventController();
        var sceneController = fastmap.mapApi.scene.SceneController.getInstance();
        $scope.menuList = []; // 控制菜单是否可用

        var initMenuList = function () {
            $scope.menuList = ['policyTable', 'resultList', 'submit', 'infoPanel', 'limit'];
        };
        $scope.backToInfo = function (flag) {
            if (flag) {
                return;
            }
            window.location.href = '#/group?access_token=' + App.Temp.accessToken + '&random=' + Math.floor(Math.random() * 100);
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
        // 编辑线列表
        $scope.spareLineList = function (flag) {
            if (flag) {
                return;
            }
            $scope.$emit('ShowInfoPage', {
                type: 'spareLine'
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
                    $scope.$emit('RefreshResultList');
                    sceneController.redrawLayerByGeoLiveTypes(['COPYTOLINE', 'COPYTOPOLYGON', 'DRAWPOLYGON', 'GEOMETRYLINE', 'GEOMETRYPOLYGON']);
                }
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
