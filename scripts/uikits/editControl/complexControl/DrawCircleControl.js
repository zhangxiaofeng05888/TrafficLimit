/**
 * Created by zhaohang on 2017/7/10.
 */

fastmap.uikit.editControl.DrawCircleControl = fastmap.uikit.editControl.EditControl.extend({
    initialize: function (map, geoLiveType) {
        fastmap.uikit.editControl.EditControl.prototype.initialize.call(this, map);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.geoLiveType = geoLiveType;
        this.feedbackController = fastmap.mapApi.FeedbackController.getInstance();
        this.symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();
        this.shapeEditor = fastmap.uikit.shapeEdit.ShapeEditor.getInstance();
        this.topoEditor = this.topoEditFactory.drawCircleTopoEditor(this.geoLiveType, this.map);
        this.toolController.addTool(new fastmap.uikit.complexEdit.DrawSubTaskTool());
        this.defaultFeedback = new fastmap.mapApi.Feedback();
        this.feedbackController.add(this.defaultFeedback);
        this.drawCircle = fastmap.DrawCircle.getInstance();
        this.selectSubTaskId = 0;
    },

    run: function () {
        if (!fastmap.uikit.editControl.EditControl.prototype.run.call(this)) {
            return false;
        }

        var editResult = new fastmap.uikit.complexEdit.DrawSubTaskResult();
        this.toolController.resetCurrentTool('DrawSubTaskTool', this.onToolFinish, {
            editResult: editResult
        });
        // this.complexEditor.start(editResult, this.onToolFinish);

        return true;
    },

    abort: function () {
        this.defaultFeedback.clear();
        this.feedbackController.refresh();
        this.shapeEditor.abort();
    },

    onToolFinish: function (editResult) {
        this.resetFeedback(editResult);
        var drawLinkEditResult = this.topoEditor.getCreateEditResult();
        this.shapeEditor.start(drawLinkEditResult, this.onDrawLinkToolFinish);
    },

    onDrawLinkToolFinish: function (editResult) {
        if (!this.precheck(editResult)) {
            return;
        }
        var self = this;
        swal({
            title: '请确认是否保存子任务圈!',
            type: 'warning',
            animation: 'slide-from-top',
            showCancelButton: true,
            confirmButtonText: '是',
            cancelButtonText: '否',
            confirmButtonColor: '#ec6c62'
        }, function (f) {
            if (f) {
                self.topoEditor
                    .create(editResult, self.selectSubTaskId)
                    .then(self.onCreateSuccess)
                    .catch(self.onCreateFail);
            }
        });
    },

    resetFeedback: function (editResult) {
        if (!this.defaultFeedback) {
            return;
        }
        this.defaultFeedback.clear();
        if (editResult.selectSubTaskId) {
            this.selectSubTaskId = editResult.selectSubTaskId;
            var polygonSymbol = this.symbolFactory.getSymbol('py_subtask_circle_select');

            if (editResult.selectSubTaskId === -1) {
                this.defaultFeedback.add(this.drawCircle.data.block.originGeo, polygonSymbol);
            } else {
                for (var i = 0; i < this.drawCircle.data.subtask.length; ++i) {
                    if (this.drawCircle.data.subtask[i].id === editResult.selectSubTaskId) {
                        this.defaultFeedback.add(this.drawCircle.data.subtask[i].geometry, polygonSymbol);
                    }
                }
            }
        }
        this.feedbackController.refresh();
    },

    onCreateSuccess: function (res) {
        this.shapeEditor.stop();
        this.defaultFeedback.clear();
        this.feedbackController.refresh();
        this.eventController.fire(L.Mixin.EventTypes.DRAWTASKCIRCLE);
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
