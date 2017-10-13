/**
 * Created by zhaohang on 2017/7/12.
 */
fastmap.uikit.editControl.UpdateQualityCircleControl = fastmap.uikit.editControl.EditControl.extend({
    initialize: function (map, geoLiveType) {
        fastmap.uikit.editControl.EditControl.prototype.initialize.call(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.geoLiveType = geoLiveType;
        this.feedbackController = fastmap.mapApi.FeedbackController.getInstance();
        this.defaultFeedback = new fastmap.mapApi.Feedback();
        this.feedbackController.add(this.defaultFeedback);
        this.shapeEditor = fastmap.uikit.shapeEdit.ShapeEditor.getInstance();
        this.dataService = fastmap.service.DataServiceEdit.getInstance();
        this.drawCircle = fastmap.DrawCircle.getInstance();
        this.geometryAlgorithm = fastmap.mapApi.geometry.GeometryAlgorithm.getInstance();
        this.symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();
        this.toolController.addTool(new fastmap.uikit.complexEdit.SelectQualityCircleTool());
        this.qualityId = 0;
    },

    run: function () {
        if (!fastmap.uikit.editControl.EditControl.prototype.run.apply(this, arguments)) {
            return false;
        }

        var editResult = new fastmap.uikit.complexEdit.SelectQualityCircleResult();
        this.toolController.resetCurrentTool('SelectQualityCircleTool', this.onToolFinish, {
            editResult: editResult
        });

        return true;
    },

    abort: function () {
        this.defaultFeedback.clear();
        this.feedbackController.refresh();
        this.shapeEditor.abort();
    },

    onToolFinish: function (editResult) {
        this.qualityId = editResult.selectQualityData.qualityId;
        this.resetFeedback(editResult);
        var updateEditResult = new fastmap.uikit.shapeEdit.PolygonResult();
        updateEditResult.geoLiveType = 'UPDATEQUALITYCIRCLE';
        updateEditResult.finalGeometry = {
            type: 'LineString',
            coordinates: []
        };
        updateEditResult.finalGeometry.coordinates = editResult.selectQualityData.geometry.coordinates[0];
        updateEditResult.originObject = editResult.selectQualityData;
        updateEditResult.isClosed = true;
        this.shapeEditor.start(updateEditResult, this.onUpdateToolFinish);
    },

    resetFeedback: function (editResult) {
        if (!this.defaultFeedback) {
            return;
        }
        this.defaultFeedback.clear();
        var polygonSymbol = this.symbolFactory.getSymbol('py_subtask_circle_select');
        this.defaultFeedback.add(editResult.selectQualityData.geometry, polygonSymbol);
        this.feedbackController.refresh();
    },

    onUpdateToolFinish: function (editResult) {
        if (!this.precheck(editResult)) {
            return;
        }

        var self = this;
        swal({
            title: '请确认是否合并子任务圈!',
            type: 'warning',
            animation: 'slide-from-top',
            showCancelButton: true,
            confirmButtonText: '是',
            cancelButtonText: '否',
            confirmButtonColor: '#ec6c62'
        }, function (f) {
            if (f) {
                var geometry = {
                    type: 'Polygon',
                    coordinates: [editResult.finalGeometry.coordinates]
                };
                var params = {
                    qualityId: self.qualityId,
                    geometry: self.geometryAlgorithm.geoJsonToWkt(geometry)
                };
                self.dataService.updateQualitySubTask(params)
                    .then(self.onCreateSuccess)
                    .catch(self.onCreateFail);
            }
        });
    },

    onCreateSuccess: function (res) {
        this.shapeEditor.stop();
        this.eventController.fire(L.Mixin.EventTypes.DRAWTASKCIRCLE);
        this.defaultFeedback.clear();
        this.feedbackController.refresh();
        this.run();
    },

    onCreateFail: function (err) {
        this.defaultFeedback.clear();
        this.feedbackController.refresh();
        swal({
            title: err,
            type: 'error',
            allowEscapeKey: false
        });
    }
});
