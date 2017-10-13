/**
 * Created by zhaohang on 2017/7/13.
 */

fastmap.uikit.complexEdit.SelectQualityCircleTool = fastmap.uikit.complexEdit.ComplexTool.extend({
    initialize: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.eventController = fastmap.uikit.EventController();
        this.drawCircle = fastmap.DrawCircle.getInstance();

        this.name = 'SelectQualityCircleTool';
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
        this.setMouseInfo('请选择一个质检子任务进行修改');
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

        var data = this.drawCircle.selectQualityCircle(this.mousePoint);
        if (data.length > 1) {
            this.setMouseInfo('选择了多个质检任务，请重新选择！');
            return false;
        }
        if (data.length === 0) {
            return false;
        }
        newEditResult.selectQualityData = data[0];
        this.createOperation('选择要规划的任务', newEditResult);
        if (this.onFinish) {
            this.onFinish(this.editResult);
        }

        return true;
    }
});
