/**
 * Created by linglong on 2016/8/12.
 */
angular.module('app').controller('editBorderCtrl', ['$scope', 'dsFcc', function ($scope, dsFcc) {
    var objectCtrl = fastmap.uikit.ObjectEditController();
    $scope.workStatus = [
        { id: 0, label: '未开始' },
        { id: 1, label: '问题待确认' },
        { id: 2, label: '已完成' }
    ];
    var initializeLinkData = function () {
        $scope.joinBorder = objectCtrl.data;
        if (App.Temp.mdFlag === 'd') {
            $scope.joinBorder.t_dStatus = objectCtrl.data.track.t_dEditStatus;
        }
        if (App.Temp.mdFlag === 'm') {
            $scope.joinBorder.t_dStatus = objectCtrl.data.track.t_mEditStatus;
        }
    };
    // 更新接边tips状态;
    $scope.upDateStatus = function () {
        var data = [{
            rowkey: $scope.joinBorder.rowkey,
            editStatus: $scope.joinBorder.t_dStatus,
            editMeth: 1
        }];

        var simpleTip = new FM.dataApi.Tip({
            pid: objectCtrl.data.pid,
            geoLiveType: objectCtrl.data.geoLiveType
        });

        dsFcc.batchTipsSave(data).then(function (item) {
            $scope.$emit('ObjectUpdated', {
                feature: simpleTip,
                updateLogs: []
            });
        });
    };

    var unbindHandler = $scope.$on('ReloadData', initializeLinkData);
    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
