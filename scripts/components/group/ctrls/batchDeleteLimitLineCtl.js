/**
 * 批量删除限行线
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
angular.module('app').controller('batchDeleteLimitLineCtrl', ['$window', '$scope', '$timeout', 'NgTableParams', 'dsFcc', 'appPath', '$ocLazyLoad',
    function ($window, $scope, $timeout, NgTableParams, dsFcc, appPath, $ocLazyLoad) {
        var eventCtrl = new fastmap.uikit.EventController();
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
        /**
         * 删除操作
         * @author Niuxinyi
         * @date   2017-11-20
         * @return {undefined}
         */
        $scope.batchDelete = function () {
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
                command: 'DELETE',
                dbId: App.Temp.dbId,
                limitDir: $scope.linkDir,
                data: ids
            };
            dsFcc.batchDelete(param).then(function (data) {
                if (data !== -1) {
                    $scope.$emit('Dialog-Closed', 'batchDeleteLimitLine');
                    eventCtrl.fire(eventCtrl.eventTypes.BATCHDELETELIMIT);
                    swal('提示', '删除成功', 'success');
                }
            });
        };
        var unbindHandler = $scope.$on('ReloadData-batchDeleteLimitLine', initialize);
        $scope.$on('$destroy', function (event, data) {

        });
    }
]);
