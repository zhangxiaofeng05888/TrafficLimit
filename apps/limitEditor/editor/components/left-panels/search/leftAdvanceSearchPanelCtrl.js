/**
 * Created by lingLong on 2017/1/12.
 * 批量选择结果
 */
angular.module('app').controller('AdvanceSearchController', function ($scope, dsFcc, NgTableParams) {
    var sceneController = fastmap.mapApi.scene.SceneController.getInstance();
    var symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();
    var symbol = symbolFactory.getSymbol('pt_poiCreateLoc');
    var feedbackCtrl = fastmap.mapApi.FeedbackController.getInstance();

    var feedback = new fastmap.mapApi.Feedback();
    feedbackCtrl.add(feedback);

    var clearFeedback = function () {
        feedback.clear();
        feedbackCtrl.refresh();
    };

    var selectBox = function () {   //  面板加载时，复选框默认全部选中
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
        $scope.highlightRoad($scope.results.rows[0]);   //  默认高亮第一条数据
    };

    $scope.highlightRoad = function (item) {
        var len = item.links.length;
        if (len === 0) {
            return;
        }

        $scope.$emit('LocateObject', { feature: item.links[0] });  //  定位到第一个点的位置

        feedback.clear();

        for (var i = 0; i < len; i++) {
            feedback.add(item.links[i].geometry, symbol);
        }

        feedbackCtrl.refresh();
    };

    $scope.refreshSelectedNums = function (item) {
        item.checked ? $scope.selectedNums++ : $scope.selectedNums--;
    };

    // 关闭搜索面板;
    $scope.closeAdvanceSearchPanel = function () {
        $scope.$emit('closeLeftFloatAdvanceSearchPanel');
    };

    var unbindHandler = $scope.$on('AdvancedSearchPanelReload', initialize);

    $scope.$on('$destroy', function () {
        clearFeedback();
        feedbackCtrl.del(feedback);
        unbindHandler = null;
    });
});
