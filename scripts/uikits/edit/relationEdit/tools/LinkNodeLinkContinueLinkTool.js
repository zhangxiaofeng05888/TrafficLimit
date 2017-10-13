/**
 * Created by zhaohang on 2017/3/27.
 */

fastmap.uikit.relationEdit.LinkNodeLinkContinueLinkTool = fastmap.uikit.relationEdit.RelationTool.extend({
    initialize: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'LinkNodeLinkContinueLinkTool';
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
        this.recommendOutLinks = this.getRecomendOutLinks(this.editResult.inLink, this.editResult.inNode);
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

    getRecomendOutLinks: function (inLink, inNode) {
        var recomendOutLinks = [];
        if (inLink && inNode) {
            var topoLinks = this.uikitUtil.getTopoLinks(inNode);
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

        if (!this.editResult.inNode) {
            this.installNodeSnapActor();
            return;
        }

        if (!this.editResult.outLink) {
            this.installOutLinkSnapActor();
            return;
        }
        this.installContinueLinkSnapActor();
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

    installContinueLinkSnapActor: function () {
        var self = this;
        this.getCanPassLinks(function (canPassLink) { // 获取可以通行的link
            self.uninstallSnapActor(self.snapActor);
            var features = [];
            for (var i = 0; i < self.recommendOutLinks.length; i++) {
                features.push({
                    id: self.recommendOutLinks[i].properties.id,
                    geoLiveType: 'RDLINK'
                });
            }
            for (var j = 0; j < self.editResult.continueLink.length; j++) {
                features.push({
                    id: self.editResult.continueLink[j].properties.id,
                    geoLiveType: 'RDLINK'
                });
            }
            for (var m = 0; m < canPassLink.length; m++) {
                features.push({
                    id: canPassLink[m].properties.id,
                    geoLiveType: 'RDLINK'
                });
            }
            self.snapActor = self.createGivenFeatureSnapActor(features);

            self.installSnapActor(self.snapActor);
        });
    },

    getCanPassLinks: function (callback) {
        var link = 0;
        var nodeId = 0;
        var outNode = 0;
        var canPassLink = [];
        var self = this;
        if (self.editResult.continueLink.length === 0) {
            link = self.editResult.outLink;
            if (self.editResult.outLink.properties.snode == self.editResult.inNode.properties.id) {
                nodeId = self.editResult.outLink.properties.enode;
            } else {
                nodeId = self.editResult.outLink.properties.snode;
            }
        }
        if (self.editResult.continueLink.length === 1) {
            link = self.editResult.continueLink[0];
            if (self.editResult.outLink.properties.snode == self.editResult.inNode.properties.id) {
                outNode = self.editResult.outLink.properties.enode;
            } else {
                outNode = self.editResult.outLink.properties.snode;
            }
            if (outNode == self.editResult.continueLink[0].properties.snode) {
                nodeId = self.editResult.continueLink[0].properties.enode;
            } else {
                nodeId = self.editResult.continueLink[0].properties.snode;
            }
        }
        if (self.editResult.continueLink.length > 1) {
            link = self.editResult.continueLink[self.editResult.continueLink.length - 1];
            if (self.editResult.continueLink[self.editResult.continueLink.length - 1].properties.enode ==
                self.editResult.continueLink[self.editResult.continueLink.length - 2].properties.enode ||
                self.editResult.continueLink[self.editResult.continueLink.length - 1].properties.enode ==
                self.editResult.continueLink[self.editResult.continueLink.length - 2].properties.snode
            ) {
                nodeId = self.editResult.continueLink[self.editResult.continueLink.length - 1].properties.snode;
            } else {
                nodeId = self.editResult.continueLink[self.editResult.continueLink.length - 1].properties.enode;
            }
        }
        var param = {
            type: 'RDLINK',
            data: {
                nodePid: parseInt(nodeId, 10)
            }
        };
        self.dataService.getByCondition(param).then(function (upAndDownData) {
            if (upAndDownData) {
                var pid = [];
                for (var n = 0; n < upAndDownData.length; n++) {
                    if (link.properties.id != upAndDownData[n].pid) {
                        pid.push(upAndDownData[n].pid);
                    }
                }
                self.uikitUtil.getCanvasFeaturesFromServer(pid, 'RDLINK').then(
                    function (data) {
                        for (var m = 0; m < data.length; m++) {
                            if (self.uikitUtil.canPass(link, data[m])) {
                                canPassLink.push(data[m]);
                            }
                        }
                        for (var i = 0; i < canPassLink.length; i++) {
                            if (canPassLink[i].properties.id == self.editResult.inLink.properties.id ||
                                canPassLink[i].properties.id == self.editResult.outLink.properties.id) {
                                canPassLink.splice(i, 1);
                            }
                        }
                        return callback(canPassLink);
                    }
                );
            }
            return callback(canPassLink);
        });
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

        if (this.editResult.continueLink.length == 0) {
            this.setMouseInfo('没有匹配的接续线，请手动添加，或者按空格保存！(支持修改退出线)');
            return;
        }

        this.setMouseInfo('请按空格保存或者修改接续线！(支持修改退出线)');
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
                var recommendOutLink = this.recommendOutLinks[i];
                this.resetRecommendOutLink(recommendOutLink);
            }
        }

        if (this.editResult.outLink) {
            var outLinkSymbol = this.symbolFactory.getSymbol('ls_rdLink_out');
            this.defaultFeedback.add(this.editResult.outLink.geometry, outLinkSymbol);
        }

        if (this.editResult.continueLink.length > 0) {
            var continueSymbol = this.symbolFactory.getSymbol('ls_rdLink_join');
            for (var j = 0; j < this.editResult.continueLink.length; j++) {
                this.defaultFeedback.add(this.editResult.continueLink[j].geometry, continueSymbol);
            }
        }

        // 为了让node压在线上,node最后绘制
        if (this.editResult.inNode) {
            var nodeSymbol = this.symbolFactory.getSymbol('pt_rdNode_in');
            this.defaultFeedback.add(this.editResult.inNode.geometry, nodeSymbol);
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
        var selectRecommendOutLinkFlag = false; // 选择一个退出线后，判断在选择的是否选择的是推荐的退出线
        if (this.recommendOutLinks && this.recommendOutLinks.length > 1) {
            for (var i = 0; i < this.recommendOutLinks.length; i++) {
                if (res.feature.properties.id == this.recommendOutLinks[i].properties.id) {
                    selectRecommendOutLinkFlag = true;
                }
            }
        }

        if (!this.editResult.inLink) {
            this.onSelectInLink(res);
        } else if (!this.editResult.inNode) {
            this.onSelectNode(res);
        } else if (!this.editResult.outLink || selectRecommendOutLinkFlag) {
            this.onSelectOutLink(res);
            this.onDefaultContinueLink(res);
        } else {
            this.onSelectContinueLink(res);
        }

        if (this.recommendOutLinks && this.recommendOutLinks.length === 1) {
            var newEditResult = FM.Util.clone(this.editResult);
            newEditResult.outLink = this.recommendOutLinks[0];
            this.createOperation('退出线为一条时，自动选中', newEditResult);
            this.onDefaultContinueLink(res);
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
            newEditResult.inNode = this.featureSelector.selectByFeatureId(eNodeId, 'RDNODE');
            this.createOperation('选择进入线和进入点', newEditResult);
        } else if (direct === '3') {
            // 逆方向取起点作为进入点
            var sNodeId = parseInt(inLink.properties.snode, 10);
            newEditResult.inNode = this.featureSelector.selectByFeatureId(sNodeId, 'RDNODE');
            this.createOperation('选择进入线和进入点', newEditResult);
        } else {
            this.createOperation('选择进入线', newEditResult);
        }
    },

    onSelectNode: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.inNode = this.featureSelector.selectByFeatureId(res.value, 'RDNODE');
        this.createOperation('选择进入点', newEditResult);
    },

    onSelectOutLink: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);
        var outLink = res.feature;
        newEditResult.outLink = outLink;
        this.createOperation('选择退出线', newEditResult);
    },

    onDefaultContinueLink: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);
        var self = this;
        var param = {
            type: 'RDLINK',
            data: {
                queryType: 'RDVARIABLESPEED',
                linkPid: newEditResult.outLink.properties.id,
                nodePid: (newEditResult.inNode.properties.id == newEditResult.outLink.properties.enode) ?
                    newEditResult.outLink.properties.snode : newEditResult.outLink.properties.enode
            }
        };
        this.dataService.getByCondition(param).then(function (upAndDownData) {
            if (upAndDownData) {
                var continueLink = [];
                var continueLinkPid = [];
                for (var i = 0; i < upAndDownData.length; i++) {
                    continueLinkPid.push(parseInt(upAndDownData[i].pid, 10));
                }
                self.uikitUtil.getCanvasFeaturesFromServer(continueLinkPid, 'RDLINK').then(
                    function (data) {
                        newEditResult.continueLink = data;
                        self.createOperation('推荐的接续link', newEditResult);
                    }
                );
            } else {
                newEditResult.continueLink = [];
                self.createOperation('推荐的接续link为空', newEditResult);
            }
        });
    },

    onSelectContinueLink: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);
        var continueLink = newEditResult.continueLink;
        var newContinueLink = true;
        for (var i = 0; i < continueLink.length; i++) {
            if (res.feature.properties.id == continueLink[i].properties.id) {
                continueLink.splice(i);
                newContinueLink = false;
            }
        }
        if (newContinueLink) {
            continueLink.push(res.feature);
        }
        newEditResult.continueLink = continueLink;
        this.createOperation('修改接续link', newEditResult);
    }
});
