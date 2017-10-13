/**
 * Created by wangmingdong on 2017/1/12.
 */
angular.module('app').controller('LogMessageCtrl', ['$rootScope', '$scope', '$timeout',
    function ($rootScope, $scope, $timeout) {
        var logMsgCtrl = fastmap.uikit.LogMsgController($scope);
        var eventCtrl = fastmap.uikit.EventController();
        $scope.systemMsg = [];
        // 控制消息面板的显示隐藏的标识;
        $scope.messageBoxStatus = true;
        // 隐藏左下角消息提示;
        $scope.hideMessageBox = function () {
            $scope.messageBoxStatus = false;
        };
        // 显示左下角消息提示；
        $scope.getNewData = function () {
            if (!$scope.messageBoxStatus && $scope.logMessages.length) {
                $scope.messageBoxStatus = true;
            }
        };
        // 接收推送消息
        $scope.$on('getMessage', function (event, data) {
            $timeout(function () {
                $scope.statusMessage = '消息通道建立成功，等待接收...';
            });
            if (data.length == 1) {
                $scope.systemMsg.unshift(data[0]);
                logMsgCtrl.pushMsg($scope, data[0]);
                // 判断用户自己发的消息还是系统发的消息;
                if (data[0].msgParam) {
                    var currentId = JSON.parse(data[0].msgParam).relateObjectId;
                    if ($rootScope.onLineJobStack && $rootScope.onLineJobStack.itemId === currentId) {
                        $rootScope.onLineJobStack.itemStatus = true;
                    }
                    sessionStorage.setItem('ON-LINE-JOB-STACK', JSON.stringify($rootScope.onLineJobStack));
                }
            } else if (data.length > 1) {
                $scope.systemMsg = data;
            }
            // 如果得到的提交和检查消息没有在列表中；
            if ($rootScope.onLineJobStack) {
                if ($rootScope.onLineJobStack.itemStatus) {
                    $scope.hideLoading();
                    if ($rootScope.onLineJobStack.itemType === 'poiSubmit') {
                        eventCtrl.fire('refreshPoiTable');
                    }
                }
                // else { // 刷新页面如果上一个job没有返回页面则继续loading（暂时去掉）
                //     $scope.showLoading();
                // }
            }
            $scope.currentDataNum = 0; // 默认显示最后加入进来的消息;
            $scope.currentShowData = $scope.logMessages[$scope.currentDataNum];
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

        $scope.showCheckResult = function () {
            if ([0, 2].indexOf(App.Temp.taskType) > -1) {
                $scope.$emit('ShowInfoPage', {
                    type: 'poiCheckResult'
                });
            } else if ([3, 4].indexOf(App.Temp.taskType) > -1) {
                $scope.$emit('ShowInfoPage', {
                    type: 'roadCheckResult'
                });
            }
        };

        // 获取后一条消息;
        $scope.nextMessage = function () {
            $scope.currentDataNum--;
            if ($scope.currentDataNum <= 0) {
                $scope.currentDataNum = 0;
            }
            $scope.currentShowData = $scope.logMessages[$scope.currentDataNum];
        };
        // 获取前一条消息;
        $scope.preMessage = function () {
            $scope.currentDataNum++;
            if ($scope.currentDataNum + 1 >= $scope.logMessages.length) {
                $scope.currentDataNum = $scope.logMessages.length - 1;
            }
            $scope.currentShowData = $scope.logMessages[$scope.currentDataNum];
        };
        // 删除一条消息;
        $scope.ignoreItem = function ($index) {
            logMsgCtrl.messages.splice($index, 1);
            if ($index === logMsgCtrl.messages.length) {
                $scope.currentDataNum = logMsgCtrl.messages.length - 1 >= 0 ? logMsgCtrl.messages.length - 1 : 0;
            }
        };

        $scope.initialize = function () {
            $scope.logMessages = logMsgCtrl.messages;
            $scope.currentDataNum = 0;
            $scope.currentShowData = $scope.logMessages[$scope.currentDataNum];
        };

        $scope.initialize();
    }
]);
