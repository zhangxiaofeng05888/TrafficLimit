/**
 * Created by wuzhen on 2017/3/16.
 * 坡度工具
 */
fastmap.uikit.relationEdit.NodeLinksTool = fastmap.uikit.relationEdit.RelationTool.extend({
    initialize: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.eventController = fastmap.uikit.EventController();

        this.name = 'NodeLinksTool';
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
        if (!this.editResult.inNode) {
            this.setMouseInfo('请选择起始点!');
        } else if (!this.editResult.outLink) {
            this.setMouseInfo('请选择退出线!');
        } else {
            this.setMouseInfo('坡度长度为' + this.editResult.linkLength.toFixed(2) + '米!');
        }
    },

    resetSnapActor: function () {
        this.uninstallSnapActor(this.snapActor);
        if (!this.editResult.inNode) {
            this.installNodeSnapActor();
            return;
        }
        if (!this.editResult.outLink) {
            this.installOutLinkSnapActor();
            return;
        }
        if (this.editResult.outLink) {
            this.installExcludeOutlinkSnapActor();
            return;
        }
    },

    installNodeSnapActor: function () {
        this.snapActor = this.createFeatureSnapActor('RDNODE', null);
        this.installSnapActor(this.snapActor);
    },

    installOutLinkSnapActor: function () {
        var linkFeatures = this.uikitUtil.getCanPassLinksByNode(this.editResult.inNode);
        var features = linkFeatures.map(function (topoLink) { // 转成需要的格式
            return {
                id: topoLink.properties.id,
                geoLiveType: 'RDLINK'
            };
        });
        this.snapActor = this.createGivenFeatureSnapActor(features);
        this.installSnapActor(this.snapActor);
    },

    installExcludeOutlinkSnapActor: function () {
        this.pause();
        var promise = this.getLastPoint(this.editResult);
        var self = this;
        promise.then(function (data) {
            if (data == null) { // 解决由于接口异常，导致前端鼠标一直转圈的问题
                self.continue();
                return;
            }
            var trackLinks = FM.Util.clone(self.editResult.joinLinks);
            var inNodeLinks = [];
            var p1 = self.uikitUtil.getCanvasFeaturesFromServer(data.properties.links, 'RDLINK').then(function (res) { // 获取点所挂接的线
                if (res && res.length === 2) {
                    trackLinks = FM.Util.unique(trackLinks.concat(res), res, 'properties.id');
                }
                return res;
            });

            var p2 = self.uikitUtil.getCanvasFeaturesFromServer(self.editResult.inNode.properties.links, 'RDLINK').then(function (res) { // 获取点所挂接的线
                inNodeLinks = self.canpassLink(self.editResult.inNode, res);
                return res;
            });
            Promise.all([p1, p2]).then(function (res) {
                self.continue();
                var allLinks = inNodeLinks.concat(trackLinks);
                var func = function (feature) {
                    var flag = false;
                    for (var i = 0, len = allLinks.length; i < len; i++) {
                        if (feature.properties.id === allLinks[i].properties.id) {
                            flag = true;
                            break;
                        }
                    }
                    return flag;
                };
                self.snapActor = self.createFeatureSnapActor('RDLINK', null, func);
                self.installSnapActor(self.snapActor);
            });
        });
    },

    /**
     *  判断点到线是否可通行,返回可通行的link
     * @param node
     * @param links
     * @returns {*}
     */
    canpassLink: function (node, links) {
        var nodeId = node.properties.id;
        for (var i = links.length - 1; i >= 0; i--) {
            var flag = false;
            var feature = links[i].properties;
            if (feature.direct === 2) { // 顺方向
                if (feature.snode === nodeId) {
                    flag = true;
                }
            } else if (feature.direct === 3) { // 逆方向
                if (feature.enode === nodeId) {
                    flag = true;
                }
            } else { // 双方向
                flag = true;
            }
            if (!flag) {
                links.splice(i, 1);
            }
        }
        return links;
    },

    /**
     * 获取最后一个点要素
     * @param editResult
     * @returns {*}
     */
    getLastPoint: function (editResult) {
        var inNodeId = editResult.inNode.properties.id;
        var outLink = editResult.outLink.properties;
        var lastNodeId = outLink.enode;
        if (inNodeId == outLink.enode) { // id是数字，enode是字符串，所以使用==
            lastNodeId = outLink.snode;
        }
        var joinLinks = editResult.joinLinks;
        for (var i = 0; i < joinLinks.length; i++) {
            if (lastNodeId == joinLinks[i].properties.enode) {
                lastNodeId = joinLinks[i].properties.snode;
            } else {
                lastNodeId = joinLinks[i].properties.enode;
            }
        }

        var lastPoit;
        var p = this.uikitUtil.getCanvasFeaturesFromServer([lastNodeId], 'RDNODE').then(function (features) {
            lastPoit = features[0];
        });
        return Promise.all([p]).then(function (data) {
            return lastPoit;
        });


        // var feature = this.featureSelector.selectByFeatureId(parseInt(lastNodeId, 10), 'RDNODE');
        // return feature;
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        if (this.editResult.outLink) {
            var outLinkSymbol = this.symbolFactory.getSymbol('relationEdit_ls_outLink');
            this.defaultFeedback.add(this.editResult.outLink.geometry, outLinkSymbol);
        }
        var i = 0;
        if (this.editResult.canSelectOutLinks) {
            var outLinks = this.editResult.canSelectOutLinks;
            for (i = 0; i < outLinks.length; i++) {
                var linkSymbol = this.symbolFactory.getSymbol('relationEdit_ls_inLink');
                this.defaultFeedback.add(outLinks[i].geometry, linkSymbol);
            }
        }
        if (this.editResult.joinLinks && this.editResult.joinLinks.length > 0) {
            for (i = 0; i < this.editResult.joinLinks.length; i++) {
                var joinLinks = this.symbolFactory.getSymbol('relationEdit_ls_viaLink');
                this.defaultFeedback.add(this.editResult.joinLinks[i].geometry, joinLinks);
            }
        }
        // 为了让node压在线上,node最后绘制
        if (this.editResult.inNode) {
            var nodeSymbol = this.symbolFactory.getSymbol('relationEdit_pt_node');
            this.defaultFeedback.add(this.editResult.inNode.geometry, nodeSymbol);
        }

        this.refreshFeedback();
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

        if (!this.editResult.inNode) {
            this.onSelectInNode(res);
        } else if (!this.editResult.outLink) {
            this.onSelectOutLink(res);
        } else if (this.editResult.outLink) {
            this.onSelectJoinLinks(res);
        }

        return true;
    },

    /**
     * 选择进入点
     * @param res
     */
    onSelectInNode: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);
        var inNode = res.feature;
        newEditResult.inNode = inNode;
        var outlinks = this.uikitUtil.getCanPassLinksByNode(inNode);
        if (!(outlinks && outlinks.length > 0)) {
            this.setCenterInfo('没有符合条件的退出线!', 1000);
            return;
        }
        newEditResult.canSelectOutLinks = outlinks;
        this.createOperation('选择进入点', newEditResult);
        if (outlinks.length === 1 && this.editResult.inNode) { // 如果只有一个退出线时，直接自动选中退出线
            var outLink = {};
            outLink.feature = outlinks[0];
            this.onSelectOutLink(outLink);
        }
    },

    onSelectOutLink: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);
        var outLink = res.feature;
        newEditResult.canSelectOutLinks = [];
        newEditResult.outLink = outLink;
        this.getJoinLinks(this.editResult.inNode, outLink, newEditResult);
    },

    onSelectJoinLinks: function (res) {
        var enode = parseInt(res.feature.properties.enode, 10);
        var snode = parseInt(res.feature.properties.snode, 10);
        if ([snode, enode].indexOf(this.editResult.inNode.properties.id) > -1) { // 任务修改的是退出线
            this.onSelectOutLink(res);
            return;
        }

        var i;
        var newEditResult = FM.Util.clone(this.editResult);
        var linkPid = res.feature.properties.id;
        var flag = this.joinLinkIsSelected(newEditResult.joinLinks, res.feature);
        if (flag) {
            var joinLinks = newEditResult.joinLinks;
            for (i = 0; i < joinLinks.length; i++) {
                if (linkPid === joinLinks[i].properties.id) {
                    joinLinks.splice(i);
                    break;
                }
            }
        } else {
            newEditResult.joinLinks.push(res.feature);
        }

        newEditResult.linkLength = this.getLinkLength(newEditResult);
        this.createOperation('选择接续线', newEditResult);
    },

    // 判断当前接续线是否已选
    joinLinkIsSelected: function (joinLinks, selectedLink) {
        var flag = false;
        for (var i = 0; i < joinLinks.length; i++) {
            if (joinLinks[i].properties.id === selectedLink.properties.id) {
                flag = true;
                break;
            }
        }
        return flag;
    },

    getLinkLength: function (editResult) {
        var length = 0;
        length = parseFloat(editResult.outLink.properties.length);
        for (var i = 0; i < editResult.joinLinks.length; i++) {
            length += parseFloat(editResult.joinLinks[i].properties.length);
        }
        return length;
    },

    getJoinLinks: function (inNode, outLink, newEditResult) {
        var inNodeId = inNode.properties.id;
        var linkLength = 0;
        var snode = parseInt(outLink.properties.snode, 10);
        var enode = parseInt(outLink.properties.enode, 10);
        var otherLinkNodeId = enode;
        if (inNodeId === enode) {
            otherLinkNodeId = snode;
        }
        if (outLink.properties.length) {
            linkLength = parseInt(outLink.properties.length, 10);
            newEditResult.linkLength = linkLength;
        }
        var self = this;
        var param = {
            dbId: App.Temp.dbId,
            type: 'RDLINK',
            data: {
                linkPid: outLink.properties.id,
                nodePidDir: otherLinkNodeId,
                length: linkLength,
                queryType: 'RDSLOPE'
            }
        };
        this.pause();
        this.dataService
            .getByCondition(param)
            .then(function (res) {
                newEditResult.joinLinks = [];
                if (res && res.length > 0) {
                    var linkPids = [];
                    for (var i = 0; i < res.length; i++) {
                        linkPids.push(res[i].pid);
                        newEditResult.linkLength += parseFloat(res[i].length);
                    }
                    var p = self.uikitUtil.getCanvasFeaturesFromServer(linkPids, 'RDLINK').then(function (feas) {
                        newEditResult.joinLinks = (feas);
                        return feas;
                    });
                    Promise.all([p]).then(function () {
                        self.createOperation('选择退出线', newEditResult);
                        self.continue();
                    });
                } else {
                    self.createOperation('选择退出线', newEditResult);
                    self.continue();
                }

                // if (res && res.length > 0) {
                //     for (var i = 0; i < res.length; i++) {
                //         var fea = self.featureSelector.selectByFeatureId(res[i].pid, 'RDLINK');
                //         if (fea) { // 有可能接续线的id不在屏幕的瓦片中返回null
                //             newEditResult.joinLinks.push(fea);
                //             newEditResult.linkLength += parseFloat(res[i].length);
                //         }
                //     }
                // }
                // self.createOperation('选择退出线', newEditResult);
                // self.continue();
            })
            .catch(function (err) {
                self.createOperation('选择退出线', newEditResult);
                self.setCenterInfo('获取接续线失败,请手动选择经过线', 1000);
                self.continue();
            });
    }
});
