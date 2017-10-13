/**
 * Created by mali on 2016/6/1.
 */
angular.module('app').controller('hotelCtl', ['$scope', 'dsMeta', function ($scope, dsMeta) {
    // $scope.hotel = $scope.poi.hotels[0];
    $scope.reting = FM.dataApi.Constant.RETING;

    // $scope.changeLevel = function () {
    //     var rat = $scope.poi.hotels[0].rating;
    //     if (rat == 5 || rat == 15 || rat == 4 || rat == 14 || rat == 6) {
    //         $scope.rootCommonTemp.levelArr = ['A'];
    //         $scope.poi.level = 'A';
    //     } else {
    //         $scope.rootCommonTemp.levelArr = ['B1'];
    //         $scope.poi.level = 'B1';
    //     }
    // };
    $scope.changeLevel = function () {
        var ratingVal = 0;
        if ($scope.poi.hotels.length > 0) {
            ratingVal = $scope.poi.hotels[0].rating;
        }
        var param = {
            dbId: App.Temp.dbId,
            pid: $scope.poi.pid,
            poi_num: $scope.poi.poiNum,
            kindCode: $scope.poi.kindCode,
            chainCode: $scope.poi.chain,
            name: $scope.poi.name.name,
            rating: ratingVal,
            level: $scope.poi.level
        };
        dsMeta.queryLevel(param).then(function (data) {
            $scope.rootCommonTemp.levelArr = [];
            if (data.values) {
                if (data.values && data.values.indexOf('|') > -1) {
                    $scope.rootCommonTemp.levelArr = data.values.split('|');
                    $scope.poi.level = data.defaultVal;
                } else {
                    $scope.rootCommonTemp.levelArr.push(data.values);
                    $scope.poi.level = data.defaultVal;
                }
            } else {
                swal('提示', '等级信息查询出错！', 'warning');
            }
        });
    };
}]);
