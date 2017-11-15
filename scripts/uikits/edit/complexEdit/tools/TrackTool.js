/**
 * Created by zhaohang on 2017/11/15.
 */

fastmap.uikit.complexEdit.TrackTool = fastmap.uikit.complexEdit.ComplexTool.extend({
    initialize: function () {
        fastmap.uikit.complexEdit.ComplexTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'TrackTool';
        this.snapActor = null;
        this.recommendOutLinks = null;
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
        this.recommendOutLinks = null;
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

    resetSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);

        if (!this.editResult.inLink) {
            this.installInLinkSnapActor();
            return;
        }

        if (!this.editResult.inNode) {
            this.installInNodeSnapActor();
            return;
        }

        if (!this.editResult.outLink) {
            this.installOutLinkSnapActor();
            return;
        }

        if (!this.editResult.outNode) {
            this.installOutNodeSnapActor();
        }
    },

    installInLinkSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);

        this.snapActor = this.createFeatureSnapActor('RDLINK', null);

        this.installSnapActor(this.snapActor);
    },

    installInNodeSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);

        var geometry = this.editResult.inLink.geometry;
        var sNodePid = parseInt(this.editResult.inLink.properties.snode, 10);
        var eNodePid = parseInt(this.editResult.inLink.properties.enode, 10);
        var sPoint = {
            type: 'Point',
            coordinates: geometry.coordinates[0]
        };
        var ePoint = {
            type: 'Point',
            coordinates: geometry.coordinates[geometry.coordinates.length - 1]
        };
        // 直接组成pairs格式
        var pairs = [];
        pairs.push({ key: sPoint, value: sNodePid });
        pairs.push({ key: ePoint, value: eNodePid });
        this.snapActor = this.createGivenPointSnapActor(pairs);

        this.installSnapActor(this.snapActor);
    },

    installOutLinkSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);

        var exceptions = [this.editResult.inLink.properties.id];
        this.snapActor = this.createFeatureSnapActor('RDLINK', exceptions);

        this.installSnapActor(this.snapActor);
    },

    installOutNodeSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);

        var geometry = this.editResult.outLink.geometry;
        var sNodePid = parseInt(this.editResult.outLink.properties.snode, 10);
        var eNodePid = parseInt(this.editResult.outLink.properties.enode, 10);
        var sPoint = {
            type: 'Point',
            coordinates: geometry.coordinates[0]
        };
        var ePoint = {
            type: 'Point',
            coordinates: geometry.coordinates[geometry.coordinates.length - 1]
        };
        // 直接组成pairs格式
        var pairs = [];
        pairs.push({ key: sPoint, value: sNodePid });
        pairs.push({ key: ePoint, value: eNodePid });
        this.snapActor = this.createGivenPointSnapActor(pairs);

        this.installSnapActor(this.snapActor);
    },

    resetMouseInfo: function () {
        if (!this.editResult.inLink) {
            this.setMouseInfo('请选择进入线');
            return;
        }

        if (!this.editResult.inNode) {
            this.setMouseInfo('请选择进入点');
            return;
        }

        if (!this.editResult.outLink) {
            this.setMouseInfo('请选择退出线');
            return;
        }

        if (!this.editResult.outNode) {
            this.setMouseInfo('请选择退出点');
            return;
        }

        this.setMouseInfo('请按空格键完成');
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        if (this.editResult.inLink) {
            var inLinkSymbol = this.symbolFactory.getSymbol('relationEdit_ls_inLink');
            this.defaultFeedback.add(this.editResult.inLink.geometry, inLinkSymbol);
        }

        if (this.editResult.outLink) {
            var outLinkSymbol = this.symbolFactory.getSymbol('relationEdit_ls_outLink_selected');
            this.defaultFeedback.add(this.editResult.outLink.geometry, outLinkSymbol);
        }

        // 为了让node压在线上,node最后绘制
        if (this.editResult.inNode) {
            var inNodeSymbol = this.symbolFactory.getSymbol('relationEdit_pt_node');
            this.defaultFeedback.add(this.editResult.inNode.geometry, inNodeSymbol);
        }

        // 为了让node压在线上,node最后绘制
        if (this.editResult.outNode) {
            var outNodeSymbol = this.symbolFactory.getSymbol('relationEdit_pt_node');
            this.defaultFeedback.add(this.editResult.outNode.geometry, outNodeSymbol);
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

        var res = this.snapController.snap(this.mousePoint);
        if (!res) {
            return true;
        }

        if (!this.editResult.inLink) {
            this.onSelectInLink(res);
        } else if (!this.editResult.inNode) {
            this.onSelectInNode(res);
        } else if (!this.editResult.outLink){
            this.onSelectOutLink(res);
        } else {
            this.onSelectOutNode(res);
        }

        return true;
    },

    onSelectInLink: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);
        var inLink = res.feature;
        newEditResult.inLink = inLink;
        var direct = inLink.properties.direct;
        if (direct === 2) {
            // 顺方向取终点作为进入点
            var eNodeId = parseInt(inLink.properties.enode, 10);
            newEditResult.inNode = this.featureSelector.selectByFeatureId(eNodeId, 'RDNODE');
            this.createOperation('选择进入线和进入点', newEditResult);
        } else if (direct === 3) {
            // 逆方向取起点作为进入点
            var sNodeId = parseInt(inLink.properties.snode, 10);
            newEditResult.inNode = this.featureSelector.selectByFeatureId(sNodeId, 'RDNODE');
            this.createOperation('选择进入线和进入点', newEditResult);
        } else {
            this.createOperation('选择进入线', newEditResult);
        }
    },

    onSelectInNode: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.inNode = this.featureSelector.selectByFeatureId(res.value, 'RDNODE');
        this.createOperation('选择进入点', newEditResult);
    },

    onSelectOutLink: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);
        var outLink = res.feature;
        newEditResult.outLink = outLink;
        var direct = outLink.properties.direct;
        if (direct === 2) {
            // 顺方向取终点作为进入点
            var eNodeId = parseInt(outLink.properties.snode, 10);
            newEditResult.outNode = this.featureSelector.selectByFeatureId(eNodeId, 'RDNODE');
            this.createOperation('选择进入线和进入点', newEditResult);
        } else if (direct === 3) {
            // 逆方向取起点作为进入点
            var sNodeId = parseInt(outLink.properties.enode, 10);
            newEditResult.outNode = this.featureSelector.selectByFeatureId(sNodeId, 'RDNODE');
            this.createOperation('选择进入线和进入点', newEditResult);
        } else {
            this.createOperation('选择进入线', newEditResult);
        }
    },

    onSelectOutNode: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.outNode = this.featureSelector.selectByFeatureId(res.value, 'RDNODE');
        this.createOperation('选择进入点', newEditResult);
    }
});
