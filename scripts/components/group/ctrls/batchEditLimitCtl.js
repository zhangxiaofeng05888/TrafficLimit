/**
 * 批量编辑
 * @author zhaohang
 * @date   2017/10/31
 * @param  {object} $window 窗口
 * @param  {object} $scope 作用域
 * @param  {object} $timeout 定时
 * @param  {object} NgTableParams 构造函数
 * @param  {object} dsFcc 接口服务
 * @param  {object} appPath app路径
 * @param  {object} $ocLazyLoad 延时加载
 * @return {undefined}
 */
angular.module('app').controller('batchEditLimitCtrl', ['$window', '$scope', '$timeout', 'NgTableParams', 'dsFcc', 'appPath', '$ocLazyLoad',
    function ($window, $scope, $timeout, NgTableParams, dsFcc, appPath, $ocLazyLoad) {
        var eventCtrl = new fastmap.uikit.EventController();
        /**
         * 默认页面显示ID为1的值
         * @author Niuxinyi
         * @date   2017-11-20
         */
        $scope.boundaryLink = '1';
        $scope.limit = [{
            id: '1',
            label: '限行'
        }, {
            id: '2',
            label: '不限行'
        }];
        /**
         * 保存编辑操作
         * @author Niuxinyi
         * @date   2017-11-20
         * @return {undefined}
         */
        $scope.saveBatchEdit = function () {
            var ids = [];
            var type = '';
            var limitData = $scope.limitData;
            for (var i = 0; i < limitData.length; i++) {
                ids.push(limitData[i].properties.id);
            }
            switch (limitData[0].properties.geoLiveType) {
                case 'COPYTOLINE':
                    type = 'SCPLATERESLINK';
                    break;
                case 'DRAWPOLYGON':
                    type = 'SCPLATERESFACE';
                    break;
                case 'GEOMETRYLINE':
                case 'GEOMETRYPOLYGON':
                    type = 'SCPLATERESGEOMETRY';
                    break;
                default:
                    type = '';
            }
            var param = {
                type: type,
                command: 'UPDATE',
                objIds: ids,
                data: {
                    boundaryLink: $scope.boundaryLink,
                    objStatus: 'UPDATE'
                }
            };
            dsFcc.batchDelete(param).then(function (data) {
                if (data !== -1) {
                    $scope.$emit('Dialog-Closed', 'batchEditLimit');
                    eventCtrl.fire(eventCtrl.eventTypes.BATCHEDITLIMIT);
                    swal('提示', '编辑成功', 'success');
                }
            });
        };
        var initialize = function (event, data) {
            $scope.limitData = data.data;
        };

        var unbindHandler = $scope.$on('ReloadData-batchEditLimit', initialize);
        $scope.$on('$destroy', function (event, data) {

        });
    }
]);
