/**
 * Created by zhongxiaoming on 2017/1/12.
 * 批量选择结果
 */
angular.module('app').controller('BatchResultController', function ($scope) {
// 数据初始化;
    function initialize(data) {
        for (var i = 0, len = data.length; i < len; i++) {
            data[i].selected = false;
        }
        $scope.links = data;
    }
  
  // 选择
    $scope.selectItem = function (item) {
        if (!item.selected) {
            item.selected = true;
        } else {
            item.selected = false;
        }
    };
    var unbindHandler = $scope.$on('ReloadData', function (event, data) {
        initialize(data);
    });
    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
});
