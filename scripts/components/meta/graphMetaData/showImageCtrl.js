/**
 * Created by mali on 2017/4/21.
 */
angular.module('app').controller('showImageCtrl', ['$scope',
    function ($scope) {
        var initPage = function () {
            $scope.originImage = $scope.ngDialogData.url;
        };

        initPage();
    }
]);
