angular.module('app').controller('EditHistoryCtl', ['$scope', function ($scope) {
    $scope.theadInfo = ['序号', '作业员', '操作时间', '操作描述', '平台'];
    $scope.editHistory = [];

    function kindName(kindCode) {
        var tmp = $scope.metaData.kindFormat[kindCode];
        if (tmp) {
            return tmp.kindName;
        }
        return kindCode;
    }

    /* 解析操作描述*/
    function getOperDesc(oldContent) {
        var oldVal;
        var msg;
        var keys = Object.getOwnPropertyNames(oldContent);
        for (var i = 0; i < keys.length; i++) {
            var attr = keys[i];
            msg = '修改了【' + FM.dataApi.Constant.CODE_NAME_MAPPING[attr] + '】';
            if (!oldContent[attr]) {
                oldVal = '（空）';
            } else if (attr == 'kindCode') {
                oldVal = kindName(oldContent[attr]);
            } else if (attr == 'open24h') {
                oldVal = oldContent[attr] == 2 ? '否' : '是';
            } else {
                oldVal = oldContent[attr];
            }
            if (attr != 'brands') {
                msg += '，修改前：' + oldVal;
            }
        }
        return msg;
    }

    function initData() {
        /* 重组履历数据*/
        for (var i = 0, len = $scope.poi.editHistoryData.mergeContents.length; i < len; i++) {
            var hisTemp = {};
            hisTemp.name = $scope.poi.editHistoryData.operator.name;
            hisTemp.mergeDate = $scope.poi.editHistoryData.mergeFormateData;
            hisTemp.sourceName = FM.dataApi.Constant.CODE_SOURCE_NAME[$scope.poi.editHistoryData.sourceName];
            hisTemp.operDesc = getOperDesc(Utils.stringToJson($scope.poi.editHistoryData.mergeContents[i].oldValue));
            $scope.editHistory.push(hisTemp);
        }
    }
    if ($scope.poi.editHistoryData) {
        initData();
    }
}]);
