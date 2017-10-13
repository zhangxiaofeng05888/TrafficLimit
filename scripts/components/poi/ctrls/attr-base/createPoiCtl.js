var addDirectOfRest = angular.module('app');
addDirectOfRest.controller('createPoiCtrl', function ($scope, $timeout) {
    var eventController = fastmap.uikit.EventController();

    $scope.objChange = function (flag) {
        $scope.name = FM.Util.ToDBC($scope.name);
        eventController.fire(eventController.eventTypes.PARTSSELECTEDCHANGED, {
            name: $scope.name,
            kindCode: $scope.kindCode
        });
        if (flag === 2) {
            $timeout(function () { // 必须要使用timeout，否则光标去不了
                $('#editorMap').focus();
            });
        }
    };

    var unbindHandler = $scope.$on('ReloadData', function (event, obj) {
        $scope.name = obj.name;
        $scope.kindCode = obj.kindCode;
    });

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
});
