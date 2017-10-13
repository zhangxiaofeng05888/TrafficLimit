/**
 * Created by zhaohang on 2016/4/7.
 */

var rdGscApp = angular.module('app');
rdGscApp.controller('rdGscController', ['$scope', function ($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var flashHighlightCtrl = FM.mapApi.render.FlashHighlightController.getInstance();

    /* 处理标识*/
    $scope.processFlag = [{
        id: 0,
        label: '无'
    }, {
        id: 1,
        label: '人工赋值'
    }, {
        id: 2,
        label: '程序赋值'
    }, {
        id: 3,
        label: '特殊处理'
    }];

    $scope.tableName = [{
        id: 'RD_LINK',
        label: 'RD_LINK'
    }, {
        id: 'LC_LINK ',
        label: 'LC_LINK '
    }, {
        id: 'RW_LINK',
        label: 'RW_LINK'
    }, {
        id: 'CMG_BUILDLINK',
        label: 'CMG_BUILDLINK'
    }, {
        id: 'RD_GSC_LINK',
        label: 'RD_GSC_LINK'
    }];

    $scope.selectLink = function (pid, zLevel) {
        flashHighlightCtrl.resetFeedback([{
            pid: pid,
            featureType: 'RDLINK',
            symbolName: 'ls_link_selected'
        }]);
    };

    var initializeData = function () {
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        $scope.reGscData = objCtrl.data;
    };

    $scope.$on('ReloadData', initializeData);
}]);
