/**
 * Created by wuzhen on 2016/7/24.
 * 警示信息面板
 */
angular.module('app').controller('voiceGuideCtl', ['$scope', '$timeout', 'dsEdit', 'appPath', '$ocLazyLoad', function ($scope, $timeout, dsEdit, appPath, $ocLazyLoad) {
    var eventCtrl = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var flashHighlightCtrl = FM.mapApi.render.FlashHighlightController.getInstance();

    $scope.guideCodeList = [
        { id: 0, label: '未定义' },
        { id: 1, label: '直行' },
        { id: 2, label: '右斜前' },
        { id: 4, label: '右转' },
        { id: 6, label: '右后转' },
        { id: 7, label: '调头' },
        { id: 8, label: '左后转' },
        { id: 10, label: '左转' },
        { id: 12, label: '左斜前' },
        { id: 16, label: '3D模式上没有方向指定' },
        { id: 19, label: '右转专用link' }
    ];

    $scope.guideTypeList = [
        { id: 0, label: '默认值' },
        { id: 1, label: '平面' },
        { id: 2, label: '高架' },
        { id: 3, label: '地下' }
    ];

    $scope.imageCode = {
        0: '0.png',
        1: '1.png',
        2: '2.png',
        4: '4.png',
        6: '6.png',
        7: '7.png',
        8: '8.png',
        10: '10.png',
        12: '12.png',
        16: '16.png',
        19: '19.png'
    };
    $scope.progressFlag = {
        0: '无',
        1: '人工',
        2: '批处理'
    };
    $scope.relationshipType = {
        1: '路口',
        2: '线线'
    };

    var getSelectedLinks = function () {
        var data = [];
        var sIndex = $scope.selectIndex;
        if (sIndex >= 0) {
            var topo = $scope.voiceGuide.details[sIndex];
            data.push({
                pid: topo.outLinkPid,
                featureType: 'RDLINK',
                symbolName: 'ls_link_selected'
            });
            for (var i = 0; i < topo.vias.length; i++) {
                data.push({
                    pid: topo.vias[i].linkPid,
                    featureType: 'RDLINK',
                    symbolName: 'ls_link_selected'
                });
            }
        }
        return data;
    };

    $scope.initializeData = function () {
        $scope.voiceGuide = objCtrl.data;
        flashHighlightCtrl.clearFeedback();

        $scope.selectIndex = 0; // 用于控制选中图片的样式
        // $scope.details = $scope.voiceGuide.details[0];
        // $scope.highLight();
        flashHighlightCtrl.resetFeedback(getSelectedLinks());
    };
    // 删除退出线
    $scope.minusDetails = function (index) {
        $scope.voiceGuide.details.splice(index, 1);
        if ($scope.voiceGuide.details.length > 0) {
            // $scope.details = $scope.voiceGuide.details[0];
            $scope.selectIndex = 0;
        } else {
            // $scope.details = {};
            $scope.selectIndex = -1;
        }
    };

    // 显示退出线详细信息
    $scope.showDetailsInfo = function (index) {
        flashHighlightCtrl.clearFeedback();
        // $scope.details = $scope.voiceGuide.details[index];
        $scope.selectIndex = index;
        flashHighlightCtrl.resetFeedback(getSelectedLinks());
    };

    $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        flashHighlightCtrl.clearFeedback();
    });
}]);
