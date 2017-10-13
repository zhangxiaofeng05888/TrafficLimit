/**
 * Created by linglong on 2016/8/10.
 */
angular.module('app').controller('rdCrossAlertNodeController', ['$scope', function ($scope) {
    var eventController = new fastmap.uikit.EventController();
    $scope.same = {};
    /**
     * 初始化方法
     */
    var initializeData = function (data) {
        $scope.rdCrossNodeGroupList = data;
    };
    /**
     * 切换主要素
     * @param index
     */
    $scope.selectNode = function (item) {
        eventController.fire(L.Mixin.EventTypes.CTRLPANELSELECTED, { data: item });
    };

    var unbindHandler = $scope.$on('ReloadData', function (event, data) {
        initializeData(data.data);
    });
    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
