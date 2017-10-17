/**
 * Created by zhaohang on 2017/10/17.
 */

fastmap.uikit.complexEdit.DrawPolygonTool = fastmap.uikit.complexEdit.ComplexTool.extend({
    initialize: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'DrawPolygonTool';
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
        if (this.editResult.links.length === 0) {
            this.setMouseInfo('请选择需要构面的线');
        } else {
            this.setMouseInfo('请继续选择，或者按空格保存');
        }
    },

    resetSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);

        this.installInLinkSnapActor();
    },

    installInLinkSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);

        this.snapActor = this.createFeatureSnapActor('COPYTOPOLYGON', null);

        this.installSnapActor(this.snapActor);
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.complexEdit.ComplexTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        this.snapController.snap(this.mousePoint);

        return true;
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();
        if (this.editResult && this.editResult.links) {
            var length = this.editResult.links.length;
            if (length > 0) {
                for (var i = 0; i < length; ++i) {
                    var feature = this.editResult.links[i];
                    var linkSymbol = this.symbolFactory.getSymbol('ls_link');
                    this.defaultFeedback.add(feature.geometry, linkSymbol);
                }
            }
        }

        this.refreshFeedback();
    },

    onLeftButtonClick: function (event) {
        if (!fastmap.uikit.complexEdit.ComplexTool.prototype.onLeftButtonClick.apply(this, arguments)) {
            return false;
        }

        var res = this.snapController.snap(this.mousePoint);
        if (!res) {
            return true;
        }
        var newEditResult = FM.Util.clone(this.editResult);
        var links = newEditResult.links;
        var linksFlag = true;
        for (var i = 0; i < links.length; i++) {
            if (res.feature.properties.id == links[i].properties.id) {
                links.splice(i, 1);
                linksFlag = false;
            }
        }
        if (linksFlag) {
            links.push(res.feature);
        }
        newEditResult.links = links;
        this.createOperation('添加构面的线', newEditResult);

        return true;
    }
});
