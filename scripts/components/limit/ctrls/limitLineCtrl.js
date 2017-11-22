/**
 * 限行线
 * @author zhaohang
 * @date   2017/11/15
 * @param  {object} $scope 作用域
 * @param  {object} $timeout 定时
 * @param  {object} dsEdit 编辑
 * @param  {object} appPath app路径
 * @param  {object} $ocLazyLoad 延时加载
 * @return {undefined}
 */
angular.module('app').controller('limitLineCtl', ['$scope', '$timeout', 'dsEdit', 'appPath', '$ocLazyLoad', function ($scope, $timeout, dsEdit, appPath, $ocLazyLoad) {
    var eventCtrl = fastmap.uikit.EventController();
    var selectCtrl = fastmap.uikit.SelectController();
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();

    $scope.linkDir = [{
        id: 0,
        label: '未限制'
    }, {
        id: 1,
        label: '双方向限行'
    }, {
        id: 2,
        label: '顺方向限行'
    }, {
        id: 3,
        label: '逆方向限行'
    }];
    /**
     * 初始化数据
     * @author Niuxinyi
     * @date   2017-11-20
     * @return {undefined}
     */
    $scope.initializeData = function () {
        $scope.limitLineDate = objCtrl.data;
    };

    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
