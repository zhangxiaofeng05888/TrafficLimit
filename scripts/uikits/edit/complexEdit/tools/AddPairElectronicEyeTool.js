/**
 * Created by wangmingdong on 2017/3/22.
 */

fastmap.uikit.complexEdit.AddPairElectronicEyeTool = fastmap.uikit.complexEdit.ComplexTool.extend({
    initialize: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.eventController = fastmap.uikit.EventController();

        this.name = 'AddPairElectronicEyeTool';
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
        if (!this.editResult.pairFeature) {
            this.setMouseInfo('请选择配对的电子眼');
        } else {
            this.setMouseInfo('选择其他电子眼或者按空格保存');
        }
    },

    resetSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);

        this.installFeatureSnapActor();
    },

    installFeatureSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);

        this.snapActor = this.createFeatureSnapActor('RDELECTRONICEYE', null);

        this.installSnapActor(this.snapActor);
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        var featureSymbol = this.symbolFactory.getSymbol('pt_feature_relationBorder');
        if (this.editResult.pairFeature) {
            this.defaultFeedback.add(this.editResult.pairFeature.geometry, featureSymbol);
        }
        this.defaultFeedback.add(this.editResult.originObject.geometry, featureSymbol);

        this.refreshFeedback();
    },

    onSelectFeature: function (res) {
        var self = this;
        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.endPid = res.feature.properties.id;
        this.dataService
            .getByPid(newEditResult.endPid, 'RDELECTRONICEYE')
            .then(function (result) {
                if (result) {
                    newEditResult.pairFeature = result;
                }
                self.createOperation('选择配对电子眼', newEditResult);
            })
            .catch(function (err) {
                self.createOperation('选择配对电子眼', newEditResult);
                self.setCenterInfo('查询电子眼失败：' + err, 1000);
            });
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
        this.onSelectFeature(res);

        return true;
    }
});
