/**
 * 批量编辑限行线
 * @author zhaohang
 * @date   2017/11/15
 * @param  {object} $window 窗口
 * @param  {object} $scope 作用域
 * @param  {object} $timeout 定时
 * @param  {object} NgTableParams 构造函数
 * @param  {object} dsFcc 接口服务
 * @param  {object} appPath app路径
 * @param  {object} $ocLazyLoad 延时加载
 * @return {undefined}
 */
angular.module('app').controller('batchEditLimitLineCtrl', ['$window', '$scope', '$timeout', 'NgTableParams', 'dsFcc', 'appPath', '$ocLazyLoad',
    function ($window, $scope, $timeout, NgTableParams, dsFcc, appPath, $ocLazyLoad) {
        var eventCtrl = new fastmap.uikit.EventController();
        /**
         * 默认页面显示ID为0的值
         * @author Niuxinyi
         * @date   2017-11-20
         */
        $scope.linkDir = 0;
        $scope.limit = [{
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
         * 保存编辑操作
         * @author Niuxinyi
         * @date   2017-11-20
         * @return {undefined}
         */
        $scope.saveBatchEdit = function () {
            var ids = [];
            var limitData = $scope.limitData;
            for (var i = 0; i < limitData.length; i++) {
                ids.push({
                    geometryId: limitData[i].properties.geometryId,
                    linkPid: limitData[i].properties.id
                });
            }
            var param = {
                type: 'SCPLATERESRDLINK',
                command: 'UPDATE',
                dbId: App.Temp.dbId,
                limitDir: $scope.linkDir,
                data: ids
            };
            dsFcc.batchDelete(param).then(function (data) {
                if (data !== -1) {
                    $scope.$emit('Dialog-Closed', 'batchEditLimitLine');
                    eventCtrl.fire(eventCtrl.eventTypes.BATCHEDITLIMIT);
                    swal('提示', '编辑成功', 'success');
                }
            });
        };
        /**
         * 初始化数据
         * @author Niuxinyi
         * @date   2017-11-20
         * @param  {object} event 包括事件
         * @param  {object} data 包括数据
         * @return {undefined}
         */
        var initialize = function (event, data) {
            $scope.limitData = data.data;
        };

        var unbindHandler = $scope.$on('ReloadData-batchEditLimitLine', initialize);
        $scope.$on('$destroy', function (event, data) {

        });
    }
]);
