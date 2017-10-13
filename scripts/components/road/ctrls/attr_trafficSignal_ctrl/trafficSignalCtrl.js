/**
 * Created by wangmingdong on 2016/7/20.
 */

var rdTrafficSignalApp = angular.module('app');
rdTrafficSignalApp.controller('trafficSignalCtl', ['$scope', 'dsEdit', function ($scope, dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();

    /*
     * 根据当前单击的信号灯位置checkbox是否选中状态，来判断进行异或操作还是或操作
     * 由选中到非选中时，做异或操作，例 只有左100时，与4的二进制 100做异或操作，得到000，也即0
     * 由非选中到选中时，做或操作，例 位置都没有时000，与4的二进制 100做或操作，得到100，即左侧选中
     */
    $scope.locationClick = function (checked, num) {
        if (checked) {
            $scope.trafficSignalData.location ^= num;
        } else {
            $scope.trafficSignalData.location |= num;
        }
    };

    /* 信号灯类型*/
    $scope.lampType = [
        { id: 0, label: '机动车信号灯' },
        { id: 1, label: '非机动车信号灯' },
        { id: 2, label: '车道信号灯' },
        { id: 3, label: '方向指示灯' },
        { id: 4, label: '闪光警告信号灯' },
        { id: 5, label: '道路与铁路平交道口信号灯' }
    ];

    $scope.initializeData = function () {
        $scope.trafficSignalData = objCtrl.data;
        $scope.trafficPosition = {
            left: ($scope.trafficSignalData.location & 1) == 1,
            right: ($scope.trafficSignalData.location & 2) == 2,
            up: ($scope.trafficSignalData.location & 4) == 4
        };
    };

    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
