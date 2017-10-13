/**
 * Created by mali on 2016/7/22.
 */
angular.module('app').controller('luLinkController', ['$scope', 'dsEdit', '$ocLazyLoad', function ($scope, dsEdit, $ocLazyLoad) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var luLink = layerCtrl.getLayerById('luLink');
    var luNode = layerCtrl.getLayerById('luNode');
    var luFace = layerCtrl.getLayerById('luFace');
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.kindOpt = [
        { id: 0, label: '未分类', isCheck: false },
        { id: 1, label: '大学', isCheck: false },
        { id: 2, label: '购物中心', isCheck: false },
        { id: 3, label: '医院', isCheck: false },
        { id: 4, label: '体育场', isCheck: false },
        { id: 5, label: '公墓', isCheck: false },
        { id: 6, label: '地上停车场', isCheck: false },
        { id: 7, label: '工业区', isCheck: false },
        { id: 8, label: '假想线', isCheck: false },
        { id: 11, label: '机场范围线', isCheck: false },
        { id: 12, label: '机场跑到边线', isCheck: false },
        { id: 21, label: 'BUA边界线', isCheck: false },
        { id: 22, label: '邮区边界线', isCheck: false },
        { id: 23, label: 'FM面边界线', isCheck: false },
        { id: 24, label: '车厂', isCheck: false },
        { id: 30, label: '休闲娱乐', isCheck: false },
        { id: 31, label: '景区', isCheck: false },
        { id: 32, label: '会展中心', isCheck: false },
        { id: 33, label: '火车站', isCheck: false },
        { id: 34, label: '文化场馆', isCheck: false },
        { id: 35, label: '商务区', isCheck: false },
        { id: 36, label: '商业区', isCheck: false },
        { id: 37, label: '小区', isCheck: false },
        { id: 38, label: '广场', isCheck: false },
        { id: 39, label: '特色区域', isCheck: false },
        { id: 40, label: '地下停车场', isCheck: false },
        { id: 41, label: '地铁出入口面', isCheck: false }
    ];


    // 初始化
    $scope.initializeData = function () {
        $scope.luLinkData = objCtrl.data;
        $ocLazyLoad.load('../../scripts/components/road/ctrls/attr_lu_ctrl/luKindCtrl.js');
        $scope.initialForms();
        // 回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if ($scope.luLinkForm) {
            $scope.luLinkForm.$setPristine();
        }
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());// 存储原始数据
        var linkArr = $scope.luLinkData.geometry.coordinates;
        var points = [];
        for (var i = 0, len = linkArr.length; i < len; i++) {
            var pointOfLine = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
            points.push(pointOfLine);
        }
        var line = fastmap.mapApi.lineString(points);
        selectCtrl.onSelected({// 存储选择数据信息
            geometry: line,
            id: $scope.luLinkData.pid,
            type: 'Link',
            direct: $scope.luLinkData.direct,
            snode: $scope.luLinkData.sNodePid,
            enode: $scope.luLinkData.eNodePid
        });
    };

    $scope.initialForms = function () {
        $scope.showData = [];
        // 显示选中的中别;
        for (var i = 0; i < $scope.kindOpt.length; i++) {
            for (var j = 0; j < $scope.luLinkData.linkKinds.length; j++) {
                if ($scope.luLinkData.linkKinds[j].kind == $scope.kindOpt[i].id) {
                    $scope.kindOpt[i].isCheck = true;
                    $scope.showData.push($scope.kindOpt[i]);
                }
            }
        }
    };
    objCtrl.objRefresh = function () {
        $scope.initialForms();
    };

    if (objCtrl.data) {
        $scope.initializeData();
    }
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeData);
}]);
