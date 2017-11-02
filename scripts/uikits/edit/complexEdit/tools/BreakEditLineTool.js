/**
 * Created by zhaohang on 2017/11/1.
 */

fastmap.uikit.complexEdit.BreakEditLineTool = fastmap.uikit.complexEdit.ComplexTool.extend({
    initialize: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.eventController = fastmap.uikit.EventController();

        this.name = 'BreakEditLineTool';
        this.snapActor = null;
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.complexEdit.ComplexTool.prototype.startup.apply(this, arguments);

        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.shutdown.apply(this, arguments);

        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.resetStatus.apply(this, arguments);

        this.snapActor = null;
    },

    onRedo: function (oldEditResult, newEditResult) {
        this.editResult = newEditResult;
        this.refresh();
    },

    onUndo: function (oldEditResult, newEditResult) {
        this.editResult = oldEditResult;
        this.refresh();
    },

    refresh: function () {
        this.resetFeedback();
        this.resetSnapActor();
        this.resetMouseInfo();
    },

    resetMouseInfo: function () {
        if (!this.editResult.breakPoint) {
            this.setMouseInfo('请选取打断点位!');
        } else {
            this.setMouseInfo('选择其他点位或者按空格保存!');
        }
    },

    resetSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);

        this.installLinkSnapActor();
    },

    installLinkSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);
        var features = this.editResult.snapActors;
        this.snapActor = this.createGivenFeatureSnapActor(features);

        this.installSnapActor(this.snapActor);
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        // 为了让point压在线上,point最后绘制
        if (this.editResult.breakPoint) {
            var pointSymbol = this.symbolFactory.getSymbol('pt_rdNode_in');
            this.defaultFeedback.add(this.editResult.breakPoint, pointSymbol);
        }

        this.refreshFeedback();
    },

    onSelectLink: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);
        var point = res.point;
        newEditResult.breakPoint = point;
        this.createOperation('在link上选取一个位置点', newEditResult);
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

        var res = this.snapController.snap(this.mousePoint);
        if (!res) {
            return true;
        }
        this.onSelectLink(res);

        return true;
    }
});
