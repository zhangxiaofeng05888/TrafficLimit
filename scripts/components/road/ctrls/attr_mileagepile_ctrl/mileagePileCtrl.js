/**
 * Created by linglong on 2016/8/15.
 */
angular.module('app').controller('mileagepileController', ['$scope', '$timeout', function ($scope, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.direct = [
        { id: 0, label: '不应用', isSelect: false },
        { id: 1, label: '上行(桩号由小到大)', isSelect: false },
        { id: 2, label: '下行(桩号由大到小)', isSelect: false }
    ];
    $scope.roadType = [
        { id: 1, label: '高速' },
        { id: 2, label: '国道' },
        { id: 3, label: '省道' }
    ];
    $scope.source = [
        { id: 1, label: '外业采集' },
        { id: 2, label: '内插制作' },
        { id: 3, label: '第三方' }
    ];

    // 初始化函数;
    $scope.initializeData = function () {
        $scope.mileagepile = objCtrl.data;
        var geo = {};
        geo.points = [];
        geo.points.push(fastmap.mapApi.point($scope.mileagepile.geometry.coordinates[0], $scope.mileagepile.geometry.coordinates[1]));
        geo.components = geo.points;
        geo.type = 'Mileagepile';
        selectCtrl.onSelected({
            geometry: geo,
            id: $scope.mileagepile.pid,
            linkPid: $scope.mileagepile.linkPid,
            type: 'Marker',
            direct: $scope.mileagepile.direct,
            point: $scope.mileagepile.geometry.coordinates
        });
    };

    // 里程桩道路名半角转全交
    $scope.roadNameToDBC = function () {
        $scope.mileagepile.roadName = Utils.ToDBC($scope.mileagepile.roadName);
    };
    // 里程桩路线编号半角转全交
    $scope.roadNumToDBC = function () {
        $scope.mileagepile.roadNum = Utils.ToDBC($scope.mileagepile.roadNum);
    };

    // form表单自定义验证提示
    $scope.mileagepileFormVildation = {
        rules: {
            mileageNum: {
                required: '里程桩编码不能为空',
                pattern: '里程桩编码不格式不正确'
            }
        }
    };

    var unbindHandler = $scope.$on('ReloadData', $scope.initializeData);

    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
