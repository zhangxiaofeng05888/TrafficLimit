angular.module('app').controller('fcAttrCtrl', ['$scope', function ($scope) {
    var objectEditCtrl = FM.uikit.ObjectEditController();
    var fcTipsSubTaskId = FM.uikit.ObjectEditController().data.source.s_project;
    var trackinfoLength = FM.uikit.ObjectEditController().data.track.t_trackInfo.length;
    $scope.inputExpress = !(fcTipsSubTaskId == App.Temp.subTaskId && trackinfoLength == 0);
    $scope.selectLevel = function (level) {
        $scope.level = level;
        objectEditCtrl.data.deep.fc = level;
    };
    $scope.initialize = function () {
        $scope.fc = objectEditCtrl.data;
        if ($scope.fc.feedback.f_array && $scope.fc.feedback.f_array.length > 0) {
            for (var i = 0; i < $scope.fc.feedback.f_array.length; i++) {
                if ($scope.fc.feedback.f_array[i].type == 3) {
                    $scope.fc.content = $scope.fc.feedback.f_array[i].content;
                }
            }
        }
        $scope.level = objectEditCtrl.data.deep.fc;
    };
    var unbindHandler = $scope.$on('ReloadData', $scope.initialize);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
