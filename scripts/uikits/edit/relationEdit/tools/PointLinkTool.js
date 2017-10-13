/**
 * Created by zhaohang on 2017/3/14.
 */

fastmap.uikit.relationEdit.PointLinkTool = fastmap.uikit.relationEdit.RelationTool.extend({
    initialize: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.eventController = fastmap.uikit.EventController();

        this.name = 'PointLinkTool';
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
        if (!this.editResult.link) {
            this.setMouseInfo('在link上点击选取点位!');
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
        var actorInfos = this.editResult.snapActors;
        for (var i = 0; i < actorInfos.length; ++i) {
            var actorInfo = actorInfos[i];
            if (!actorInfo.enable) {
                continue;
            }
            var snapActor = this.createFeatureSnapActor(actorInfo.geoLiveType, actorInfo.exceptions);
            snapActor.priority = actorInfo.priority;
            this.installSnapActor(snapActor);
        }
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        if (this.editResult.link) {
            var linkSymbol = this.symbolFactory.getSymbol('ls_rdLink_in');
            if (this.editResult.link.type === 'tips') {
                this.defaultFeedback.add(this.editResult.link.geometry.geometries[1], linkSymbol);
            } else {
                this.defaultFeedback.add(this.editResult.link.geometry, linkSymbol);
            }
        }

        // 为了让point压在线上,point最后绘制
        if (this.editResult.point) {
            var pointSymbol = this.symbolFactory.getSymbol('pt_rdNode_in');
            this.defaultFeedback.add(this.editResult.point, pointSymbol);
        }

        this.refreshFeedback();
    },

    onSelectLink: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);
        var link = res.feature;
        var point = res.point;
        newEditResult.link = link;
        newEditResult.point = point;
        this.createOperation('在link上选取一个位置点', newEditResult);
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
        this.onSelectLink(res);

        return true;
    }
});
