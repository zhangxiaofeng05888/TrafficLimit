/**
 * Created by zhaohang on 2017/5/3.
 */
/**
 * Created by zhaohang on 2017/4/25.
 */

angular.module('app').controller('SelectTaskListCtrl', ['$scope', 'hotkeys',
    function ($scope, hotkeys) {
        var eventCtrl = fastmap.uikit.EventController();
        $scope.cityName = '北京';
        $scope.subTaskName = '';
        $scope.subTaskList = [];
        var dataServiceFcc = fastmap.service.DataServiceFcc.getInstance();
       // 搜索起点
        $scope.searchSubTask = function () {
            dataServiceFcc.subTaskListByCityName(
                {
                    inputName: $scope.subTaskName
                }).then(function (data) {
                    $scope.subTaskList = data;
                    if ($scope.subTaskList.length === 0) {
                        $scope.noSearchResult = {
                            display: 'block'
                        };
                        $scope.endStationStyle = {
                            'border-bottom': '1px solid #d0e4ff'
                        };
                        $scope.printNotice = '无搜索结果，请重新输入';
                    } else {
                        $scope.searchResult = {
                            display: 'block'
                        };
                        $scope.endStationStyle = {
                            'border-bottom': '1px solid #d0e4ff'
                        };
                        $scope.noSearchResult = {
                            display: 'none',
                            height: 30 + 'px',
                            'line-height': 30 + 'px',
                            'background-color': '#ffffff'
                        };
                    }
                    $scope.$apply();
                });
        };
        $scope.getSubTaskFromSearch = function (data) {
            $scope.subTaskName = data.name;
            $scope.subTaskList.length = 0;
            eventCtrl.fire(eventCtrl.eventTypes.PARTSSELECTEDCHANGED, {
                subtaskId: data.subtaskId,
                taskId: data.taskId
            });
        };
        $scope.emptyInput = function (arg) {
            $scope.subTaskName = '';
            $scope.subTaskList.length = 0;
        };
        var initialize = function (event, data) {
            $scope.taskId = 0;
        };
        $scope.objChange = function () {
            eventCtrl.fire(eventCtrl.eventTypes.PARTSSELECTEDCHANGED, {
                taskId: $scope.taskId
            });
        };
        var unbindHandler = $scope.$on('ReloadData', initialize);

        $scope.$on('$destroy', function () {
            unbindHandler = null;
        });
    }
]);
