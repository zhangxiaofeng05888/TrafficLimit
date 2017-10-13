/**
 * Created by linglong on 2016/12/29.
 */
angular.module('app').controller('linkZoneController', ['$scope', function ($scope) {
    $scope.removeZone = function (data) {
        $scope.linkData.zones = $scope.linkData.zones.filter(function (item) {
            return item.rowId != data.rowId;
        });
    };
}]);
