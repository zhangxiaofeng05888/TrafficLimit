/**
 * Created by zhaohang on 2017/5/3.
 */

fastmap.uikit.shapeEdit.BreakTipLinksTool = fastmap.uikit.shapeEdit.ShapeTool.extend({
    initialize: function () {
        fastmap.uikit.shapeEdit.ShapeTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.eventController = fastmap.uikit.EventController();

        this.name = 'BreakTipLinksTool';
        this.snapActor = null;
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.shapeEdit.ShapeTool.prototype.startup.apply(this, arguments);

        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.shapeEdit.ShapeTool.prototype.shutdown.apply(this, arguments);

        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.shapeEdit.ShapeTool.prototype.resetStatus.apply(this, arguments);

        this.snapActor = null;
    },

    refresh: function () {
        this.resetFeedback();
        this.resetSnapActor();
        this.resetMouseInfo();
    },

    resetMouseInfo: function () {
        if (!this.shapeEditor.editResult.breakPoint) {
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
        var features = this.shapeEditor.editResult.snapActors;
        this.snapActor = this.createGivenFeatureSnapActor(features);

        this.installSnapActor(this.snapActor);
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        // 为了让point压在线上,point最后绘制
        if (this.shapeEditor.editResult.breakPoint) {
            var pointSymbol = this.symbolFactory.getSymbol('pt_rdNode_in');
            this.defaultFeedback.add(this.shapeEditor.editResult.breakPoint, pointSymbol);
        }

        this.refreshFeedback();
    },

    onSelectLink: function (res) {
        var newEditResult = FM.Util.clone(this.shapeEditor.editResult);
        var point = res.point;
        newEditResult.breakPoint = point;
        this.shapeEditor.createOperation('在link上选取一个位置点', newEditResult);
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.shapeEdit.ShapeTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        this.snapController.snap(this.mousePoint);

        return true;
    },

    onLeftButtonClick: function (event) {
        if (!fastmap.uikit.shapeEdit.ShapeTool.prototype.onLeftButtonClick.apply(this, arguments)) {
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
