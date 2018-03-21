/**
 * 作业项界面
 * @author zhaohang
 * @date   2017/9/15
 * @param  {object} $window 窗口
 * @param  {object} $scope 作用域
 * @param  {object} $timeout 定时
 * @param  {object} NgTableParams 构造函数
 * @param  {object} dsFcc 接口服务
 * @param  {object} appPath app路径
 * @param  {object} $ocLazyLoad 延迟加载
 * @param  {object} dsLazyload 延迟加载
 * @return {undefined}
 */
angular.module('app').controller('mainCtrl', ['$window', '$scope', '$timeout', 'NgTableParams', 'dsFcc', 'appPath', '$ocLazyLoad', 'dsLazyload',
    function ($window, $scope, $timeout, NgTableParams, dsFcc, appPath, $ocLazyLoad, dsLazyload) {
        if (!$scope.testLogin()) {
            return;
        }
        $scope.childListFlag = true; // 当前作业项折叠flag;
        $scope.selectId = true;
        /**
         * 显示作业项子内容
         * @method openChildList
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {undefined}
         */
        $scope.openChildList = function () {
            $scope.childListFlag = !$scope.childListFlag;
        };
        /**
         * 显示加载
         * @method showLoading
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {undefined}
         */
        $scope.showLoading = function () {
            if (!$scope.loading.flag) {
                $scope.loading.flag = true;
            }
        };
        /**
         * 隐藏加载
         * @method showLoading
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {undefined}
         */
        $scope.hideLoading = function () {
            if ($scope.loading.flag) {
                $scope.loading.flag = false;
            }
        };
        $scope.changePageUrl = function (type) {
            // type 同步加载 检查结果列表
            if (type === 'limitInfo') {
                $scope.taskListSelectFlag = true;
                $ocLazyLoad.load('./info/infoListCtrl.js').then(function () {
                    $scope.pageUrl = './info/infoList.html';
                });
            } else if (type === 'globalCheck') {
                $scope.taskListSelectFlag = false;
                $ocLazyLoad.load('./info/globalCheckCtrl.js').then(function () {
                    $scope.pageUrl = './info/globalCheckTpl.html';
                });
            }
        };
        /**
         * 初始化数据
         * @method showLoading
         * @author Niuxinyi
         * @date   2017-11-16
         * @return {undefined}
         */
        var initialize = function () {
            $scope.changePageUrl('limitInfo');
        };
        initialize();
        $scope.$on('$destroy', function () {

        });
    }
]);
