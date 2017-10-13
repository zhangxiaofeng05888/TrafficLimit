/**
 * Created by   Chensonglin on 17.3.29.
 */
angular.module('app').controller('tollGateCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = fastmap.uikit.SelectController();
    /* 收费站类型*/
    $scope.tollTypeObj = [
        { id: 0, label: '未调查' },
        { id: 1, label: '领卡' },
        { id: 2, label: '交卡付费' },
        { id: 3, label: '固定收费（次费）' },
        { id: 4, label: '交卡付费后再领卡' },
        { id: 5, label: '交卡付费并代收固定费用' },
        { id: 6, label: '验票（无票收费）值先保留' },
        { id: 7, label: '领卡并代收固定费用' },
        { id: 8, label: '持卡打标识不收费' },
        { id: 9, label: '验票领卡' },
        { id: 10, label: '交卡不收费' }
    ];
    $scope.interstates = [
        { id: 0, label: '未调查' },
        { id: 1, label: '本省收费站' },
        { id: 2, label: '跨省收费站' }
    ];
    $scope.tollPhoto = [
        { id: 1, label: '未采集' },
        { id: 2, label: '现场无标牌' },
        { id: 3, label: '已采集' }
    ];
    $scope.tollNumData = [
        { etcPass: 0, wgtPass: 0 },
        { etcPass: 0, wgtPass: 1 },
        { etcPass: 0, wgtPass: 0 }
    ];
    $scope.roadNumber = [
        {
            id: 0, label: '0'
        },
        {
            id: 1, label: '1'
        },
        {
            id: 2, label: '2'
        },
        {
            id: 3, label: '3'
        },
        {
            id: 4, label: '4'
        },
        {
            id: 5, label: '5'
        },
        {
            id: 6, label: '6'
        },
        {
            id: 7, label: '7'
        },
        {
            id: 8, label: '8'
        },
        {
            id: 9, label: '9'
        },
        {
            id: 10, label: '10'
        },
        {
            id: 11, label: '11'
        },
        {
            id: 12, label: '12'
        },
        {
            id: 13, label: '13'
        },
        {
            id: 14, label: '14'
        },
        {
            id: 15, label: '15'
        },
        {
            id: 16, label: '16'
        }

    ];
    // 初始化函数;
    $scope.initializeData = function () {
        $scope.tollGate = objCtrl.data;
        $scope.tollNumData = [];
        for (var j = 0; j < $scope.tollGate.deep.pNum; j++) {
            $scope.tollNumData.push({
                etcPass: $scope.tollGate.deep.etc[j],
                wgtPass: $scope.tollGate.deep.wgt[j]
            });
        }
        if ($scope.tollGate.feedback.f_array && $scope.tollGate.feedback.f_array.length > 0) {
            for (var i = 0; i < $scope.tollGate.feedback.f_array.length; i++) {
                if ($scope.tollGate.feedback.f_array[i].type == 3) {
                    $scope.tollGate.content = $scope.tollGate.feedback.f_array[i].content;
                }
            }
        }
    };
    $scope.changeTollNum = function () {
        var numData = [];
        var etcData = [];
        var wgtData = [];
        for (var i = 0; i < $scope.tollGate.deep.pNum; i++) {
            numData.push({
                etcPass: 0,
                wgtPass: 0
            });
            etcData.push(0);
            wgtData.push(0);
        }
        $scope.tollNumData = numData;
        $scope.tollGate.deep.etc = etcData;
        $scope.tollGate.deep.wgt = wgtData;
    };
    $scope.changeEtc = function (event, index) {
        if (event.target.checked) {
            $scope.tollGate.deep.etc[index] = 1;
        } else {
            $scope.tollGate.deep.etc[index] = 0;
        }
    };
    $scope.changeWgt = function (event, index) {
        if (event.target.checked) {
            $scope.tollGate.deep.wgt[index] = 1;
        } else {
            $scope.tollGate.deep.wgt[index] = 0;
        }
    };
    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
