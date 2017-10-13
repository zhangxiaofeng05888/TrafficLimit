/**
 * Created by linglong on 2017/4/21.
 */

fastmap.uikit.complexEdit.DrawSubTaskTool = fastmap.uikit.complexEdit.ComplexTool.extend({
    initialize: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.eventController = fastmap.uikit.EventController();
        this.drawCircle = fastmap.DrawCircle.getInstance();

        this.name = 'DrawSubTaskTool';
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
        if (!this.editResult.selectSubTaskId) {
            if (this.editResult.selectSubTaskId === -1) {
                this.setMouseInfo('请选择一个block进行规划！');
            } else {
                this.setMouseInfo('请选择一个子任务进行规划！');
            }
        }
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

        if (!newEditResult.selectSubTaskId) {
            newEditResult.selectSubTaskId = this.drawCircle.selectSubTaskCircle(this.mousePoint);
            this.createOperation('选择要规划的任务', newEditResult);
            if (this.onFinish && newEditResult.selectSubTaskId) {
                this.onFinish(this.editResult);
            }
        }

        return true;
    }
});
