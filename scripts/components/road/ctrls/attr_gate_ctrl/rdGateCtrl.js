/**
 * Created by mali on 2016/7/20.
 */
angular.module('app').controller('rdGateController', ['$scope', 'appPath', 'dsEdit', '$timeout', '$ocLazyLoad', function ($scope, appPath, dsEdit, $timeout, $ocLazyLoad) {
    var objectEditCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var relationData = layerCtrl.getLayerById('relationData');
    $scope.gateValidObj = {
        0: '机动车辆',
        1: '行人'
    };
    $ocLazyLoad.load('../../scripts/components/road/ctrls/attr_gate_ctrl/limitOfGateCtrl.js');
    $scope.linkNameNum = 0;
    $scope.rememberNameNum = function (index) {
        $scope.linkNameNum = index;
        for (var num = 0; num < $scope.rdGateData.condition.length; num++) {
            if (num === index) {
                $scope.rdGateData.condition[num].heightLight = true;
            } else {
                $scope.rdGateData.condition[num].heightLight = false;
            }
        }
    };

    $scope.addLimitTruck = function () {
        if ($scope.rdGateData.condition.length === 0) {
            $scope.rdGateData.condition.unshift(fastmap.dataApi.rdGateCondition({ pid: $scope.rdGateData.pid }));
        } else if ($scope.rdGateData.condition.length === 1) {
            if ($scope.rdGateData.condition[0].validObj == 1) {
                $scope.rdGateData.condition.unshift(fastmap.dataApi.rdGateCondition({ pid: $scope.rdGateData.pid, validObj: 0 }));
            } else {
                $scope.rdGateData.condition.unshift(fastmap.dataApi.rdGateCondition({ pid: $scope.rdGateData.pid, validObj: 1 }));
            }
        } else {
            swal('操作失败', '大门限制信息中的通行对象不能重复', 'error');
        }
    };
    $scope.showGateInfo = function (index) {
        // var showBlackObj = { // 这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
        //    loadType: 'subAttrTplContainer',
        //    propertyCtrl: appPath.road + 'ctrls/blank_ctrl/blankCtrl',
        //    propertyHtml: appPath.root + appPath.road + 'tpls/blank_tpl/blankTpl.html',
        //    callback: function () {
        //        var showNamesObj = {
        //            loadType: 'subAttrTplContainer',
        //            propertyCtrl: appPath.road + 'ctrls/attr_gate_ctrl/limitOfGateCtrl',
        //            propertyHtml: appPath.root + appPath.road + 'tpls/attr_gate_tpl/limitOfGateTpl.html',
        //            data: index + '' // 必须将数字转成字符串
        //        };
        //        $scope.$emit('transitCtrlAndTpl', showNamesObj);
        //    }
        // };
        // $scope.$emit('transitCtrlAndTpl', showBlackObj);
        $scope.subAttributeData = index;
         // var showGateInfo = {
         //    "loadType": "subAttrTplContainer",
         //    "propertyCtrl": 'scripts/components/road/ctrls/attr_gate_ctrl/limitOfGateCtrl',
         //    "propertyHtml": '../../../scripts/components/road/tpls/attr_gate_tpl/limitOfGateTpl.html',
         //    data: item
         // };
         // $scope.$emit("transitCtrlAndTpl", showGateInfo);
    };
    $scope.initializeData = function () {
        $scope.rdGateData = {};
        $scope.rdGateData = objectEditCtrl.data;
    };

    $scope.loadJsAndCtrl = function (obj) {
        $scope.$emit('transitCtrlAndTpl', obj);
    };
    $scope.minusLimit = function (id, index) {
        $scope.rdGateData.condition.splice(id, 1);
    };

    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
