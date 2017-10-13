/**
 * Created by linglong on 2017/4/8.
 */
angular.module('app').controller('MainSameLinkController', ['$scope', function ($scope) {
    var eventController = new fastmap.uikit.EventController();
    $scope.same = {};
    /**
     * 初始化方法
     */
    var initializeData = function (data) {
        $scope.same.sameDisabledIndex = -1;
        $scope.same.sameLinkList = data;
        // 默认全选
        for (var i = 0; i < $scope.same.sameLinkList.length; i++) {
            $scope.same.sameLinkList[i].checked = true;
        }
    };

    $scope.changeSame = function () {
        eventController.fire(L.Mixin.EventTypes.CTRLPANELSELECTED, { data: $scope.same.sameLinkList });
    };
    /**
     * 保存
     */
    $scope.saveSame = function () {
        var data = $scope.same.sameLinkList;
        var i = 0;
        var len = 0;
        var types = {};
        var rdLink = 0;
        var adLink = 0;
        var zoneLink = 0;
        var luLink1 = 0;
        var luLink2 = 0;
        var resultArr = [];
        var sameNodePids = {}; // 用于记录同一点的pid
        for (i = 0; i < data.length; i++) {
            if (data[i].checked) {
                var obj = {};
                obj.linkPid = data[i].id;
                obj.type = data[i].featType;
                resultArr.push(obj);
                obj.isMain = 0;// 全部非主要素
                types[data[i].childFeatType] = '';// 用户记录node的类型
                sameNodePids[data[i].sameNodeEndPid] = true;
                sameNodePids[data[i].sameNodeStartPid] = true;
                if (data[i].childFeatType === 'RDLINK') {
                    rdLink++;
                } else if (data[i].childFeatType === 'ADLINK') {
                    adLink++;
                } else if (data[i].childFeatType === 'ZONELINK') {
                    zoneLink++;
                } else if (data[i].childFeatType === 'LULINK_1') {
                    luLink1++;
                } else if (data[i].childFeatType === 'LULINK_2') {
                    luLink2++;
                }
            }
        }

        if (rdLink > 0 && adLink > 0) { //  前检查 ‘道路不能和种别为国界的ADLINK制作同一线’
            for (i = 0; i < data.length; i++) {
                var temp = data[i];
                if (temp.featType == 'ADLINK' && temp.kind == '6') {
                    swal('提示', '道路不能和种别为国界的ADLINK制作同一线！', 'warning');
                    return;
                }
            }
        }

        if (Object.keys(sameNodePids).length !== 2) {
            swal('提示', '制作同一线的link两端Node必须位于相同的两对同一点关系中！', 'warning');
            return;
        }

        if (Object.keys(types).length < 2) {
            swal('提示', '同一线关系中,至少需要两种要素！', 'warning');
            return;
        }
        if (rdLink > 1) {
            swal('提示', '同一线关系中,rdLink必须只能选择1根！', 'warning');
            return;
        }
        if (adLink > 1) {
            swal('提示', '同一线关系中,adLink不能超过1个！', 'warning');
            return;
        }
        if (zoneLink > 1) {
            swal('提示', '同一线关系中,zoneLink不能超过1个！', 'warning');
            return;
        }
        if ((luLink1 + luLink2) > 2) {
            swal('提示', '同一线关系中,luLink不能超过2个！', 'warning');
            return;
        }

        resultArr[0].isMain = 1;// 默认第一个为主要素

        eventController.fire(L.Mixin.EventTypes.ADDRELATION, { data: resultArr });
    };

    var unbindHandler = $scope.$on('ReloadData-RdSameLinkPanel', function (event, data) {
        initializeData(data.data);
    });
    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
