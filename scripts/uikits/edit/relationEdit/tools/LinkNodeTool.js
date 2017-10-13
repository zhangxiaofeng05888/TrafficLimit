/**
 * Created by zhaohang on 2017/3/15.
 */

fastmap.uikit.relationEdit.LinkNodeTool = fastmap.uikit.relationEdit.RelationTool.extend({
    initialize: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.eventController = fastmap.uikit.EventController();

        this.name = 'LinkNodeTool';
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

    resetSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);

        if (!this.editResult.inLink) {
            this.installInLinkSnapActor();
            return;
        }

        if (!this.editResult.inNode) {
            this.installNodeSnapActor();
            return;
        }
    },

    installInLinkSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);

        this.snapActor = this.createFeatureSnapActor('RDLINK', null);

        this.installSnapActor(this.snapActor);
    },

    installNodeSnapActor: function () {
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

    resetMouseInfo: function () {
        if (!this.editResult.inLink) {
            this.setMouseInfo('请选择进入线!');
            return;
        }
        if (!this.editResult.inNode) {
            this.setMouseInfo('请选择进入点!');
            return;
        }
        this.setMouseInfo('请按空格保存!');
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();
        if (this.editResult.inLink) {
            var inLinkSymbol = this.symbolFactory.getSymbol('ls_rdLink_in');
            this.defaultFeedback.add(this.editResult.inLink.geometry, inLinkSymbol);
        }

        if (this.editResult.inNode) {
            var inNodeSymbol = this.symbolFactory.getSymbol('pt_rdNode_in');
            this.defaultFeedback.add(this.editResult.inNode.geometry, inNodeSymbol);
        }

        this.refreshFeedback();
    },

    onSelectInLink: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);
        var inLink = res.feature;
        newEditResult.inLink = inLink;
        var direct = inLink.properties.direct;
        if (direct === 2) {
            // 顺方向取终点作为进入点
            newEditResult.inNode = this.featureSelector.selectByFeatureId(parseInt(inLink.properties.enode, 10), 'RDNODE');
            this.createOperation('选择进入线和进入点', newEditResult);
        } else if (direct === 3) {
            // 逆方向取起点作为进入点
            newEditResult.inNode = this.featureSelector.selectByFeatureId(parseInt(inLink.properties.snode, 10), 'RDNODE');
            this.createOperation('选择进入线和进入点', newEditResult);
        } else {
            this.createOperation('选择进入线', newEditResult);
        }
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.relationEdit.RelationTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        var mousePoint = this.latlngToPoint(event.latlng);
        this.snapController.snap(mousePoint);

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

        if (!this.editResult.inLink) {
            this.onSelectInLink(res);
        } else if (!this.editResult.node) {
            var newEditResult = FM.Util.clone(this.editResult);
            newEditResult.inNode = this.featureSelector.selectByFeatureId(res.value, 'RDNODE');
            this.createOperation('选择进入点', newEditResult);
        }

        return true;
    }
});
