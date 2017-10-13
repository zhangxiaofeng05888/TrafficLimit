/**
 * Created by zhaohang on 2016/4/5.
 */
var adLinkApp = angular.module('app');
adLinkApp.controller('adLinkController', ['$scope', 'dsEdit', function ($scope, dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var adLink = layerCtrl.getLayerById('adLink');
    var adNode = layerCtrl.getLayerById('adNode');
    var adFace = layerCtrl.getLayerById('adFace');
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.kind = [
        { id: 0, label: '行政假想线' },
        { id: 1, label: '省,直辖市边界' },
        { id: 2, label: '市行政区界' },
        { id: 3, label: '区县边界' },
        { id: 4, label: '乡镇边界' },
        { id: 5, label: '村边界' },
        { id: 6, label: '国界' },
        { id: 7, label: '百万产品范围框' }

    ];
    $scope.form = [
        { id: 0, label: '未调查' },
        { id: 1, label: '无属性' },
        { id: 2, label: '海岸线' },
        { id: 6, label: '特别行政区界(K)' },
        { id: 7, label: '特别行政区界(G)' },
        { id: 8, label: '未定行政区划界' },
        { id: 9, label: '南海诸岛范围线' }

    ];
    $scope.scale = [
        { id: 0, label: '2.5w' },
        { id: 1, label: '20w' },
        { id: 2, label: '100w' }
    ];

    // 初始化
    $scope.initializeData = function () {
        $scope.adLinkData = objCtrl.data;
        // 回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if ($scope.adLinkForm) {
            $scope.adLinkForm.$setPristine();
        }
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());// 存储原始数据
        var linkArr = $scope.adLinkData.geometry.coordinates;
        var points = [];
        for (var i = 0, len = linkArr.length; i < len; i++) {
            var pointOfLine = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
            points.push(pointOfLine);
        }
        var line = fastmap.mapApi.lineString(points);
        selectCtrl.onSelected({// 存储选择数据信息
            geometry: line,
            id: $scope.adLinkData.pid,
            type: 'Link',
            direct: $scope.adLinkData.direct,
            snode: $scope.adLinkData.sNodePid,
            enode: $scope.adLinkData.eNodePid
        });
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());// 存储原始数据
    };

    $scope.changeAdlinkKind = function () {
        if ([0, 1, 2, 4].indexOf($scope.adLinkData.kind) != -1) {
            $scope.adLinkData.form = 1;
        }
    };

    if (objCtrl.data) {
        $scope.initializeData();
    }

    // 监听保存，修改,删除，取消，和初始化
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeData);
}]);
