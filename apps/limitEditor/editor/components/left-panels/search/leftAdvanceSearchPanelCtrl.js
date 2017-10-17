/**
 * Created by lingLong on 2017/1/12.
 * 批量选择结果
 */
angular.module('app').controller('AdvanceSearchController', function ($scope, dsEdit, NgTableParams) {
    //  面板加载时，复选框默认全部选中
    var selectBox = function () {
        var rows = $scope.results.rows;

        for (var i = 0, len = rows.length; i < len; i++) {
            rows[i].checked = true;
        }
    };

    var initialize = function (event, data) {
        $scope.results = data.data;
        $scope.selectedNums = $scope.results.rows.length;
        selectBox();
    };

    $scope.highlightRoad = function (item) {
        //  todo
    };

    $scope.refreshSelectedNums = function (item) {
        item.checked ? $scope.selectedNums++ : $scope.selectedNums--;
    };

    // 关闭搜索面板;
    $scope.closeAdvanceSearchPanel = function () {
        $scope.$emit('closeLeftFloatAdvanceSearchPanel');
    };

    $scope.$on('AdvancedSearchPanelReload', initialize);
});
