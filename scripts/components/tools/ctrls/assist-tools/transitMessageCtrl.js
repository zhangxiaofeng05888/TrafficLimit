/**
 * Created by wangmingdong on 2017/1/12.
 */
angular.module('app').controller('LogMessageCtrl', ['$rootScope', '$scope', '$timeout',
    function ($rootScope, $scope, $timeout) {
        var logMsgCtrl = fastmap.uikit.LogMsgController($scope);
        var eventCtrl = fastmap.uikit.EventController();
        var sceneController = fastmap.mapApi.scene.SceneController.getInstance();
        $scope.systemMsg = [];
        // 控制消息面板的显示隐藏的标识;
        $scope.messageBoxStatus = true;
        // 隐藏左下角消息提示;
        $scope.hideMessageBox = function () {
            $scope.messageBoxStatus = false;
        };
        // 显示左下角消息提示；
        $scope.getNewData = function () {
            if (!$scope.messageBoxStatus) {
                $scope.messageBoxStatus = true;
            }
        };
        // 接收推送消息
        $scope.$on('getMessage', function (event, data) {
            $timeout(function () {
                $scope.statusMessage = '消息通道建立成功，等待接收...';
            });
            if (data.status === 2) {
                $scope.statusMessage = '转换成功';
            } else {
                $scope.statusMessage = '转换失败';
            }
            // 刷新地图
            sceneController.redrawLayerByGeoLiveTypes(sceneController.getLoadedFeatureTypes());
            // 去掉进度条
            $scope.showLoading.flag = false;
            // 新的消息进行来，如果用户之前关掉了消息面板，这时候自动打开;
            $scope.getNewData();
            $scope.$apply();
        });

        $scope.statusMessage = '消息通道链接失败，请检查...';
        $scope.$on('sockStatus', function (event, data) {
            if (data.type === 'open') {
                $timeout(function () {
                    $scope.statusMessage = '消息通道建立成功，等待接收...';
                    $scope.messageBoxStatus = false;
                });
            } else if (data.type === 'close') {
                $timeout(function () {
                    $scope.statusMessage = '消息通道链接失败，请检查...';
                    $scope.messageBoxStatus = true;
                });
            }
        });
        $scope.initialize = function () {
            $scope.logMessages = logMsgCtrl.messages;
            $scope.currentDataNum = 0;
            $scope.currentShowData = $scope.logMessages[$scope.currentDataNum];
        };


        $scope.initialize();
    }
]);
