angular.module('app').controller('relationInfoCtl', ['$scope', 'dsEdit', function ($scope, dsEdit) {
    var highlightCtrl = FM.mapApi.render.HighlightController.getInstance();

    $scope.showPoiInMap = function (pid) {
        $scope.$emit('Data-GetByPid', {
            pid: pid,
            geoLiveType: 'IXPOI',
            callback: function (data) {
                highlightCtrl.highlight(FM.dataApi.Feature.create(data));
                map.setView([data.geometry.coordinates[1], data.geometry.coordinates[0]]);
            }
        });
    };

    $scope.deleteParent = function (poi) {
        var param = {
            command: 'DELETE',
            dbId: App.Temp.dbId,
            type: 'IXPOIPARENT',
            objId: poi.pid
        };
        $scope.$emit('Data-Save', {
            param: param
        });
    };
}]);
