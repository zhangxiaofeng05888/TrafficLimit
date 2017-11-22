/**
 * 批量删除
 * @author zhaohang
 * @date   2017/11/1
 * @param  {object} $window 窗口
 * @param  {object} $scope 作用域
 * @param  {object} $timeout 定时
 * @param  {object} NgTableParams 构造函数
 * @param  {object} dsFcc 接口服务
 * @param  {object} appPath app路径
 * @param  {object} $ocLazyLoad 延时加载
 * @return {undefined}
 */
angular.module('app').controller('batchDeleteLimitCtrl', ['$window', '$scope', '$timeout', 'NgTableParams', 'dsFcc', 'appPath', '$ocLazyLoad',
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
            var limitData = $scope.limitData;
            var ids = [];
            var type = '';
            var param = {
                command: 'DELETE'
            };
            for (var i = 0; i < limitData.length; i++) {
                ids.push(limitData[i].properties.id);
            }
            switch (limitData[0].properties.geoLiveType) {
                case 'COPYTOLINE':
                    type = 'SCPLATERESLINK';
                    param.objId = ids;
                    break;
                case 'COPYTOPOLYGON':
                case 'DRAWPOLYGON':
                    type = 'SCPLATERESFACE';
                    param.objId = ids;
                    break;
                case 'GEOMETRYLINE':
                case 'GEOMETRYPOLYGON':
                    type = 'SCPLATERESGEOMETRY';
                    param.objIds = ids;
                    break;
                default:
                    type = '';
            }
            param.type = type;
            dsFcc.batchDelete(param).then(function (data) {
                if (data !== -1) {
                    $scope.$emit('Dialog-Closed', 'batchDeleteLimit');
                    eventCtrl.fire(eventCtrl.eventTypes.BATCHDELETELIMIT);
                    swal('提示', '删除成功', 'success');
                }
            });
        };
        var unbindHandler = $scope.$on('ReloadData-batchDeleteLimit', initialize);
        $scope.$on('$destroy', function (event, data) {

        });
    }
]);
