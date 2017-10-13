/**
 * Created by zhaohang on 2016/12/6.
 */
angular.module('app').controller('taskHistoryCtrl', ['$scope', 'dsManage', function ($scope, dsManage) {
    $scope.taskHistoryData = [];
    var param = {
        platForm: 1,
        snapshot: 1,
        status: 0,
        pageSize: 1000
    };
    dsManage.getSubtaskListByUser(param).then(function (item) {
        var data = item.data.result;
        for (var i = 0; i < data.length; i++) {
            switch (data[i].type) {
                case 0:
                    data[i].type = 'POI子任务';
                    break;
                case 1:
                    data[i].type = '道路子任务';
                    break;
                case 2:
                    data[i].type = '一体化子任务';
                    break;
                case 3:
                    data[i].type = '一体化_GRID粗编子任务';
                    break;
                case 4:
                    data[i].type = '一体化_区域粗编子任务';
                    break;
                case 5:
                    data[i].type = '多源POI子任务';
                    break;
                case 6:
                    data[i].type = '代理店子任务';
                    break;
                case 7:
                    data[i].type = 'POI专项子任务';
                    break;
                case 8:
                    data[i].type = '道路_GRID精编子任务';
                    break;
                case 9:
                    data[i].type = '道路_GRID粗编子任务';
                    break;
                case 10:
                    data[i].type = '道路区域专项子任务';
                    break;
                default:
                    break;
            }
            data[i].planStartDate = Utils.dateFormat(data[i].planStartDate);
            data[i].planEndDate = Utils.dateFormat(data[i].planEndDate);
        }
        $scope.taskHistoryData = data;
    });
}]);
