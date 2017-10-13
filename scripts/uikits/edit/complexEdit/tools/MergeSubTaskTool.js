/**
 * Created by zhaohang on 2017/7/11.
 */

fastmap.uikit.complexEdit.MergeSubTaskTool = fastmap.uikit.complexEdit.ComplexTool.extend({
    initialize: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.eventController = fastmap.uikit.EventController();
        this.drawCircle = fastmap.DrawCircle.getInstance();

        this.name = 'MergeSubTaskTool';
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.complexEdit.ComplexTool.prototype.startup.apply(this, arguments);

        this.editResult = this.options.editResult.clone();

        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.shutdown.apply(this, arguments);

        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.resetStatus.apply(this, arguments);
    },

    refresh: function () {
        this.resetFeedback();
        this.resetMouseInfo();
    },

    onRedo: function (oldEditResult, newEditResult) {
        this.editResult = newEditResult;
        this.refresh();
    },

    onUndo: function (oldEditResult, newEditResult) {
        this.editResult = oldEditResult;
        this.refresh();
    },

    resetMouseInfo: function () {
        if (this.editResult.selectSubTaskIds.length !== 2) {
            this.setMouseInfo('请选择两个子任务圈进行合并');
        } else {
            this.setMouseInfo('继续选择子任务圈，或者按空格保存!');
        }
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }
        this.defaultFeedback.clear();
        var polygonSymbol = this.symbolFactory.getSymbol('py_subtask_circle_select');
        for (var i = 0; i < this.editResult.selectSubTaskIds.length; ++i) {
            for (var j = 0; j < this.drawCircle.data.subtask.length; j++) {
                if (this.drawCircle.data.subtask[j].id === this.editResult.selectSubTaskIds[i]) {
                    this.defaultFeedback.add(this.drawCircle.data.subtask[j].geometry, polygonSymbol);
                }
            }
        }
        this.refreshFeedback();
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.complexEdit.ComplexTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        this.snapController.snap(this.mousePoint);

        return true;
    },

    onLeftButtonClick: function (event) {
        if (!fastmap.uikit.complexEdit.ComplexTool.prototype.onLeftButtonClick.apply(this, arguments)) {
            return false;
        }
        var newEditResult = this.editResult.clone();

        var selectId = this.drawCircle.selectSubTaskCircle(this.mousePoint);
        if (selectId === 0) {
            return false;
        }
        var selectSubTaskIds = newEditResult.selectSubTaskIds;
        if (selectSubTaskIds.length === 0) {
            selectSubTaskIds.push(selectId);
        } else if (selectSubTaskIds.length === 1) {
            if (selectSubTaskIds[0] === selectId) {
                selectSubTaskIds = [];
            } else {
                selectSubTaskIds.push(selectId);
            }
        } else if (selectSubTaskIds.length === 2) {
            if (selectSubTaskIds[0] === selectId) {
                selectSubTaskIds = [selectSubTaskIds[1]];
            } else if (selectSubTaskIds[1] === selectId) {
                selectSubTaskIds = [selectSubTaskIds[0]];
            }
        }
        newEditResult.selectSubTaskIds = selectSubTaskIds;
        this.createOperation('选择要规划的任务', newEditResult);

        return true;
    }
});
