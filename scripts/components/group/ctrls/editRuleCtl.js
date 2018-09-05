/**
 * 编辑Rule表中新增记录
 * @author zhangxiaofeng
 * @date   2018/07/21
 * @param  {object} $window 窗口
 * @param  {object} $scope 作用域
 * @param  {object} $timeout 定时
 * @param  {object} NgTableParams 构造函数
 * @param  {object} dsFcc 接口服务
 * @param  {object} appPath app路径
 * @param  {object} $ocLazyLoad 延时加载
 * @return {undefined}
 */
angular.module('app').controller('editRuleCtrl', ['$window', '$scope', '$timeout', 'NgTableParams', 'dsFcc', 'appPath', '$ocLazyLoad',
    function ($window, $scope, $timeout, NgTableParams, dsFcc, appPath, $ocLazyLoad) {
         /**
         * 初始化数据
         * @author zhangxiaofeng
         * @date   2018-07-21
         * @return {undefined}
         */
        var initialize = function () {
            $scope.groupId = App.Temp.groupId;
        };
        var unbindHandler = $scope.$on('ReloadData-editRule', initialize);
    }
]);
