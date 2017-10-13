/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.relationEdit.LinkNodeLinksTool = fastmap.uikit.relationEdit.RelationTool.extend({
    initialize: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.eventController = fastmap.uikit.EventController();

        this.name = 'LinkNodeLinksTool';
        this.snapActor = null;
        this.editResult = null;
        this.selectType = 'outLink';
        this.currentViaLink = null;
        this.currentViaLinkNode = null;
        this.selectOutLink = true;
    },

   /* onActive: function (map, onFinish, options) {
        if (!fastmap.uikit.relationEdit.RelationTool.prototype.onActive.apply(this, arguments)) {
            return false;
        }

        this.startup();
        return true;
    },

    onDeactive: function () {
        this.shutdown();
        return fastmap.uikit.relationEdit.RelationTool.prototype.onDeactive.apply(this, arguments);
    },*/

    startup: function () {
        this.resetStatus();

        fastmap.uikit.relationEdit.RelationTool.prototype.startup.apply(this, arguments);

        this.selectType = 'outLink';
        this.currentViaLink = null;
        this.currentViaLinkNode = null;
        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.shutdown.apply(this, arguments);

        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.resetStatus.apply(this, arguments);
        // this.resetFeedback();
        // this.resetSnapActor();
        this.snapActor = null;
        this.selectType = 'outLink';
        this.currentViaLink = null;
        this.currentViaLinkNode = null;
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

        if (!this.editResult.outLink) {
            if (this.selectType == 'viaLink') {
                this.installViaLinksSnapActor();
            } else {
                this.installOutLinkSnapActor();
            }
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

    installOutLinkSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);

        var exceptions = [this.editResult.inLink.properties.id];
        this.snapActor = this.createFeatureSnapActor('RDLINK', exceptions);

        this.installSnapActor(this.snapActor);
    },

    installViaLinksSnapActor: function () {
        var viaLinks = this.editResult.parts[this.editResult.currentPart].vias;
        var pid = this.editResult.inNode.properties.id;
        var self = this;
        var nodePids = [pid];
        for (var i = 0; i < viaLinks.length; i++) {
            pid = this.uikitUtil.getOtherNode(viaLinks[i], pid);
            nodePids.push(pid);
        }
        var inLinkPid = this.editResult.inLink.properties.id;
        var isRouted = this.uikitUtil.isRouted;

        // 注意：这个函数里一定不能出现this的引用
        // 如果要用this下的变量和函数，都要先赋给本地变量，然后在func中使用本地变量
        var func = function (feature) {
            if (feature.properties.id === inLinkPid) {
                return false;
            }


            var topoLinks = self.getTopoLinks(self.currentViaLink, self.currentViaLinkNode);
            topoLinks = FM.Util.differenceBy(topoLinks, viaLinks, 'properties.id');
            for (var j = 0; j < topoLinks.length; j++) {
                if (feature.properties.id == topoLinks[j].properties.id) {
                    return true;
                }
            }

            return false;
        };

        this.snapActor = this.createFeatureSnapActor('RDLINK', null, func);

        this.installSnapActor(this.snapActor);
    },

    installViaLinkSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);

        var topoLinks = this.getTopoLinks(this.currentViaLink, this.currentViaLinkNode);
        var viaLinks = this.editResult.parts[this.editResult.currentPart].vias;
        topoLinks = FM.Util.differenceBy(topoLinks, viaLinks, 'properties.id');

        var features = topoLinks.map(function (topoLink) {
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
            this.setMouseInfo('请选择进入线!');
            return;
        }
        if (!this.editResult.inNode) {
            this.setMouseInfo('请选择进入点!');
            return;
        }
        if (this.editResult.parts && this.editResult.parts.length) {
            if (this.editResult.parts[this.editResult.currentPart].vias.length) {
                this.setMouseInfo('重新选择退出线或者按空格保存!');
            } else {
                this.setMouseInfo('请选择经过线!');
            }
            return;
        }
        this.setMouseInfo('请选择退出线!');
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }
        this.defaultFeedback.clear();

        if (this.editResult.inLink) {
            var inLinkSymbol = this.symbolFactory.getSymbol('relationEdit_ls_inLink');
            // var inLink = this.featureSelector.selectByFeatureId(this.editResult.inLink, 'RDLINK');
            this.defaultFeedback.add(this.editResult.inLink.geometry, inLinkSymbol);
        }

        if (this.editResult.parts) {
            var length = this.editResult.parts.length;
            for (var i = 0; i < length; ++i) {
                var part = this.editResult.parts[i];
                if (i === this.editResult.currentPart) {
                    this.resetSelectedPart(part);
                } else {
                    this.resetPart(part);
                }
            }
        }

        // 为了让inNode压在线上,inNode最后绘制
        if (this.editResult.inNode) {
            var nodeSymbol = this.symbolFactory.getSymbol('pt_rdNode_in');
            this.defaultFeedback.add(this.editResult.inNode.geometry, nodeSymbol);
        }

        // this.feedbackController.refresh();
        this.refreshFeedback();
    },

    resetPart: function (part) {
        if (part.vias) {
            this.resetViaLinks(part.vias, 'relationEdit_ls_viaLink');
        }

        if (part.outLink) {
            var outLinkSymbol = this.symbolFactory.getSymbol('relationEdit_ls_outLink');
            var outLink = this.featureSelector.selectByFeatureId(part.outLink, 'RDLINK');
            this.defaultFeedback.add(part.outLink.geometry, outLinkSymbol);
        }
    },

    resetSelectedPart: function (part) {
        if (part.vias) {
            this.resetViaLinks(part.vias, 'ls_rdLink_via');
        }

        if (part.outLink) {
            var outLinkSymbol = this.symbolFactory.getSymbol('relationEdit_ls_outLink_selected');
            this.defaultFeedback.add(part.outLink.geometry, outLinkSymbol);
        }
    },

    resetViaLinks: function (viaLinks, symbolName) {
        if (viaLinks.length === 0) {
            return;
        }

        var viaLinkSymbol = this.symbolFactory.getSymbol(symbolName);

        for (var i = 0; i < viaLinks.length; ++i) {
            this.defaultFeedback.add(viaLinks[i].geometry, viaLinkSymbol);
        }
    },

    getTopoLinks: function (link, node) {
        var self = this;
        var topoLinks = this.featureSelector.selectByFunction(function (feature) {
            if (feature.properties.id === link.properties.id) {
                return false;
            }

            // 不可通行的link过滤掉
            if (!self.uikitUtil.canPass(link, feature)) {
                return false;
            }

            var sNodePid = parseInt(feature.properties.snode, 10);
            var eNodePid = parseInt(feature.properties.enode, 10);

            if (sNodePid === node.properties.id || eNodePid === node.properties.id) {
                return true;
            }
            return false;
        }, 'RDLINK');

        return topoLinks;
    },

    onKeyUp: function (event) {
        if (!fastmap.uikit.relationEdit.RelationTool.prototype.onKeyUp.apply(this, arguments)) {
            return false;
        }

        var key = event.key;
        var newEditResult = FM.Util.clone(this.editResult);
        switch (key) {
            case 'c':   // 修改经过线
                newEditResult.parts[newEditResult.currentPart].vias = [];
                this.switchToSelectViaLink();
                this.createOperation('修改经过线', newEditResult);
                break;
            case 'd':   // 删除退出线
                if (newEditResult.parts.length > 0) {
                    newEditResult.parts.splice(newEditResult.currentPart, 1);
                    newEditResult.currentPart = newEditResult.parts.length - 1;
                } else {
                    newEditResult.currentPart = -1;
                }
                this.selectType = 'outLink';
                this.createOperation('删除退出线', newEditResult);
                break;
            default:
                break;
        }

        return true;
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.relationEdit.RelationTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        var mousePoint = this.latlngToPoint(event.latlng);
        this.snapController.snap(mousePoint);

        return true;
    },

    switchToSelectViaLink: function () {
        this.selectType = 'viaLink';
        this.currentViaLink = this.editResult.inLink;
        this.currentViaLinkNode = this.editResult.inNode;
        if (this.uikitUtil.canPass(this.currentViaLink, this.editResult.parts[this.editResult.currentPart].outLink)) {
            this.setCenterInfo('经过线已闭合', 1000);
            this.selectType = 'outLink';
        }
        var currentPart = this.editResult.currentPart;
        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.parts[currentPart].vias = [];
        this.createOperation('清空经过线', newEditResult);
    },

    linkConnectToNode: function (link, node) {
        var sNodePid = parseInt(link.properties.snode, 10);
        var eNodePid = parseInt(link.properties.enode, 10);

        if (sNodePid === node.properties.id || eNodePid === node.properties.id) {
            return true;
        }

        return false;
    },

    getLinkOtherNode: function (link, node) {
        var sNodePid = parseInt(link.properties.snode, 10);
        var eNodePid = parseInt(link.properties.enode, 10);

        if (sNodePid === node.properties.id) {
            return this.featureSelector.selectByFeatureId(eNodePid, 'RDNODE');
        }
        return this.featureSelector.selectByFeatureId(sNodePid, 'RDNODE');
    },

    getViaLinks: function (inLink, node, outLink) {
        var params = {
            type: 'RDLANEVIA',
            data: {
                inLinkPid: inLink.properties.id,
                nodePid: node.properties.id,
                outLinkPid: outLink.properties.id,
                type: 'RDVOICEGUIDE'
            }
        };
        var outInfo = {
            key: outLink.properties.id,
            outLink: outLink,
            relationshipType: 1,
            vias: []
        };
        var queryResult;
        var self = this;
        this.dataService
            .getByCondition(params)
            .then(function (result) {
                var returnResult = false;
                if (result.length) {
                    if (result[0].hasOwnProperty('errInfo')) {
                        self.setCenterInfo('查询经过线失败：' + result[0].errInfo, 1000);
                        outInfo.vias = [];
                        outInfo.outLink = null;
                        returnResult = false;
                    } else {
                        queryResult = result[0];
                        var viaLinkIds = queryResult.links;
                        outInfo.relationshipType = result[0].relationshipType;
                        // returnResult = self.uikitUtil.getCanvasFeaturesFromServer(viaLinkIds, 'RDLINK');
                        returnResult = viaLinkIds;
                    }
                }
                return returnResult;
            })
            .then(function (res) {
                if (res) {
                    var newEditResult = FM.Util.clone(self.editResult);
                    newEditResult.currentPart = newEditResult.parts.length;
                    /* outInfo.vias = res;
                    newEditResult.parts.push(outInfo);
                    self.createOperation('选择退出线和经过线', newEditResult);*/

                    self.uikitUtil.getCanvasFeaturesFromServer(res, 'RDLINK').then(function (features) {
                        newEditResult.vias = new Array(features.length);
                        var index;
                        for (var i = 0; i < features.length; i++) {
                            index = res.indexOf(features[i].properties.id);
                            outInfo.vias[index] = features[i];
                        }
                        newEditResult.parts.push(outInfo);
                        self.createOperation('选择退出线', newEditResult);
                    });
                }
                self.selectOutLink = true;
            })
            .catch(function (err) {
                var newEditResult = FM.Util.clone(self.editResult);
                newEditResult.currentPart = newEditResult.parts.length;
                newEditResult.parts.push(outInfo);
                self.createOperation('选择退出线', newEditResult);
                self.switchToSelectViaLink();
                if (queryResult.hasOwnProperty('errInfo')) {
                    self.setCenterInfo(queryResult.errInfo, 1000);
                } else {
                    self.setCenterInfo('计算经过线失败,请手动选择经过线', 1000);
                }
            });
    },

    onSelectInLink: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.inLink = res.feature;
        var inLink = this.featureSelector.selectByFeatureId(res.feature.properties.id, 'RDLINK');
        var direct = inLink.properties.direct;
        var self = this;
        if (direct === 2) {
            // 顺方向取终点作为进入点
            this.uikitUtil.getCanvasFeaturesFromServer([inLink.properties.enode], 'RDNODE').then(function (rest) {
                newEditResult.inNode = rest[0];
                self.createOperation('选择进入线和进入点', newEditResult);
            });
        } else if (direct === 3) {
            // 逆方向取起点作为进入点
            this.uikitUtil.getCanvasFeaturesFromServer([inLink.properties.snode], 'RDNODE').then(function (rest) {
                newEditResult.inNode = rest[0];
                self.createOperation('选择进入线和进入点', newEditResult);
            });
        } else {
            this.createOperation('选择进入线', newEditResult);
        }
    },

    onSelectOutLink: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);
        var outLink = res.feature;
        var partsArray = this.editResult.parts;
        // 判断是否选择的是已选的退出线
        if (partsArray.length) {
            for (var i = 0; i < partsArray.length; i++) {
                if (partsArray[i].key == res.feature.properties.id) {
                    this.selectOutLink = true;
                    newEditResult.currentPart = i;
                    this.createOperation('选择退出线或修改经过线', newEditResult);
                    return;
                }
            }
        }
        if (this.linkConnectToNode(outLink, this.editResult.inNode)) {
            var outInfo = {
                key: res.feature.properties.id,
                outLink: res.feature,
                relationshipType: 1,
                vias: []
            };
            newEditResult.currentPart = newEditResult.parts.length;
            newEditResult.parts[newEditResult.currentPart] = outInfo;
            this.selectOutLink = true;
            this.createOperation('选择退出线', newEditResult);
        } else {
            // 退出线如果和进入点非直接挂接,则调用服务计算经过线
            this.getViaLinks(this.editResult.inLink, this.editResult.inNode, outLink);
        }
    },

    onSelectViaLink: function (res) {
        this.currentViaLink = res.feature;
        this.currentViaLinkNode = this.getLinkOtherNode(this.currentViaLink, this.currentViaLinkNode);

        var currentPart = this.editResult.currentPart;
        if (currentPart == -1) {
            return;
        }
        var outLink = this.editResult.parts[currentPart].outLink;
        if (this.uikitUtil.canPass(this.currentViaLink, outLink)) {
            this.setCenterInfo('经过线已闭合', 1000);
            this.selectType = 'outLink';
        }

        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.parts[currentPart].vias.push(this.currentViaLink);
        this.createOperation('添加经过线', newEditResult);
    },

    onLeftButtonClick: function (event) {
        if (!fastmap.uikit.relationEdit.RelationTool.prototype.onLeftButtonClick.apply(this, arguments)) {
            return false;
        }

        var mousePoint = this.latlngToPoint(event.latlng);
        var res = this.snapController.snap(mousePoint);
        if (!res) {
            return true;
        }

        var newEditResult = null;
        if (!this.editResult.inLink) {
            this.onSelectInLink(res);
        } else if (!this.editResult.inNode) {
            this.currentViaLinkNode = this.editResult.inNode;
            newEditResult = FM.Util.clone(this.editResult);
            newEditResult.inNode = this.featureSelector.selectByFeatureId(res.value, 'RDNODE');
            this.createOperation('选择进入点', newEditResult);
        } else if (this.selectType === 'outLink') {
            // 如果不是正在查询中，可以选择退出线
            if (this.selectOutLink) {
                this.selectOutLink = false;
                this.onSelectOutLink(res);
            } else {
                this.setCenterInfo('等待服务查询完毕再选择新的退出线', 1000);
            }
        } else {
            this.onSelectViaLink(res);
        }

        return true;
    }
});
