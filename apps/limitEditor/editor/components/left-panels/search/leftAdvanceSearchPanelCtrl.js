/**
 * Created by lingLong on 2017/1/12.
 * 批量选择结果
 */
angular.module('app').controller('AdvanceSearchController', function ($scope, dsFcc, NgTableParams) {
    $scope.resultsCheckAll = false;
    var minEditZoom = App.Config.map.layerZoom.minEditZoom || 17;
    var map = window.map;
    var testEditZoom = function () {
        if (map.getZoom() < minEditZoom) {
            swal('提示', '地图缩放等级在' + minEditZoom + '级以上才可操作', 'info');
            return false;
        }
        return true;
    };
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

    $scope.selectAll = function () {  // 全选
        var rows = $scope.results.rows;
        for (var i = 0, len = rows.length; i < len; i++) {
            rows[i].checked = $scope.resultsCheckAll;
        }
    };

    $scope.copyToLineAndPolygon = function () {
        $scope.copyToLine($scope.copyToPolygon);
    };

    $scope.copyToLine = function (fn) {
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
            if (data === '属性值未发生变化') {
                swal('提示', '重复复制，请重新选择', 'warning');
                return;
            }
            if (data !== -1) {
                swal('提示', '复制成功', 'success');
                if (fn) {
                    fn();
                }
                sceneController.redrawLayerByGeoLiveTypes(['COPYTOLINE']);
                $scope.closeAdvanceSearchPanel();
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
            if (data === '属性值未发生变化') {
                swal('提示', '重复复制，请重新选择', 'warning');
                return;
            }
            if (data !== -1) {
                swal('提示', '复制成功', 'success');
                sceneController.redrawLayerByGeoLiveTypes(['COPYTOPOLYGON']);
                $scope.closeAdvanceSearchPanel();
            }
        });
    };

    var initialize = function (event, data) {
        $scope.results = data.data;
        $scope.selectedNums = $scope.results.rows.length;
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

    $scope.trackLine = function () {
        if (!testEditZoom()) {
            return;
        }
        $scope.$emit('Map-EnableTool', {
            operation: 'Create'
        });

        var linkData = $scope.results;
        var links = [];
        for (var i = 0; i < linkData.rows.length; i++) {
            if (linkData.rows[i].checked) {
                for (var j = 0; j < linkData.rows[i].links.length; j++) {
                    links.push(linkData.rows[i].links[j].pid);
                }
            }
        }

        var factory = fastmap.uikit.editControl.EditControlFactory.getInstance();
        var startupToolControl = factory.trackToolControl(map, 'TRACKLINE', links);

        if (!startupToolControl) {
            swal('提示', '编辑流程未实现', 'info');
            return;
        }

        startupToolControl.run();

        $scope.$emit('Map-ToolEnabled');
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
