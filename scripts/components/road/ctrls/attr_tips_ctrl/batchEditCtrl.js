/**
 * Created by zhongxiaoming on 2017/2/7.
 */
angular.module('app').controller('BatchEditController', ['$scope', 'dsFcc', function ($scope, dsFcc, $ocLazyLoad) {
// 数据初始化;
    var sceneCtrl = fastmap.mapApi.scene.SceneController.getInstance();
    var tipConfig = new FM.uikit.Config.Tip();
    var statusList = ['待作业', '有问题', '已作业'];
    $scope.status = 0;
    function initialize(data) {
        data.forEach(function (item) {
            item.name = tipConfig.getName(item.geoLiveType);
            item.selected = true;
            item.status = App.Temp.mdFlag === 'd' ? statusList[item.track.t_dEditStatus] : statusList[item.track.t_mEditStatus];
        });
        $scope.tips = data;
    }

    var unbindHandler = $scope.$on('ReloadData', function (event, data) {
        initialize(data);
    });
    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });

    $scope.save = function () {
        var datas = [];
        var features = [];
        $scope.tips.forEach(function (element) {
            if (element.selected) {
                features.push(element.geoLiveType);
                datas.push({ rowkey: element.rowkey, editStatus: $scope.status, editMeth: 1 });
            }
        });
        dsFcc.batchTipsSave(datas).then(function () {
            sceneCtrl.redrawLayerByGeoLiveTypes(features);
        });
    };

    $scope.multiHighlight = function () {
        var datas = $scope.tips.filter(function (item) {
            return item.selected;
        });

        $scope.$emit('Multi-Highlight', datas);
    };
}]);
