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
angular.module('app').controller('addRuleCtrl', ['$window', '$scope', '$timeout', 'NgTableParams', 'dsFcc', 'appPath', '$ocLazyLoad',
    function ($window, $scope, $timeout, NgTableParams, dsFcc, appPath, $ocLazyLoad) {
        $scope.RuleData = {
            manoeuvreId: '', // 策略表id
            mGroupId: '', // 策略组号
            adAdmin: '', // 行政区划
            vehicle: 1, // 车辆类型
            attribution: 1, // 外本埠
            ruleDes: '' // 限行描述
        };
        // 车辆类型
        $scope.carType = [{
            id: 1,
            name: '客车'
        },
        {
            id: 2,
            name: '货车'
        }];
        // 本外埠
        $scope.attribution = [{
            id: 1,
            name: '本地'
        },
        {
            id: 2,
            name: '外埠'
        }];
         /**
         * 初始化数据
         * @author zhangxiaofeng
         * @date   2018-07-21
         * @return {undefined}
         */
        var initialize = function () {
            $scope.groupId = App.Temp.groupId;
        };
        var unbindHandler = $scope.$on('ReloadData-addRule', initialize);
    }
]);
