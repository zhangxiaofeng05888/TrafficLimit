/**
 * Created by mali on 2016/6/23.
 */
angular.module('app').controller('rwNodeController', ['$scope', 'dsEdit', function ($scope, dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = fastmap.uikit.SelectController();
    // 形态
    $scope.form = [
        { id: 0, label: '无' },
        { id: 1, label: '铁路道口' },
        { id: 2, label: '桥' },
        { id: 3, label: '隧道' },
        { id: 4, label: '图廓点' },
        { id: 5, label: '有人看守铁路道口' },
        { id: 6, label: '无人看守铁路道口' }
    ];
    // 种别
    $scope.kind = [
        { id: 1, label: '平面交叉点' },
        { id: 2, label: 'LINK属性变化点' }
    ];
    // 初始化
    $scope.initializeData = function () {
        $scope.rwNodeData = objCtrl.data;
        /**
         * 根据点去获取多条adlink，再高亮点线
         */
        dsEdit.getByCondition({
            dbId: App.Temp.dbId,
            type: 'RWLINK',
            data: { nodePid: $scope.rwNodeData.pid }
        }).then(function (data) {
            if (data.errcode === -1) {
                return;
            }
            var lines = [];
            $scope.linepids = [];
            // 获取点连接的线
            for (var index in data.data) {
                if (index) {
                    var linkArr = data.data[index].geometry.coordinates || data[index].geometry.coordinates;
                    var points = [];
                    for (var i = 0, len = linkArr.length; i < len; i++) {
                        var point = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
                        points.push(point);
                    }
                    lines.push(fastmap.mapApi.lineString(points));
                    $scope.linepids.push(data.data[index].pid);
                }
            }
            var multiPolyLine = fastmap.mapApi.multiPolyline(lines);
            // 存储选择的数据
            selectCtrl.onSelected({ geometry: multiPolyLine, id: $scope.rwNodeData.pid });
        });
    };

    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
