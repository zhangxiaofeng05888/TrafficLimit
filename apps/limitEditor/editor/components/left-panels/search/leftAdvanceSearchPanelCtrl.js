/**
 * Created by lingLong on 2017/1/12.
 * 批量选择结果
 */
angular.module('app').controller('AdvanceSearchController', function ($scope, dsFcc, NgTableParams) {
    //  面板加载时，复选框默认全部选中
    var sceneController = fastmap.mapApi.scene.SceneController.getInstance();
    var selectBox = function () {
        var rows = $scope.results.rows;

        for (var i = 0, len = rows.length; i < len; i++) {
            rows[i].checked = true;
        }
    };

    $scope.copyToLine = function () {
        var linkData = $scope.results;
        var links = [];
        for (var i = 0; i < linkData.rows.length; i++) {
            if (linkData.rows[i].checked) {
                for (var j = 0; j < linkData.rows[i].links.length; j++) {
                    links.push(linkData.rows[i].links[j].pid);
                }
            }
        }
        if (links.length === 0) {
            swal('提示', '请先选择一个道路名进行复制', 'warning');
            return;
        }
        var params = {
            type: 'SCPLATERESLINK',
            command: 'CREATE',
            dbId: App.Temp.dbId,
            data: {
                groupId: App.Temp.groupId,
                links: links
            }
        };
        dsFcc.copyToLine(params).then(function (data) {
            if (data !== -1) {
                swal('提示', '复制成功', 'success');
                sceneController.redrawLayerByGeoLiveTypes(['COPYTOLINE']);
            }
        });
    };

    $scope.copyToPolygon = function () {
        var linkData = $scope.results;
        var links = [];
        for (var i = 0; i < linkData.rows.length; i++) {
            if (linkData.rows[i].checked) {
                for (var j = 0; j < linkData.rows[i].links.length; j++) {
                    links.push(linkData.rows[i].links[j].pid);
                }
            }
        }
        if (links.length === 0) {
            swal('提示', '请先选择一个道路名进行复制', 'warning');
            return;
        }
        var params = {
            type: 'SCPLATERESFACE',
            command: 'CREATE',
            dbId: App.Temp.dbId,
            data: {
                groupId: App.Temp.groupId,
                rdlinks: links
            }
        };
        dsFcc.copyToLine(params).then(function (data) {
            if (data !== -1) {
                swal('提示', '复制成功', 'success');
                sceneController.redrawLayerByGeoLiveTypes(['COPYTOPOLYGON']);
            }
        });
    };

    var initialize = function (event, data) {
        $scope.results = data.data;
        $scope.selectedNums = $scope.results.rows.length;
        selectBox();
    };

    $scope.highlightRoad = function (item) {
        //  todo
    };

    $scope.refreshSelectedNums = function (item) {
        item.checked ? $scope.selectedNums++ : $scope.selectedNums--;
    };

    // 关闭搜索面板;
    $scope.closeAdvanceSearchPanel = function () {
        $scope.$emit('closeLeftFloatAdvanceSearchPanel');
    };

    $scope.$on('AdvancedSearchPanelReload', initialize);
});
