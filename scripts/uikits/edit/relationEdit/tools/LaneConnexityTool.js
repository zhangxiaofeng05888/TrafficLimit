/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.relationEdit.LaneConnexityTool = fastmap.uikit.relationEdit.RelationTool.extend({
    initialize: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.eventController = fastmap.uikit.EventController();

        this.name = 'LaneConnexityTool';

        this.directMapping = {
            d: '4',
            l: '42',
            b: '2',
            g: '21',
            a: '1',
            f: '13',
            c: '3',
            e: '41',
            i: '413',
            j: '421',
            k: '23',
            h: '213',
            m: '423',
            o: '0'
        };
    },

    startup: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.startup.apply(this, arguments);

        this.snapActor = null;
        this.changeFromPartsPanel = false;
        this.selectedLaneIndex = -1;
        this.selectedFeedback = new fastmap.mapApi.Feedback();
        this.selectedFeedback.priority = 1;
        this.installFeedback(this.selectedFeedback);

        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.shutdown.apply(this, arguments);

        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.resetStatus.apply(this, arguments);

        this.partsClosePanel();

        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }

        this.selectedFeedback = null;
    },

    refresh: function () {
        this.resetFeedback();
        this.resetSelectedFeedback();
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

        if (!this.editResult.inNode) {
            this.setMouseInfo('请选择进入点');
            return;
        }

        if (this.editResult.lanes.length == 0) {
            this.setMouseInfo('请选择方向箭头');
            // return;
        }

        if (this.editResult.editingType === 'outLink') {
            this.setMouseInfo('请选择退出线, 或者按空格键保存');
        } else if (this.editResult.currentTopoIndex == -1) {
            this.setMouseInfo('请选择要编辑经过线的退出线');
        } else {
            this.setMouseInfo('请编辑经过线');
        }
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

        if (this.editResult.editingType == 'outLink') {
            this.installOutLinkSnapActor();
        } else {
            this.installViaLinkSnapActor();
        }
        return;
    },

    resetPartsPanel: function () {
        // if (this.changeFromPartsPanel) {
        //     this.changeFromPartsPanel = false;
        //     return;
        // }
        if (this.editResult.inLink && this.editResult.inNode) {
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
        this.eventController.on('laneConnexity-addLane', this.onAddLane);
        this.eventController.on('laneConnexity-selectLane', this.onSelectLane);
        this.eventController.on('laneConnexity-deleteLane', this.onDeleteLane);
        this.eventController.on('laneConnexity-swapLane', this.onSwapLane);
        this.eventController.on('laneConnexity-changeLaneDirect', this.onChangeLaneDirect);
        this.eventController.on('laneConnexity-toggleBusLane', this.onToggleBusLane);
        this.eventController.on('laneConnexity-toggleExtendLane', this.onToggleExtendLane);

        this.isPartsPanelOpen = true;
    },

    getPartsPanelOptions: function () {
        var panelName = 'LaneConnexityPanel';

        var options = {
            panelName: panelName
        };

        if (this.editResult) {
            options.data = {
                lanes: FM.Util.clone(this.editResult.lanes)
            };
        }

        return options;
    },

    partsClosePanel: function () {
        if (!this.isPartsPanelOpen) {
            return;
        }

        this.eventController.off('laneConnexity-addLane', this.onAddLane);
        this.eventController.off('laneConnexity-selectLane', this.onSelectLane);
        this.eventController.off('laneConnexity-deleteLane', this.onDeleteLane);
        this.eventController.off('laneConnexity-swapLane', this.onSwapLane);
        this.eventController.off('laneConnexity-changeLaneDirect', this.onChangeLaneDirect);
        this.eventController.off('laneConnexity-toggleBusLane', this.onToggleBusLane);
        this.eventController.off('laneConnexity-toggleExtendLane', this.onToggleExtendLane);
        var options = this.getPartsPanelOptions();
        this.eventController.fire(L.Mixin.EventTypes.PARTSCLOSEPANEL, options);

        this.isPartsPanelOpen = false;
    },

    _autoCalcTopos: function (direct) {
        var newEditResult = FM.Util.clone(this.editResult);
        var exists = [];
        for (var i = 0; i < newEditResult.topos.length; i++) {
            exists.push(newEditResult.topos[i].outLink.properties.id);
        }

        var inLink = newEditResult.inLink;
        var inNode = newEditResult.inNode;
        var self = this;
        this.pause();
        this.getOutLinks(inLink.properties.id, inNode.properties.id, this.directMapping[direct].split(''))
            .then(function (rest) {
                if (rest.length > 0) {
                    // 由于服务端不支持并行查询，因此这里用setTimeout将请求做了串行化
                    var p = [];
                    var _temp = function (k) {
                        return function () {
                            p.push(self.addTopo(newEditResult.lanes, inLink, inNode, rest[k]).then(function (tp) {
                                newEditResult.topos.push(tp);
                            }));
                        };
                    };
                    var cnt = 0;
                    for (var j = 0; j < rest.length; j++) {
                        if (exists.indexOf(rest[j].properties.id) === -1) {
                            setTimeout(_temp(j), 100 * cnt++);
                        }
                    }

                    setTimeout(function () {
                        if (p.length > 0) {
                            Promise.all(p).then(function (d) {
                                self.createOperation('自动计算退出线和经过线', newEditResult);
                                self.continue();
                            }).catch(function (err) {
                                self.setCenterInfo('自动计算退出线失败, 请手动选择', 1000);
                                self.continue();
                            });
                        } else {
                            self.continue();
                        }
                    }, 100 * cnt);
                } else {
                    self.setCenterInfo('自动计算退出线失败, 请手动选择', 1000);
                    self.continue();
                }
            });
    },

    onAddLane: function (data) {
        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.lanes.push(FM.Util.clone(data.lane));

        // 自动维护与已有退出线的匹配关系
        var index = newEditResult.lanes.length - 1;
        for (var i = 0; i < newEditResult.topos.length; i++) {
            if (this.directMapping[data.lane.direct].indexOf(newEditResult.topos[i].reachDir) >= 0) {
                newEditResult.topos[i].inLaneInfo[index] = 1;
            }
        }
        this.createOperation('新增车道及方向', newEditResult);

        // 自动计算退出线
        this._autoCalcTopos(data.lane.direct);

        this.changeFromPartsPanel = true;
    },

    onSelectLane: function (data) {
        // 高亮匹配的退出线
        this.selectedLaneIndex = data.index;

        // this.resetFeedback();
        this.resetSelectedFeedback();
    },

    onDeleteLane: function (data) {
        var index = data.index;
        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.lanes.splice(index, 1);
        for (var i = 0; i < newEditResult.topos.length; i++) {
            newEditResult.topos[i].inLaneInfo.splice(index, 1);
            newEditResult.topos[i].inLaneInfo.push(0);
            newEditResult.topos[i].busLaneInfo.splice(index, 1);
            newEditResult.topos[i].busLaneInfo.push(0);

            // 删除与车道没有匹配关系的topo ？
            if (FM.Util.binaryArray2Decimal(newEditResult.topos[i].inLaneInfo) == 0 && FM.Util.binaryArray2Decimal(newEditResult.topos[i].busLaneInfo) == 0) {
                newEditResult.topos.splice(i, 1);
                i--;
            }
        }

        if (this.selectedLaneIndex === index) {
            this.selectedLaneIndex = -1;
        }

        this.changeFromPartsPanel = true;

        this.createOperation('删除车道', newEditResult);
    },

    onSwapLane: function (data) {
        var sIndex = data.srcIndex;
        var eIndex = data.destDirect;
        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.lanes.splice(eIndex, 0, newEditResult.lanes.splice(sIndex, 1)[0]);
        for (var i = 0; i < newEditResult.topos.length; i++) {
            newEditResult.topos[i].inLaneInfo.splice(eIndex, 0, newEditResult.topos[i].inLaneInfo.splice(sIndex, 1)[0]);
            newEditResult.topos[i].busLaneInfo.splice(eIndex, 0, newEditResult.topos[i].busLaneInfo.splice(sIndex, 1)[0]);
        }

        this.changeFromPartsPanel = true;

        this.createOperation('修改车道序号', newEditResult);
    },

    onChangeLaneDirect: function (data) {
        var index = data.index;
        var direct = data.direct;
        var busFlag = data.busFlag;
        var newEditResult = FM.Util.clone(this.editResult);
        if (busFlag) {
            newEditResult.lanes[index].busDirect = direct;
        } else {
            newEditResult.lanes[index].direct = direct;
        }

        // 自动维护当前车道与退出线的匹配关系
        var topo;
        var exists = [];
        for (var i = 0; i < newEditResult.topos.length; i++) {
            topo = newEditResult.topos[i];
            if (this.directMapping[direct].indexOf(topo.reachDir) >= 0) {
                if (busFlag) {
                    topo.busLaneInfo[index] = 1;
                } else {
                    topo.inLaneInfo[index] = 1;
                }
            } else {
                if (busFlag) {
                    topo.busLaneInfo[index] = 0;
                } else {
                    topo.inLaneInfo[index] = 0;
                }
            }

            // 删除与车道没有匹配关系的topo ？
            if (FM.Util.binaryArray2Decimal(newEditResult.topos[i].inLaneInfo) == 0 && FM.Util.binaryArray2Decimal(newEditResult.topos[i].busLaneInfo) == 0) {
                newEditResult.topos.splice(i, 1);
                i--;
            } else {
                exists.push(topo.outLink.properties.id);
            }
        }
        this.createOperation('修改车道方向', newEditResult);

        this._autoCalcTopos(direct);

        this.changeFromPartsPanel = true;
    },

    onToggleBusLane: function (data) {
        var index = data.index;
        var newEditResult = FM.Util.clone(this.editResult);
        var oldDir = newEditResult.lanes[index].busDirect;
        var newDir;
        if (oldDir) {
            newDir = null;
        } else {
            newDir = newEditResult.lanes[index].direct;
        }
        newEditResult.lanes[index].busDirect = newDir;

        // 自动维护当前车道与退出线的匹配关系
        var topo;
        for (var i = 0; i < newEditResult.topos.length; i++) {
            topo = newEditResult.topos[i];
            if (oldDir && this.directMapping[oldDir].indexOf(topo.reachDir) >= 0) {
                topo.busLaneInfo[index] = 0;
            } else if (newDir && this.directMapping[newDir].indexOf(topo.reachDir) >= 0) {
                topo.busLaneInfo[index] = 1;
            }

            // 删除与车道没有匹配关系的topo ？
            if (FM.Util.binaryArray2Decimal(newEditResult.topos[i].inLaneInfo) == 0 && FM.Util.binaryArray2Decimal(newEditResult.topos[i].busLaneInfo) == 0) {
                newEditResult.topos.splice(i, 1);
                i--;
            }
        }

        this.changeFromPartsPanel = true;

        this.createOperation('修改公交车道属性', newEditResult);
    },

    onToggleExtendLane: function (data) {
        var index = data.index;
        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.lanes[index].extend = 1 - newEditResult.lanes[index].extend;

        this.changeFromPartsPanel = true;

        this.createOperation('修改附加车道属性', newEditResult);
    },

    installInLinkSnapActor: function () {
        this.snapActor = this.createFeatureSnapActor('RDLINK', null);

        this.installSnapActor(this.snapActor);
    },

    installNodeSnapActor: function () {
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
        var exceptions = [this.editResult.inLink.properties.id];
        this.snapActor = this.createFeatureSnapActor('RDLINK', exceptions);

        this.installSnapActor(this.snapActor);
    },

    installViaLinkSnapActor: function () {
        var i;
        if (this.editResult.currentTopoIndex >= 0) {
            var topo = this.editResult.topos[this.editResult.currentTopoIndex];

            var pid = this.editResult.inNode.properties.id;
            var nodePids = [pid];
            for (i = 0; i < topo.viaLinks.length; i++) {
                pid = this.uikitUtil.getOtherNode(topo.viaLinks[i], pid);
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

                for (var k = 0; k < nodePids.length; k++) {
                    if (isRouted(nodePids[k], feature)) {
                        return true;
                    }
                }

                return false;
            };

            this.snapActor = this.createFeatureSnapActor('RDLINK', null, func);
        } else {
            var features = [];
            for (i = 0; i < this.editResult.topos.length; i++) {
                if (!this.uikitUtil.isHooked(this.editResult.inNode, this.editResult.topos[i].outLink)) {
                    features.push({
                        id: this.editResult.topos[i].outLink.properties.id,
                        geoLiveType: 'RDLINK'
                    });
                }
            }

            this.snapActor = this.createGivenFeatureSnapActor(features);
        }

        this.installSnapActor(this.snapActor);
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

        var len = this.editResult.topos.length;
        var topo;
        if (len > 0) {
            for (var i = 0; i < len; ++i) {
                topo = this.editResult.topos[i];
                if (i === this.editResult.currentTopoIndex) {
                    this.feedbackOutLink(this.defaultFeedback, topo.outLink, 2);
                    this.feedbackViaLinks(this.defaultFeedback, topo.viaLinks, 2);
                } else {
                    this.feedbackOutLink(this.defaultFeedback, topo.outLink, 0);
                    this.feedbackViaLinks(this.defaultFeedback, topo.viaLinks, 0);
                }
            }
        }

        // 为了让node压在线上,node最后绘制
        if (this.editResult.inNode) {
            var nodeSymbol = this.symbolFactory.getSymbol('relationEdit_pt_node');
            this.defaultFeedback.add(this.editResult.inNode.geometry, nodeSymbol);
        }

        this.refreshFeedback();
    },

    feedbackOutLink: function (feedback, outLink, flag) {
        var symbol;
        if (flag === 0) {
            symbol = this.symbolFactory.getSymbol('relationEdit_ls_outLink');
        } else if (flag === 1) {
            symbol = this.symbolFactory.getSymbol('relationEdit_ls_outLink_selected');
        } else if (flag === 2) {
            symbol = this.symbolFactory.getSymbol('relationEdit_ls_outLink_editing');
        }
        feedback.add(outLink.geometry, symbol);
    },

    feedbackViaLinks: function (feedback, viaLinks, flag) {
        var symbol;
        if (flag === 0) {
            symbol = this.symbolFactory.getSymbol('relationEdit_ls_viaLink');
        } else if (flag === 1) {
            symbol = this.symbolFactory.getSymbol('relationEdit_ls_viaLink_selected');
        } else if (flag === 2) {
            symbol = this.symbolFactory.getSymbol('relationEdit_ls_viaLink_editing');
        }
        for (var i = 0; i < viaLinks.length; i++) {
            feedback.add(viaLinks[i].geometry, symbol);
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

        if (this.selectedLaneIndex >= 0) {
            var topo;
            for (var i = 0; i < this.editResult.topos.length; ++i) {
                if (i !== this.editResult.currentTopoIndex) {
                    topo = this.editResult.topos[i];
                    if (topo.inLaneInfo[this.selectedLaneIndex] === 1 || topo.busLaneInfo[this.selectedLaneIndex] === 1) {
                        this.feedbackOutLink(this.selectedFeedback, topo.outLink, 1);
                        this.feedbackViaLinks(this.selectedFeedback, topo.viaLinks, 1);
                    }
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

        // this.selectedLaneIndex = -1; // 清理车道选择

        if (!this.editResult.inLink) {
            this.onSelectInLink(res);
        } else if (!this.editResult.inNode) {
            var newEditResult = FM.Util.clone(this.editResult);
            newEditResult.inNode = this.featureSelector.selectByFeatureId(res.value, 'RDNODE');
            this.createOperation('选择进入点', newEditResult);
        } else if (this.editResult.editingType === 'outLink') {
            this.onSelectOutLink(res);
        } else {
            this.onSelectViaLink(res);
        }

        return true;
    },

    _getToposWithViaLinks: function (topos, inNode) {
        var ret = {};
        for (var i = 0; i < topos.length; i++) {
            if (!this.uikitUtil.isHooked(inNode, topos[i].outLink)) {
                ret[i] = topos[i];
            }
        }
        return ret;
    },

    switchToSelectViaLink: function () {
        var toposWithViaLinks = this._getToposWithViaLinks(this.editResult.topos, this.editResult.inNode);
        var keys = Object.getOwnPropertyNames(toposWithViaLinks);
        if (keys.length == 0) {
            this.setCenterInfo('没有经过线需要修改', 1000);
            return;
        } else if (keys.length == 1) {
            this.editResult.editingType = 'viaLink';
            this.editResult.currentTopoIndex = parseInt(keys[0], 10);
        } else {
            this.editResult.editingType = 'viaLink';
            this.editResult.currentTopoIndex = -1;
        }

        this.refresh();
    },

    switchToSelectOutLink: function () {
        this.editResult.editingType = 'outLink';
        this.editResult.currentTopoIndex = -1;
        this.refresh();
    },

    onSelectInLink: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);
        var link = res.feature;
        newEditResult.inLink = link;
        var direct = link.properties.direct;
        if (direct === 2 || direct === 3) { // 单方向自动选中进入点
            var nodeId = this.uikitUtil.getDirectEndNode(link, direct);
            this.pause();
            var self = this;
            this.uikitUtil.getCanvasFeaturesFromServer([nodeId], 'RDNODE').then(function (data) {
                newEditResult.inNode = data[0];
                self.createOperation('选择进入线和进入点', newEditResult);
                self.continue();
            });
        } else {
            this.createOperation('选择进入线', newEditResult);
        }
    },

    onSelectOutLink: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);
        var outLink = res.feature;
        var flag = false;
        var self = this;
        // 如果已存在，则进行反选
        for (var i = 0; i < newEditResult.topos.length; i++) {
            if (outLink.properties.id === newEditResult.topos[i].outLink.properties.id) {
                // 反选退出线
                newEditResult.topos.splice(i, 1);
                flag = true;
                break;
            }
        }

        // 如果不存在，则进行新增
        if (!flag) {
            this.pause();
            this.addTopo(newEditResult.lanes, newEditResult.inLink, newEditResult.inNode, outLink).then(function (rest) {
                newEditResult.topos.push(rest);
                self.createOperation('新增退出线', newEditResult);
                self.continue();
            });
        } else {
            this.createOperation('删除退出线', newEditResult);
        }
    },

    _rebuildViaLinks: function (inNodePid, existsViaLinks, newLink) {
        var nodePid = inNodePid;

        var viaLinks = [];
        var i;
        var len = existsViaLinks.length;
        var f = false;
        // 如果在原经过线中存在，则反选
        for (i = 0; i < len; i++) {
            if (existsViaLinks[i].properties.id === newLink.properties.id) {
                Array.prototype.push.apply(viaLinks, existsViaLinks.slice(0, i));
                f = true;
                break;
            }
        }
        if (!f) {
            var index = len;
            if (this.uikitUtil.isRouted(nodePid, newLink)) {
                viaLinks.push(newLink);
                index = 1;
            } else {
                for (i = 0; i < len; i++) {
                    viaLinks.push(existsViaLinks[i]);
                    nodePid = this.uikitUtil.getOtherNode(existsViaLinks[i], nodePid);
                    if (this.uikitUtil.isRouted(nodePid, newLink)) {
                        viaLinks.push(newLink);
                        index = i + 2;
                        break;
                    }
                }
            }

            // 如果选择的link的退出点与原经过线挂接，则向后补
            nodePid = this.uikitUtil.getOtherNode(newLink, nodePid);
            for (i = index; i < len; i++) {
                if (this.uikitUtil.isRouted(nodePid, existsViaLinks[i])) {
                    Array.prototype.push.apply(viaLinks, existsViaLinks.slice(i));
                    break;
                }
            }
        }

        return viaLinks;
    },

    onSelectViaLink: function (res) {
        var feature = res.feature;
        if (this.editResult.currentTopoIndex == -1) {
            var toposWithViaLinks = this._getToposWithViaLinks(this.editResult.topos, this.editResult.inNode);
            for (var k in toposWithViaLinks) {
                if (toposWithViaLinks.hasOwnProperty(k) && feature.properties.id == toposWithViaLinks[k].outLink.properties.id) {
                    this.editResult.currentTopoIndex = parseInt(k, 10);
                    break;
                }
            }
            this.refresh();
        } else {
            var topo = this.editResult.topos[this.editResult.currentTopoIndex];
            var newViaLinks = this._rebuildViaLinks(this.editResult.inNode.properties.id, topo.viaLinks, feature);

            var newEditResult = FM.Util.clone(this.editResult);
            newEditResult.topos[newEditResult.currentTopoIndex].viaLinks = newViaLinks;
            this.createOperation('编辑经过线', newEditResult);

            if (newViaLinks.length > 0) {
                if (this.uikitUtil.canPass(newViaLinks[newViaLinks.length - 1], topo.outLink)) {
                    this.setCenterInfo('经过线已闭合', 1000);
                    this.switchToSelectOutLink();
                }
            }
        }
    },

    _getOutNode: function (inNode, viaLinks) {
        var nodePid = inNode.properties.id;
        var sNodePid,
            eNodePid;
        if (viaLinks.length > 0) {
            for (var i = 0; i < viaLinks.length; i++) {
                sNodePid = parseInt(viaLinks[i].properties.snode, 10);
                eNodePid = parseInt(viaLinks[i].properties.enode, 10);
                if (nodePid == sNodePid) {
                    nodePid = eNodePid;
                } else if (nodePid == eNodePid) {
                    nodePid = sNodePid;
                } else {
                    nodePid = null;
                    break;
                }
            }
        }

        return nodePid;
    },

    _getReachDir: function (inLink, inNodePid, outNodePid, outLink) {
        var pt1,
            pt2,
            pt3,
            pt4;
        if (parseInt(inLink.properties.enode, 10) == inNodePid) {
            pt1 = inLink.geometry.coordinates[inLink.geometry.coordinates.length - 2];
            pt2 = inLink.geometry.coordinates[inLink.geometry.coordinates.length - 1];
        } else {
            pt1 = inLink.geometry.coordinates[1];
            pt2 = inLink.geometry.coordinates[0];
        }

        if (parseInt(outLink.properties.snode, 10) == outNodePid) {
            pt3 = outLink.geometry.coordinates[0];
            pt4 = outLink.geometry.coordinates[1];
        } else {
            pt3 = outLink.geometry.coordinates[outLink.geometry.coordinates.length - 1];
            pt4 = outLink.geometry.coordinates[outLink.geometry.coordinates.length - 2];
        }

        pt1 = this.geometryFactory.createPoint(pt1);
        pt2 = this.geometryFactory.createPoint(pt2);
        pt3 = this.geometryFactory.createPoint(pt3);
        pt4 = this.geometryFactory.createPoint(pt4);

        var v1 = pt2.minus(pt1);
        var v2 = pt4.minus(pt3);

        var d = v2.angleTo(v1);
        var z = v2.cross(v1);

        if (d <= 45) {
            return 1;
        } else if (d > 135) {
            return 4;
        } else if (z > 0) {
            return 3;
        }

        return 2;
    },

    getViaLinks: function (inLinkPid, inNodePid, outLinkPid) {
        var params = {
            type: 'RDLANEVIA',
            data: {
                inLinkPid: inLinkPid,
                nodePid: inNodePid,
                outLinkPid: outLinkPid
            }
        };
        var self = this;
        return this.dataService
            .getByCondition(params)
            .then(function (res) {
                var linkPids = res[0].links;
                var relation = res[0].relationshipType;
                if (linkPids.length > 0) {
                    return self.uikitUtil.getCanvasFeaturesFromServer(linkPids, 'RDLINK').then(function (features) {
                        return {
                            relationship: relation,
                            links: features
                        };
                    });
                }
                return {
                    relationship: relation,
                    links: []
                };
            });
    },

    getOutLinks: function (inLinkPid, inNodePid, arrows) {
        var param = {
            type: 'RDLINK',
            data: {
                inLinkPid: inLinkPid,
                inNodePid: inNodePid,
                arrows: arrows
            }
        };
        var self = this;

        return this.dataService.getByCondition(param)
            .then(function (data) {
                var linkPids = [];
                var rest = data[0];
                for (var k in rest) {
                    if (rest.hasOwnProperty(k)) {
                        Array.prototype.push.apply(linkPids, rest[k]);
                    }
                }
                if (linkPids.length > 0) {
                    return self.uikitUtil.getCanvasFeaturesFromServer(linkPids, 'RDLINK');
                }

                return [];
            })
            .catch(function (err) {
                return [];
            });
    },

    addTopo: function (lanes, inLink, inNode, outLink) {
        var newTopo = {
            outLink: outLink,
            inLaneInfo: FM.Util.decimal2BinaryArray(0, 16),
            busLaneInfo: FM.Util.decimal2BinaryArray(0, 16),
            reachDir: 0,
            relationship: 1, // 默认路口关系
            viaLinks: []
        };
        var self = this;

        if (this.uikitUtil.isHooked(inNode, outLink)) {
            // 直接挂接，默认路口关系
            newTopo.reachDir = this._getReachDir(inLink, inNode.properties.id, inNode.properties.id, outLink);
            this._setLaneInfo(lanes, newTopo);

            return Promise.resolve(newTopo);
        }

        return this.getViaLinks(inLink.properties.id, inNode.properties.id, outLink.properties.id).then(function (data) {
            newTopo.relationship = data.relationship || 1;
            var viaLinks = data.links;
            if (viaLinks.length > 0) {
                var outNodePid = self._getOutNode(inNode, viaLinks);
                newTopo.reachDir = self._getReachDir(inLink, inNode.properties.id, outNodePid, outLink);
                newTopo.viaLinks = viaLinks;
                self._setLaneInfo(lanes, newTopo);
            } else {
                self._setLaneInfo(lanes, newTopo);
                self.switchToSelectViaLink();
                self.setCenterInfo('自动计算经过线失败, 请手动选择', 1000);
            }

            return newTopo;
        });
    },

    _setLaneInfo: function (lanes, topo) {
        for (var i = 0; i < lanes.length; i++) {
            if (this.directMapping[lanes[i].direct].indexOf(topo.reachDir) >= 0) {
                topo.inLaneInfo[i] = 1;
            }

            if (lanes[i].busDirect && this.directMapping[lanes[i].busDirect].indexOf(topo.reachDir) >= 0) {
                topo.busLaneInfo[i] = 1;
            }
        }

        return topo;
    }
});
