/**
 * Created by zhaohang on 2017/10/12.
 */
angular.module('app').controller('infoListPanelCtl', ['$window', '$scope', '$timeout', 'NgTableParams', 'dsFcc', 'appPath', 'dsEdit',
    function ($window, $scope, $timeout, NgTableParams, dsFcc, appPath, dsEdit) {
        var infoData = App.Temp.infoToGroupData;
        var groupId = App.Temp.groupId;

        $scope.groupId = groupId;
        $scope.cityName = infoData.cityName;

        var typeJson = {
            1: '新增',
            2: '删除',
            3: '修改',
            4: '已制作'
        };

        var paramGroup = {
            type: 'SCPLATERESGROUP',
            condition: {
                adminArea: infoData.cityId,
                groupId: groupId
            }
        };

        dsFcc.getGroupList(paramGroup).then(function (res) {
            if (res !== -1) {
                var item = res.data[0]; //  主键查询，查询成功只会有一条数据
                $scope.groupType = typeJson[item.groupType];
                $scope.principle = item.principle;
            }
        });

        var paramInfo = {
            type: 'SCPLATERESINFO',
            condition: {
                adminArea: infoData.cityId,
                infoIntelId: infoData.infoId,
                pageSize: 20,
                pageNum: 1
            }
        };

        dsFcc.getInfoListData(paramInfo).then(function (res) {
            if (res !== -1) {
                var item = res.data[0]; //  主键查询，查询成功只会有一条数据
                $scope.infoCode = item.infoCode;
                $scope.url = item.url;
                $scope.newsTime = item.newsTime;
                $scope.infoContent = item.infoContent;
                $scope.condition = item.condition === 'S' ? '长期' : '短期';
            }
        });

        var initialize = function () {
            //  貌似用不到，作为预留
        };

        // 关闭面板;
        $scope.closePanel = function () {
            $scope.$emit('closeLeftInfoListPanel');
        };

        var unbindHandler = $scope.$on('infoListPanelReload', initialize);

        $scope.$on('$destroy', function () {
            unbindHandler = null;
        });
    }
]);
