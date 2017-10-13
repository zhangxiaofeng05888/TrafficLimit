/**
 * Created by zhaohang on 2017/3/15.
 */

fastmap.uikit.relationEdit.NodeTool = fastmap.uikit.relationEdit.RelationTool.extend({
    initialize: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.eventController = fastmap.uikit.EventController();

        this.name = 'NodeTool';
        this.snapActor = null;
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.relationEdit.RelationTool.prototype.startup.apply(this, arguments);

        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.shutdown.apply(this, arguments);

        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.resetStatus.apply(this, arguments);

        this.snapActor = null;
    },

    refresh: function () {
        this.resetFeedback();
        this.resetSnapActor();
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
        if (!this.editResult.node) {
            this.setMouseInfo('请选择制作信号灯的路口!');
        } else {
            this.setMouseInfo('选择其他点位或者按空格保存!');
        }
    },

    resetSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);

        this.installNodeSnapActor();
    },

    installNodeSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);

        this.snapActor = this.createFeatureSnapActor('RDNODE', null);

        this.installSnapActor(this.snapActor);
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        if (this.editResult.node) {
            var nodeSymbol = this.symbolFactory.getSymbol('pt_rdNode_cross');
            this.defaultFeedback.add(this.editResult.node.geometry, nodeSymbol);
        }

        this.refreshFeedback();
    },
    onSelectNode: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);
        var node = res.feature;
        newEditResult.node = node;
        this.createOperation('选取一个路口', newEditResult);
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.relationEdit.RelationTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        this.snapController.snap(this.mousePoint);

        return true;
    },

    onLeftButtonClick: function (event) {
        if (!fastmap.uikit.relationEdit.RelationTool.prototype.onLeftButtonClick.apply(this, arguments)) {
            return false;
        }

        var res = this.snapController.snap(this.mousePoint);
        if (!res) {
            return true;
        }
        this.onSelectNode(res);

        return true;
    }
});
