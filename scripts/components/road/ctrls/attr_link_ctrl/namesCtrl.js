/**
 * Created by linglong on 2016/12/22.
 */
angular.module('app').controller('nameController', function ($scope) {
    // 名称分类
    $scope.nameClass = {
        1: '官方',
        2: '别名',
        3: '曾用'
    };

    var sortAsc = function (arr) {
        arr.sort(function (a, b) {
            return a.seqNum - b.seqNum;
        });
        return arr;
    };

    var initializeLinkData = function () {
        var tempArr = [[], [], []];
        $scope.linkData.names.forEach(function (item) {
            tempArr[item.nameClass - 1].push(item);
        });
        for (var i = 0; i < tempArr.length; i++) {
            if (tempArr[i].length) {
                tempArr[i] = sortAsc(tempArr[i]);
            }
        }
        $scope.linkData.names = tempArr[0].concat(tempArr[1]).concat(tempArr[2]);
        $scope.currentActiveRoadName = null;                // 当前选中的名称数据(会在子ctrl用到);
    };

    // 选中行进行名称编辑时更新当前数据以及索引;
    $scope.rememberNameNum = function (data) {
        $scope.currentActiveRoadName = data;
    };

    // 增加名称数据;
    $scope.addRoadLinkName = function () {
        if ([1, 2, 3].indexOf($scope.linkData.kind) != -1) {
            $scope.linkData.names.push(FM.dataApi.rdLinkName(
                { linkPid: $scope.linkData.pid, nameClass: 0, seqNum: 0, code: 1 }
            ));
        } else {
            $scope.linkData.names.push(FM.dataApi.rdLinkName(
                { linkPid: $scope.linkData.pid, nameClass: 0, seqNum: 0 }
            ));
        }
    };

    // 删除名称数据;
    $scope.deleteLinkName = function (data) {
        $scope.linkData.names = $scope.linkData.names.filter(function (item) {
            return item.$$hashKey != data.$$hashKey;
        });
        $scope.linkData.names.forEach(function (item) {
            if (data.seqNum) {
                if (item.nameClass == data.nameClass && item.seqNum > data.seqNum) {
                    item.seqNum -= 1;
                }
            }
        });
    };

    // 数据拖动的处理;
    $scope.onDropComplete = function (index, obj, evt, parentUl) {
        // 防止不同类别之前拖动排序;
        var findRes = angular.element(angular.element.find(parentUl)).children('.linkName_li_checked');
        if (!findRes.length || !obj.nameGroupid) {
            return;
        }
        var tempIndex = 0;
        $scope.linkData.names.forEach(function (data) {
            if (obj.nameClass == 2) {
                if (data.nameClass == 1) {
                    tempIndex++;
                }
            }
            if (obj.nameClass == 3) {
                if (data.nameClass != 3) {
                    tempIndex++;
                }
            }
        });
        // 重新排序
        var idx = $scope.linkData.names.indexOf(obj);
        var tempNum = obj.seqNum;
        obj.seqNum = index + 1;
        if (obj.nameClass == 1) {
            index = 0 + index;
        } else {
            index = tempIndex + index;
        }
        if (!$scope.linkData.names[index].nameGroupid) {
            obj.seqNum = tempNum;
            return;
        }
        $scope.linkData.names.splice(idx, 1);
        $scope.linkData.names.splice(index, 0, obj);
        if (index > idx) {
            for (var i = idx; i < index; i++) {
                $scope.linkData.names[i].seqNum -= 1;
            }
        } else if (index < idx) {
            for (var j = index + 1; j <= idx; j++) {
                $scope.linkData.names[j].seqNum += 1;
            }
        }
    };

    initializeLinkData();
    var unbindHandler = $scope.$on('ReloadData', initializeLinkData);
    $scope.$on('$destroy', function () {
        unbindHandler = null;
    });
});
