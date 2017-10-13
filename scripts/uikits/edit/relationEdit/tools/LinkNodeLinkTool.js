/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.relationEdit.LinkNodeLinkTool = fastmap.uikit.relationEdit.RelationTool.extend({
    initialize: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'LinkNodeLinkTool';
        this.snapActor = null;
        this.recommendOutLinks = null;
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
        this.recommendOutLinks = null;
    },

    refresh: function () {
        this.recommendOutLinks = this.getRecomendOutLinks(this.editResult.inLink, this.editResult.node);
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

    getRecomendOutLinks: function (inLink, node) {
        var recomendOutLinks = [];
        if (inLink && node) {
            var topoLinks = this.uikitUtil.getTopoLinks(node);
            for (var i = 0; i < topoLinks.length; ++i) {
                var topoLink = topoLinks[i];
                if (topoLink.properties.id === inLink.properties.id) {
                    continue;
                }

                if (!this.uikitUtil.canPass(inLink, topoLink)) {
                    continue;
                }

                recomendOutLinks.push(topoLink);
            }
        }
        return recomendOutLinks;
    },

    resetSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);

        if (!this.editResult.inLink) {
            this.installInLinkSnapActor();
            return;
        }

        if (!this.editResult.node) {
            this.installNodeSnapActor();
            return;
        }

        this.installOutLinkSnapActor();
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

    installOutLinkSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);

        var features = this.recommendOutLinks.map(function (topoLink) {
            return {
                id: topoLink.properties.id,
                geoLiveType: 'RDLINK'
            };
        });
        this.snapActor = this.createGivenFeatureSnapActor(features);

        this.installSnapActor(this.snapActor);
    },

    resetMouseInfo: function () {
        if (!this.editResult.inLink) {
            this.setMouseInfo('请选择进入线');
            return;
        }

        if (!this.editResult.node) {
            this.setMouseInfo('请选择进入点');
            return;
        }

        if (!this.editResult.outLink) {
            this.setMouseInfo('请选择退出线');
            return;
        }

        this.setMouseInfo('请重新选择退出线或者按空格键完成');
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

        if (this.recommendOutLinks) {
            var length = this.recommendOutLinks.length;
            for (var i = 0; i < length; ++i) {
                // 如果选择退出线，需要单独区分出来
                if (this.editResult.outLink) {
                    if (this.editResult.outLink.properties.id == this.recommendOutLinks[i].properties.id) {
                        continue;
                    }
                }
                var recommendOutLink = this.recommendOutLinks[i];
                this.resetRecommendOutLink(recommendOutLink);
            }
        }

        if (this.editResult.outLink) {
            var outLinkSymbol = this.symbolFactory.getSymbol('relationEdit_ls_outLink_selected');
            this.defaultFeedback.add(this.editResult.outLink.geometry, outLinkSymbol);
        }

        // 为了让node压在线上,node最后绘制
        if (this.editResult.node) {
            var nodeSymbol = this.symbolFactory.getSymbol('relationEdit_pt_node');
            this.defaultFeedback.add(this.editResult.node.geometry, nodeSymbol);
        }

        this.refreshFeedback();
    },

    resetRecommendOutLink: function (recommendOutLink) {
        var recommendOutLinkSymbol = this.symbolFactory.getSymbol('relationEdit_ls_outLink');
        this.defaultFeedback.add(recommendOutLink.geometry, recommendOutLinkSymbol);
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

        if (!this.editResult.inLink) {
            this.onSelectInLink(res);
        } else if (!this.editResult.node) {
            this.onSelectNode(res);
        } else {
            this.onSelectOutLink(res);
        }

        if (this.recommendOutLinks && this.recommendOutLinks.length === 1) {
            var newEditResult = FM.Util.clone(this.editResult);
            newEditResult.outLink = this.recommendOutLinks[0];
            this.createOperation('退出线为一条时，自动选中', newEditResult);
        }
        return true;
    },

    onSelectInLink: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);
        var inLink = res.feature;
        newEditResult.inLink = inLink;
        var direct = inLink.properties.direct;
        if (direct === '2') {
            // 顺方向取终点作为进入点
            var eNodeId = parseInt(inLink.properties.enode, 10);
            newEditResult.node = this.featureSelector.selectByFeatureId(eNodeId, 'RDNODE');
            this.createOperation('选择进入线和进入点', newEditResult);
        } else if (direct === '3') {
            // 逆方向取起点作为进入点
            var sNodeId = parseInt(inLink.properties.snode, 10);
            newEditResult.node = this.featureSelector.selectByFeatureId(sNodeId, 'RDNODE');
            this.createOperation('选择进入线和进入点', newEditResult);
        } else {
            this.createOperation('选择进入线', newEditResult);
        }
    },

    onSelectNode: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.node = this.featureSelector.selectByFeatureId(res.value, 'RDNODE');
        this.createOperation('选择进入点', newEditResult);
    },

    onSelectOutLink: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);
        var outLink = res.feature;
        newEditResult.outLink = outLink;
        this.createOperation('选择退出线', newEditResult);
    }
});
