/**
 * Created by liuzhe on 2016/7/22.
 */
angular.module('app').controller('CmgBuildFaceCtrl', ['$scope', 'dsEdit', 'dsMeta', 'appPath', '$filter', '$ocLazyLoad', function ($scope, dsEdit, dsMeta, appPath, $filter, $ocLazyLoad) {
    var objCtrl = fastmap.uikit.ObjectEditController();

    $scope.heightAcuracyOpt = [
        { id: 0, label: '未调查' },
        { id: 0.5, label: '0.5米' },
        { id: 1, label: '1米' },
        { id: 5, label: '5米' },
        { id: 10, label: '10米' }
    ];

    $scope.heightSourceOpt = [
        { id: 1, label: '计算' },
        { id: 2, label: '外业采集' },
        { id: 3, label: '第三方' },
        { id: 4, label: '估算' },
        { id: 5, label: '网络' }
    ];

    $scope.dataSourceOpt = [
        { id: 1, label: '自动提取' },
        { id: 2, label: '外业' },
        { id: 3, label: '第三方' },
        { id: 4, label: '估计' }
    ];

    $scope.wallMaterialOpt = [
        { id: 1, label: '未调查' },
        { id: 2, label: '砖' },
        { id: 3, label: '混凝土' },
        { id: 4, label: '波纹金属' },
        { id: 5, label: '涂料' },
        { id: 6, label: '块石' },
        { id: 7, label: '壁板' },
        { id: 8, label: '玻璃' },
        { id: 9, label: '其他' }
    ];

    function getSeqNum(topos) {
        var seqNums = '';
        var tmpArr = [];

        for (var i = 0, len = topos.length; i < len; i++) {
            tmpArr.push(topos[i].seqNum);
        }
        seqNums = tmpArr.join(',');

        return seqNums;
    }

    function getLinkPid(topos) {
        var linkPids = '';
        var tmpArr = [];

        for (var i = 0, len = topos.length; i < len; i++) {
            tmpArr.push(topos[i].linkPid);
        }
        linkPids = tmpArr.join(',');

        return linkPids;
    }

    // 初始化
    $scope.initializeData = function () {
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());// 存储原始数据
        $scope.CmgBuildFaceData = objCtrl.data;// 获取数据

        $scope.options = {
            area: $scope.CmgBuildFaceData.area.toFixed(2),
            perimeter: $scope.CmgBuildFaceData.perimeter.toFixed(2),
            seqNum: getSeqNum($scope.CmgBuildFaceData.topos),
            linkPid: getLinkPid($scope.CmgBuildFaceData.topos)
        };
    };

    $scope.$on('ReloadData', $scope.initializeData);
}]);
