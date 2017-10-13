/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.relationEdit.RestrictionTool = fastmap.uikit.relationEdit.RelationTool.extend({
    initialize: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.eventController = fastmap.uikit.EventController();

        this.name = 'RestrictionTool';
        this.snapActor = null;
        this.isPartsPanelOpen = false;
        this.changeFromPartsPanel = false;
        this.selectType = 'outLink';
        this.currentViaLink = null;
        this.currentViaLinkNode = null;
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.relationEdit.RelationTool.prototype.startup.apply(this, arguments);

        this.isPartsPanelOpen = false;
        this.changeFromPartsPanel = false;
        this.selectType = 'outLink';
        this.currentViaLink = null;
        this.currentViaLinkNode = null;
        this.selectedFeedback = new fastmap.mapApi.Feedback();
        this.selectedFeedback.priority = 1;
        this.installFeedback(this.selectedFeedback);

        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.shutdown.apply(this, arguments);

        this.partsClosePanel();

        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.resetStatus.apply(this, arguments);

        this.snapActor = null;
        this.isPartsPanelOpen = false;
        this.changeFromPartsPanel = false;
        this.selectType = 'outLink';
        this.currentViaLink = null;
        this.currentViaLinkNode = null;

        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }

        this.selectedFeedback = null;
    },

    refresh: function () {
        this.resetFeedback();
        this.resetSnapActor();
        this.resetPartsPanel();
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
        if (!this.editResult.inLink) {
            this.setMouseInfo('请选择进入线');
            return;
        }

        if (!this.editResult.node) {
            this.setMouseInfo('请选择进入点');
            return;
        }

        if (this.editResult.currentPart !== -1) {
            if (this.selectType === 'outLink') {
                this.setMouseInfo('请选择退出线');
            } else {
                this.setMouseInfo('请选择经过线');
            }
        } else {
            this.setMouseInfo('请选择方向箭头');
        }
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

        if (this.editResult.currentPart !== -1) {
            if (this.selectType === 'outLink') {
                this.installOutLinkSnapActor();
            } else {
                this.installViaLinkSnapActor();
            }
            return;
        }
    },

    resetPartsPanel: function () {
        if (this.changeFromPartsPanel) {
            this.changeFromPartsPanel = false;
            return;
        }
        if (this.editResult.inLink && this.editResult.node) {
            this.partsOpenPanel();
        } else {
            this.partsClosePanel();
        }
    },

    partsOpenPanel: function () {
        var options = this.getPartsPanelOptions();
        if (this.isPartsPanelOpen) {
            this.eventController.fire(L.Mixin.EventTypes.PARTSREFRESH, options);
            return;
        }

        this.eventController.fire(L.Mixin.EventTypes.PARTSOPENPANEL, options);

        this.eventController.on(L.Mixin.EventTypes.PARTSSELECTEDCHANGED, this.onPartsSelectedChanged);
        this.eventController.on(L.Mixin.EventTypes.PARTSADD, this.onPartsAdd);
        this.eventController.on(L.Mixin.EventTypes.PARTSDEL, this.onPartsDel);

        this.isPartsPanelOpen = true;
    },

    getPartsPanelOptions: function () {
        var items = this.editResult.parts.map(function (part, index) {
            return {
                direct: part.key,
                type: part.type
            };
        });

        var options = {
            panelName: 'RestrictionTopoPanel',
            data: {
                items: items,
                index: this.editResult.currentPart,
                truckFlag: this.editResult.isTruckRestriction
            }
        };

        return options;
    },

    partsClosePanel: function () {
        if (!this.isPartsPanelOpen) {
            return;
        }

        var options = this.getPartsPanelOptions();
        this.eventController.fire(L.Mixin.EventTypes.PARTSCLOSEPANEL, options);

        this.eventController.off(L.Mixin.EventTypes.PARTSSELECTEDCHANGED, this.onPartsSelectedChanged);
        this.eventController.off(L.Mixin.EventTypes.PARTSADD, this.onPartsAdd);
        this.eventController.off(L.Mixin.EventTypes.PARTSDEL, this.onPartsDel);

        this.isPartsPanelOpen = false;
    },

    onPartsSelectedChanged: function (event) {
        var newEditResult = FM.Util.clone(this.editResult);
        var index = event.index;
        newEditResult.currentPart = index;
        this.changeFromPartsPanel = true;
        this.createOperation('选中退出线箭头', newEditResult);
    },

    onPartsAdd: function (event) {
        var key = event.key;
        var index = event.index;
        var part = {
            key: key,
            viaLinks: [],
            outLink: null,
            type: 0, // 卡车交限默认为未验证
            relationshipType: 1 // 默认路口交限
        };
        // 如果是普通交限，则根据交限的类型修改；卡车交限为未验证
        if (!this.editResult.isTruckRestriction) {
            part.type = event.flag;
        }

        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.parts[index] = part;
        newEditResult.currentPart = index;
        this.createOperation('添加退出线箭头', newEditResult);

        newEditResult = FM.Util.clone(this.editResult);
        var self = this;
        this.pause();
        this.getAutoOutLinks(newEditResult.inLink, newEditResult.node, [key + ''])
            .then(function (rest) {
                if (rest) {
                    var newPart = newEditResult.parts[newEditResult.currentPart];
                    FM.extend(newPart, rest);
                    self.createOperation('自动计算退出线和经过线', newEditResult);
                }
                self.continue();
            });

        this.changeFromPartsPanel = true;
    },

    onPartsDel: function (event) {
        var index = event.index;
        this.changeFromPartsPanel = true;
        this.selectType = 'outLink';
        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.parts.splice(index, 1);
        if (newEditResult.currentPart >= index) {
            newEditResult.currentPart--;
        }
        this.createOperation('删除退出线箭头', newEditResult);
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
        pairs.push({
            key: sPoint,
            value: sNodePid
        });
        pairs.push({
            key: ePoint,
            value: eNodePid
        });
        this.snapActor = this.createGivenPointSnapActor(pairs);

        this.installSnapActor(this.snapActor);
    },

    installOutLinkSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);

        var exceptions = [this.editResult.inLink.properties.id];
        var temp;
        for (var i = 0; i < this.editResult.parts.length; i++) {
            temp = this.editResult.parts[i].outLink;
            if (temp) {
                exceptions.push(temp.properties.id);
            }
        }
        this.snapActor = this.createFeatureSnapActor('RDLINK', exceptions);

        this.installSnapActor(this.snapActor);
    },

    installViaLinkSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);

        var self = this;
        var func = function (feature) {
            if (feature.properties.id === self.currentViaLink) {
                return false;
            }

            if (!self.uikitUtil.isRouted(self.currentViaLinkNode, feature)) {
                return false;
            }

            return true;
        };

        this.snapActor = this.createFeatureSnapActor('RDLINK', null, func);

        this.installSnapActor(this.snapActor);
    },

    getAutoOutLinks: function (inLink, inNode, arrows) {
        var param = {
            type: 'RDLINK',
            data: {
                inLinkPid: inLink.properties.id,
                inNodePid: inNode.properties.id,
                arrows: arrows
            }
        };
        var self = this;
        var exists = [];
        var link;
        for (var i = 0; i < this.editResult.parts.length; i++) {
            link = this.editResult.parts[i].outLink;
            if (link) {
                exists.push(link.properties.id);
            }
        }
        return this.dataService
            .getByCondition(param)
            .then(function (res) {
                var temp = res[0][arrows[0]];
                var pids = [];
                for (var j = 0; j < temp.length; j++) {
                    if (exists.indexOf(temp[j]) < 0) {
                        pids.push(temp[j]);
                        break;
                    }
                }

                if (pids.length > 0) {
                    return self.uikitUtil.getCanvasFeaturesFromServer(pids, 'RDLINK');
                }
                return [];
            })
            .then(function (res) {
                if (res.length > 0) {
                    return self.getViaLinks(inLink, inNode, res[0])
                        .then(function (rest) {
                            var part = {
                                outLink: res[0]
                            };
                            if (rest) {
                                FM.extend(part, rest);
                            } else {
                                FM.extend(part, {
                                    relationshipType: 1,
                                    viaLinks: []
                                });
                            }

                            return part;
                        });
                }

                self.setCenterInfo('自动计算退出线失败，请手动选择经过线', 1000);
                return null;
            })
            .catch(function (err) {
                self.setCenterInfo('自动计算退出线失败，请手动选择经过线', 1000);
                return null;
            });
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

        if (this.editResult.parts) {
            var length = this.editResult.parts.length;
            for (var i = 0; i < length; ++i) {
                var part = this.editResult.parts[i];
                this.resetPart(this.defaultFeedback, part);
            }
        }

        // 为了让node压在线上,node最后绘制
        if (this.editResult.node) {
            var nodeSymbol = this.symbolFactory.getSymbol('relationEdit_pt_node');
            this.defaultFeedback.add(this.editResult.node.geometry, nodeSymbol);
        }

        this.refreshFeedback();

        this.resetSelectedFeedback();
    },

    resetPart: function (feedback, part) {
        if (part.viaLinks) {
            this.resetViaLinks(feedback, part.viaLinks, 'relationEdit_ls_viaLink');
        }

        if (part.outLink) {
            var outLinkSymbol = this.symbolFactory.getSymbol('relationEdit_ls_outLink');
            feedback.add(part.outLink.geometry, outLinkSymbol);
        }
    },

    resetSelectedPart: function (feedback, part) {
        if (part.viaLinks) {
            this.resetViaLinks(feedback, part.viaLinks, 'relationEdit_ls_viaLink_selected');
        }

        if (part.outLink) {
            var outLinkSymbol = this.symbolFactory.getSymbol('relationEdit_ls_outLink_selected');
            feedback.add(part.outLink.geometry, outLinkSymbol);
        }
    },

    resetViaLinks: function (feedback, viaLinks, symbolName) {
        if (viaLinks.length === 0) {
            return;
        }

        var viaLinkSymbol = this.symbolFactory.getSymbol(symbolName);

        for (var i = 0; i < viaLinks.length; ++i) {
            var viaLink = viaLinks[i];
            feedback.add(viaLink.geometry, viaLinkSymbol);
        }
    },

    resetSelectedFeedback: function () {
        if (!this.selectedFeedback) {
            return;
        }

        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.selectedFeedback.clear();

        if (this.editResult.currentPart >= 0) {
            for (var i = 0; i < this.editResult.parts.length; ++i) {
                if (i === this.editResult.currentPart) {
                    this.resetSelectedPart(this.selectedFeedback, this.editResult.parts[i]);
                }
            }

            var that = this;
            var items = this.selectedFeedback.getDrawItems().slice();
            this.interval = setInterval(function () {
                var temp = that.selectedFeedback.getDrawItems();
                if (temp.length > 0) {
                    that.selectedFeedback.clear();
                } else {
                    that.selectedFeedback.setDrawItems(items);
                }
                that.refreshFeedback();
            }, 300);
        }

        this.refreshFeedback();
    },

    onKeyUp: function (event) {
        if (!fastmap.uikit.relationEdit.RelationTool.prototype.onKeyUp.apply(this, arguments)) {
            return false;
        }

        var key = event.key;
        switch (key) {
            case 'a':
                this.switchToSelectOutLink();
                break;
            case 's':
                this.switchToSelectViaLink();
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
            var newEditResult = FM.Util.clone(this.editResult);
            newEditResult.node = this.featureSelector.selectByFeatureId(res.value, 'RDNODE');
            this.createOperation('选择进入点', newEditResult);
        } else {
            var currentPart = this.editResult.currentPart;
            if (currentPart !== -1) {
                if (this.selectType === 'outLink') {
                    this.onSelectOutLink(res);
                } else {
                    this.onSelectViaLink(res);
                }
            }
        }

        return true;
    },

    switchToSelectViaLink: function () {
        var currentPart = this.editResult.currentPart;
        if (this.editResult.parts[currentPart].relationshipType === 1) {
            this.setCenterInfo('路口交限不允许编辑经过线', 1000);
            return;
        }

        this.selectType = 'viaLink';
        this.currentViaLink = this.editResult.inLink.properties.id;
        this.currentViaLinkNode = this.editResult.node.properties.id;
        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.parts[currentPart].viaLinks = [];
        this.createOperation('清空经过线', newEditResult);
    },

    switchToSelectOutLink: function () {
        this.selectType = 'outLink';
        this.refresh();
    },

    onSelectInLink: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);
        var inLink = res.feature;
        newEditResult.inLink = inLink;
        var direct = inLink.properties.direct;
        if (direct === 2) {
            // 顺方向取终点作为进入点
            var eNodeId = parseInt(inLink.properties.enode, 10);
            newEditResult.node = this.featureSelector.selectByFeatureId(eNodeId, 'RDNODE');
            this.createOperation('选择进入线和进入点', newEditResult);
        } else if (direct === 3) {
            // 逆方向取起点作为进入点
            var sNodeId = parseInt(inLink.properties.snode, 10);
            newEditResult.node = this.featureSelector.selectByFeatureId(sNodeId, 'RDNODE');
            this.createOperation('选择进入线和进入点', newEditResult);
        } else {
            this.createOperation('选择进入线', newEditResult);
        }
    },

    onSelectOutLink: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);
        var currentPart = newEditResult.parts[newEditResult.currentPart];
        var outLink = res.feature;
        currentPart.outLink = outLink;
        if (this.uikitUtil.isHooked(this.editResult.node, outLink)) {
            currentPart.relationshipType = 1; // 直接挂接则为路口交限
            currentPart.viaLinks = []; // 清空经过线
            this.createOperation('选择退出线', newEditResult);
        } else {
            // 退出线如果和进入点非直接挂接,则调用服务计算经过线
            var self = this;
            this.pause();
            this.getViaLinks(this.editResult.inLink, this.editResult.node, outLink).then(function (rest) {
                if (rest) {
                    currentPart.relationshipType = rest.relationshipType;
                    currentPart.viaLinks = rest.viaLinks;
                }
                self.createOperation('选择退出线和经过线', newEditResult);
                self.continue();
            });
        }
    },

    onSelectViaLink: function (res) {
        this.currentViaLink = res.feature.properties.id;
        this.currentViaLinkNode = this.uikitUtil.getOtherNode(res.feature, this.currentViaLinkNode);

        var currentPart = this.editResult.currentPart;
        var outLink = this.editResult.parts[currentPart].outLink;
        if (this.uikitUtil.isRouted(this.currentViaLinkNode, outLink)) {
            this.setCenterInfo('经过线已闭合', 1000);
            this.selectType = 'outLink';
        }

        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.parts[currentPart].viaLinks.push(res.feature);
        this.createOperation('添加经过线', newEditResult);
    },

    getViaLinks: function (inLink, node, outLink) {
        var params = {
            type: 'RDLANEVIA',
            data: {
                inLinkPid: inLink.properties.id,
                nodePid: node.properties.id,
                outLinkPid: outLink.properties.id
            }
        };
        var self = this;
        var relation;
        return this.dataService
            .getByCondition(params)
            .then(function (res) {
                var viaLinkIds = res[0].links;
                relation = res[0].relationshipType || 1;
                if (viaLinkIds.length > 0) {
                    return self.uikitUtil.getCanvasFeaturesFromServer(viaLinkIds, 'RDLINK');
                }
                return [];
            })
            .then(function (res) {
                var vias;
                if (relation === 1) {
                    vias = [];
                } else {
                    vias = res;
                    if (vias.length === 0) {
                        self.setCenterInfo('自动计算经过线失败，请手动选择经过线', 1000);
                    }
                }
                return {
                    relationshipType: relation,
                    viaLinks: vias
                };
            })
            .catch(function (err) {
                self.setCenterInfo('自动计算经过线失败，请手动选择经过线', 1000);
                return null;
            });
    }
});
