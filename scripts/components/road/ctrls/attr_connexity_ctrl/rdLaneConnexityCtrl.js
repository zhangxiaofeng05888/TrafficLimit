/**
 * Created by liuzhaoxia on 2015/12/23.
 */
var otherApp = angular.module('app');
otherApp.controller('rdLaneConnexityController', ['$scope', '$ocLazyLoad', 'appPath', 'dsEdit', 'hotkeys', '$popover', '$timeout',
    function ($scope, $ocLazyLoad, appPath, dsEdit, hotkeys, $popover, $timeout) {
        var objCtrl = fastmap.uikit.ObjectEditController();
        var flashHighlightCtrl = FM.mapApi.render.FlashHighlightController.getInstance();

        $scope.reachDirList = [{
            value: 0,
            text: '未调查'
        }, {
            value: 1,
            text: '直行'
        }, {
            value: 2,
            text: '左转'
        }, {
            value: 3,
            text: '右转'
        }, {
            value: 4,
            text: '掉头'
        }];

        $scope.directMapping = {
            d: '4',
            l: '42',
            b: '2',
            g: '21',
            a: '1',
            f: '13',
            c: '3',
            e: '41',
            i: '413',
            j: '421',
            k: '23',
            h: '213',
            m: '423',
            o: '0'
        };

        $scope.changeReachDir = function (topo) {
            var lane;
            for (var i = 0; i < $scope.CurrentObject.lanes.length; i++) {
                lane = $scope.CurrentObject.lanes[i];
                if ($scope.directMapping[lane.direct].indexOf(topo.reachDir) >= 0) {
                    topo.inLaneInfo[i] = 1;
                } else {
                    topo.inLaneInfo[i] = 0;
                }

                if (lane.busDirect && $scope.directMapping[lane.busDirect].indexOf(topo.reachDir) >= 0) {
                    topo.busLaneInfo[i] = 1;
                } else {
                    topo.busLaneInfo[i] = 0;
                }
            }
        };

        $scope.toggleMatchLane = function (topo, laneIndex, flag) {
            var direct;
            if (flag == 1) { // 普通车道
                direct = $scope.CurrentObject.lanes[laneIndex].direct;
                if ($scope.directMapping[direct].indexOf(topo.reachDir) >= 0) {
                    topo.inLaneInfo[laneIndex] = 1 - topo.inLaneInfo[laneIndex];
                }
            } else if (flag == 2) { // 公交车道
                direct = $scope.CurrentObject.lanes[laneIndex].busDirect;
                if (direct && $scope.directMapping[direct].indexOf(topo.reachDir) >= 0) {
                    topo.busLaneInfo[laneIndex] = 1 - topo.busLaneInfo[laneIndex];
                }
            }
        };

        $scope.currentLaneIndex = -1;
        $scope.selectLane = function (index) {
            if ($scope.currentLaneIndex === index) {
                $scope.currentLaneIndex = -1;
            } else {
                $scope.currentLaneIndex = index;

                var topo,
                    i,
                    j;
                var data = [];
                for (i = 0; i < $scope.CurrentObject.topos.length; ++i) {
                    topo = $scope.CurrentObject.topos[i];
                    if (topo.inLaneInfo[index] === 1 || topo.busLaneInfo[index] === 1) {
                        data.push({
                            pid: topo.outLinkPid,
                            featureType: 'RDLINK',
                            symbolName: 'ls_link_selected'
                        });

                        for (j = 0; j < topo.vias.length; j++) {
                            data.push({
                                pid: topo.vias[j].linkPid,
                                featureType: 'RDLINK',
                                symbolName: 'ls_link_selected'
                            });
                        }
                    }
                }

                flashHighlightCtrl.resetFeedback(data);
            }
        };

        $scope.topoFilter = function (item) {
            var laneIndex = $scope.currentLaneIndex;
            if (laneIndex >= 0) {
                return (item.inLaneInfo[laneIndex] === 1 || item.busLaneInfo[laneIndex] === 1);
            }
            return true;
        };

        $scope.selectOutLink = function (pid) {
            var topo,
                i,
                j;
            var data = [];
            for (i = 0; i < $scope.CurrentObject.topos.length; ++i) {
                topo = $scope.CurrentObject.topos[i];
                if (topo.outLinkPid === pid) {
                    data.push({
                        pid: topo.outLinkPid,
                        featureType: 'RDLINK',
                        symbolName: 'ls_link_selected'
                    });

                    for (j = 0; j < topo.vias.length; j++) {
                        data.push({
                            pid: topo.vias[j].linkPid,
                            featureType: 'RDLINK',
                            symbolName: 'ls_link_selected'
                        });
                    }

                    break;
                }
            }
            flashHighlightCtrl.resetFeedback(data);
        };

        $scope.selectViaLink = function (pid) {
            flashHighlightCtrl.resetFeedback([{
                pid: pid,
                featureType: 'RDLINK',
                symbolName: 'ls_link_selected'
            }]);
        };

        $scope.initialize = function () {
            flashHighlightCtrl.clearFeedback();

            $scope.CurrentObject = objCtrl.data;
            $scope.currentLaneIndex = -1;
            // 回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
            if ($scope.rdLaneConnexityForm) {
                $scope.rdLaneConnexityForm.$setPristine();
            }
        };

        $scope.$on('ReloadData', $scope.initialize);

        $scope.$on('$destroy', function () {
            flashHighlightCtrl.clearFeedback();
        });
    }
]);
