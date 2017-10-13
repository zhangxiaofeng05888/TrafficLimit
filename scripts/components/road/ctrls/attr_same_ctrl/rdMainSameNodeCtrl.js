/**
 * Created by linglong on 2016/8/10.
 */
angular.module('app').controller('SameRelationshapController', ['$scope', function ($scope) {
    var eventController = new fastmap.uikit.EventController();
    $scope.same = {};
    /**
     * 初始化方法
     */
    var initializeData = function (data) {
        $scope.same.sameDisabledIndex = -1;
        $scope.same.sameNodeList = data;
        // 默认全选
        for (var i = 0; i < $scope.same.sameNodeList.length; i++) {
            $scope.same.sameNodeList[i].checked = true;
        }
    };
    /**
     * 切换主要素
     * @param index
     */
    $scope.changeSameMain = function (index) {
        // 全部设置为非主要素
        for (var i = 0; i < $scope.same.sameNodeList.length; i++) {
            if (i == index) {
                $scope.same.sameNodeList[i].isMain = 1;
                $scope.same.sameNodeList[i].checked = true;
            } else {
                $scope.same.sameNodeList[i].isMain = 0;
            }
        }
        $scope.same.sameDisabledIndex = index;
        eventController.fire(L.Mixin.EventTypes.CTRLPANELSELECTED, { data: $scope.same.sameNodeList });
    };
    /*
    * 选择同一要素
    * */
    $scope.changeSame = function () {
        eventController.fire(L.Mixin.EventTypes.CTRLPANELSELECTED, { data: $scope.same.sameNodeList });
    };
    /*
    * 创建同一点要素;
    * */
    $scope.saveSame = function () {
        var data = $scope.same.sameNodeList;
        var types = {};
        var rdNode = 0;
        var adNode = 0;
        var zoneNode = 0;
        var luNode1 = 0;
        var luNode2 = 0;
        var rwNode = 0;
        var resultArr = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].checked) {
                var obj = {};
                obj.nodePid = data[i].id;
                obj.isMain = data[i].isMain;
                obj.type = data[i].featType;
                resultArr.push(obj);
                types[data[i].featType] = '';// 用户记录node的类型
                if (data[i].featType === 'RDNODE') {
                    rdNode++;
                } else if (data[i].featType === 'ADNODE') {
                    adNode++;
                } else if (data[i].featType === 'ZONENODE') {
                    zoneNode++;
                } else if (data[i].featType === 'LUNODE_1') {
                    luNode1++;
                } else if (data[i].featType === 'LUNODE_2') {
                    luNode2++;
                } else if (data[i].featType === 'RWNODE') {
                    rwNode++;
                }
            }
        }

        if (!($scope.same.sameDisabledIndex >= 0)) {
            swal('提示', '必须选择主要素！', 'warning');
            return;
        }
        if (Object.keys(types).length < 2) {
            // 有一种特殊情况排除在外，就只当值选择了luNode，并且符合后面代码的规则时，也是可以做同一点的
            if (!(resultArr[0].type === 'LUNODE')) {
                swal('提示', '同一点关系中,至少需要两种要素！', 'warning');
                return;
            }
        }
        if (rdNode > 5) {
            swal('提示', '同一点关系中,RDNODE不能超过5个！', 'warning');
            return;
        }
        if (adNode > 1) {
            swal('提示', '同一点关系中,ADNODE不能超过1个！', 'warning');
            return;
        }
        if (rwNode > 1) {
            swal('提示', '同一点关系中,RWNODE不能超过1个！', 'warning');
            return;
        }
        if (zoneNode > 10) {
            swal('提示', '同一点关系中,ZONENODE不能超过10个！', 'warning');
            return;
        }
        if (luNode1 + luNode1 > 2) {
            swal('提示', '同一点关系中,LUNODE不能超过2个！', 'warning');
            return;
        }
        eventController.fire(L.Mixin.EventTypes.ADDRELATION, { data: resultArr });
    };

    var unbindHandler = $scope.$on('ReloadData-RdSameNodePanel', function (event, data) {
        initializeData(data.data);
    });
    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
}]);
