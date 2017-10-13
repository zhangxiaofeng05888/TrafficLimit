/**
 * Created by linglong on 2016/12/22.
 */
angular.module('app').controller('namesOfLinkController', ['$scope', 'dsMeta', '$timeout', function ($scope, dsMeta, $timeout) {
    // 名称类型
    $scope.nameTypeOptions = [
        {
            id: 0,
            label: '普通'
        },
        {
            id: 1,
            label: '立交桥名(连接路)'
        },
        {
            id: 2,
            label: '立交桥名(主路)'
        },
        {
            id: 3,
            label: '风景路线'
        },
        {
            id: 4,
            label: '桥'
        },
        {
            id: 5,
            label: '隧道'
        },
        {
            id: 6,
            label: '虚拟名称'
        },
        {
            id: 7,
            label: '出口编号'
        },
        {
            id: 8,
            label: '编号名称'
        },
        {
            id: 9,
            label: '虚拟连接名称'
        },
        {
            id: 14,
            label: '点门牌'
        },
        {
            id: 15,
            label: '线门牌'
        }
    ];
    // 名称来源
    $scope.srcFlagOptions = [
        {
            id: 0,
            label: '0 现场道路名标牌'
        },
        {
            id: 1,
            label: '1 现场概略图'
        },
        {
            id: 2,
            label: '2 方向看板'
        },
        {
            id: 3,
            label: '3 旅游图'
        },
        {
            id: 4,
            label: '4 点门牌'
        },
        {
            id: 5,
            label: '5 线门牌'
        },
        {
            id: 6,
            label: '6 其他'
        },
        {
            id: 9,
            label: '9 来源无法确定'
        }
    ];
    // 路线属性
    $scope.routeAttOptions = [
        {
            id: 0,
            label: '0 工作中'
        },
        {
            id: 1,
            label: '1 上行'
        },
        {
            id: 2,
            label: '2 下行'
        },
        {
            id: 3,
            label: '3 环状'
        },
        {
            id: 4,
            label: '4 内环'
        },
        {
            id: 5,
            label: '5 外环'
        },
        {
            id: 9,
            label: '9 未定义'
        }
    ];
    $scope.roadTypeOptions = {
        0: '未区分',
        1: '高速',
        2: '国道',
        3: '铁路',
        4: '出口编号'
    };
    // 初始化分页数据;
    $scope.PageData = {
        currentPage: 1,
        pageNum: 20,
        totalPage: 1
    };

    var sortAsc = function (arr) {
        arr.sort(function (a, b) {
            return a.seqNum - b.seqNum;
        });
        return arr;
    };

    function getSeqNum(data) {
        var max = 0;
        var temp = [];
        temp = $scope.linkData.names.filter(function (item) {
            return (data.nameClass == item.nameClass);
        });
        for (var i = 0; i < temp.length; i++) {
            if (temp[i].seqNum > max && temp[i].$$hashKey != data.$$hashKey) {
                max = temp[i].seqNum;
            }
        }
        return max;
    }
    // 改变名称分类;
    $scope.changeNameClass = function (data, oldData) {
        if (data.nameGroupid) {
            data.seqNum = getSeqNum(data) + 1;
        }
        $scope.linkData.names.forEach(function (item) {
            if (oldData.nameClass == item.nameClass && item.seqNum > oldData.seqNum && oldData.seqNum != 0) {
                item.seqNum -= 1;
            }
        });
        // 重新排序;
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
    };

    // 从元数据库中获取道路名;
    function getAddress(name, currentPage) {
        if (name)$scope.PageData.searchValue = name;
        $scope.PageData.currentPage = currentPage;
        var nameParameter = {
            name: name,
            pageSize: $scope.PageData.pageNum,
            pageNum: $scope.PageData.currentPage,
            dbId: App.Temp.dbId
        };
        dsMeta.getNamesbyName(nameParameter).then(function (data) {
            if (data != -1) {
                $scope.PageData.totalPage = Math.ceil(data.data.total / $scope.PageData.pageNum);
                $scope.roadNames = data.data.data;
            }
        });
    }

    // 分页;
    $scope.flipPage = function (name, currentPage) {
        if (currentPage < 1) {
            currentPage = 1;
            return;
        } else if (currentPage > $scope.PageData.totalPage) {
            currentPage = $scope.PageData.totalPage;
            return;
        }
        getAddress(name, currentPage);
    };

    $scope.$watch('currentActiveRoadName.name', function (newValue, oldValue) {
        if (newValue && newValue.name) {
            if (!$scope.currentActiveRoadName.nameGroupid) {
                $scope.currentActiveRoadName.name = newValue.name;
                $scope.currentActiveRoadName.nameGroupid = newValue.nameId;
                $scope.currentActiveRoadName.seqNum = getSeqNum($scope.currentActiveRoadName) + 1;
            } else {
                $scope.currentActiveRoadName.name = newValue.name;
                $scope.currentActiveRoadName.nameGroupid = newValue.nameId;
            }
        }
        var timer;
        if (timer) $timeout.cancel(timer);
        if (newValue && (newValue != oldValue && (typeof oldValue != 'object'))) {
            timer = $timeout(function () {
                $scope.nameRight = false;
                getAddress(newValue, 1);
            }, 500);
        }
    });
}]);
