/**
 * Created by liwanchong on 2016/3/2.
 */
angular.module('app').controller('namesOfRwLinkController', ['$scope', '$timeout', 'dsMeta', function ($scope, $timeout, dsMeta) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();

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
            $scope.currentActiveRoadName.name = newValue.name;
            $scope.currentActiveRoadName.nameGroupid = newValue.nameId;
        }
        var timer;
        if (timer) $timeout.cancel(timer);
        if (newValue && (newValue != oldValue && (typeof oldValue != 'object'))) {
            timer = $timeout(function () {
                getAddress(newValue, 1);
            }, 500);
        }
    });
}]);
