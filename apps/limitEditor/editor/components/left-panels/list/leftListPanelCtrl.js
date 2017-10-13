/**
 * Created by wangmingdong on 2017/5/8.
 */
angular.module('app').controller('leftListPanelCtrl', ['$scope', '$ocLazyLoad', 'uiGridConstants',
    function ($scope, $ocLazyLoad, uiGridConstants) {
        var eventController = fastmap.uikit.EventController();
        // 显示列表类型
        $scope.typeList = [
            { name: 'POI', id: 1 },
            { name: 'Tips', id: 2 }
        ];

        // poi tab名称
        $scope.tabPoiName = [
            { name: '待作业', id: 1 },
            { name: '待提交', id: 2 },
            { name: '已提交', id: 3 }
        ];

        // tips type类型
        $scope.tabTipName = [
            { name: '待作业', id: 1 },
            { name: '已作业', id: 2 },
            { name: '有问题', id: 3 }
        ];

        $scope.tabQualityCheckName = [
            { name: '待质检', id: 1 },
            { name: '已质检', id: 2 },
            { name: '有问题', id: 3 }
        ];

        $scope.initData = function () {
            $scope.tabNames = $scope.tabPoiName;
            $scope.activeType = 1;
            if (App.Temp.taskType == 0 || App.Temp.taskType == 2) {
                $scope.listType = $scope.typeList[0];
            } else {
                $scope.listType = $scope.typeList[1];
            }
            $scope.selectListType($scope.listType);
            $ocLazyLoad.load('./editor/components/left-panels/list/leftPoiListPanelCtrl.js').then(function () {
                $scope.loadPoiListTpl = './editor/components/left-panels/list/leftPoiListPanelTmpl.htm';
            });
        };

        // 切换显示列表类型
        $scope.selectListType = function (type) {
            $scope.listType = type;
            if (type.id == 1) {
                $ocLazyLoad.load('./editor/components/left-panels/list/leftPoiListPanelCtrl.js').then(function () {
                    $scope.loadPoiListTpl = './editor/components/left-panels/list/leftPoiListPanelTmpl.htm';
                    $scope.tabNames = $scope.tabPoiName;
                    $scope.$emit('LeftPanelFullAndLeft', false);
                    $scope.$broadcast('resetTableHead', $scope.activeType);
                    $scope.$broadcast('refreshTable', $scope.activeType);
                });
            } else if (type.id == 2) {
                $ocLazyLoad.load('./editor/components/left-panels/list/leftTipsListPanelCtrl.js').then(function () {
                    $scope.loadTipsListTpl = './editor/components/left-panels/list/leftTipsListPanelTmpl.htm';
                    if (App.Temp.qcTaskFlag) {
                        $scope.tabNames = $scope.tabQualityCheckName;
                    } else {
                        $scope.tabNames = $scope.tabTipName;
                    }
                    $scope.activeType = 1;
                    $scope.listTitleContainerStyle = {
                        'background-image': "url('../../images/webEditor/left-panel/bg2.png')",
                        width: '300px'
                    };
                    $scope.leftPanelFull = false;
                    $scope.$emit('LeftPanelFullAndLeft', false);
                    $scope.$broadcast('refreshTable', $scope.activeType);
                });
            }
        };

        // 回车搜索POI
        $scope.doSearchParPoiList = function (e) {
            var code = e.keyCode;
            if (code == 13 && $scope.listType.id == 1) { // 按enter键时触发，并且只对poi标签有效
                $scope.searchParContent();
            }
        };
        
        // 搜索POI
        $scope.searchParContent = function () {
            if ($scope.listType.id == 1) {
                $scope.$broadcast('getSearchTable', $scope.searchParText);
            }
        };

        // 切换作业类型
        $scope.changeType = function (type) {
            $scope.activeType = type;
            $scope.$broadcast('refreshTable', type);
        };

        $scope.openTipList = function () {
            eventController.fire(L.Mixin.EventTypes.PARTSOPENPANEL, { panelName: 'tipListPanel' });
        };

        $scope.initData();

        // 切换大小样式变化
        $scope.$on('LeftPanelFullAndLeft', function (event, data) {
            if (data.flag) {
                $scope.listTitleContainerStyle = {
                    'background-image': "url('../../images/webEditor/left-panel/bg.png')",
                    width: '100%'
                };
            } else {
                $scope.listTitleContainerStyle = {
                    'background-image': "url('../../images/webEditor/left-panel/bg2.png')",
                    width: '300px'
                };
            }
            $scope.leftPanelFull = data.flag;
            $scope.childScope = data.childScope;
        });

        $scope.toggleVisible = function () {
            $scope.childScope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        };

        // 重置activeType
        $scope.$on('resetActiveType', function (event, data) {
            $scope.activeType = data;
        });
    }
]);
