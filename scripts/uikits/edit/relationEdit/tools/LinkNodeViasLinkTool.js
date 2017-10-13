/**
 * Created by wangmingdong on 2017/3/23.
 */

fastmap.uikit.relationEdit.LinkNodeViasLinkTool = fastmap.uikit.relationEdit.RelationTool.extend({
    initialize: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.eventController = fastmap.uikit.EventController();

        this.name = 'LinkNodeViasLinkTool';
        this.snapActor = null;
        // this.editResult.selectType = null;
        this.currentViaLink = null;
        this.currentViaLinkNode = null;
    },

    startup: function () {
        this.resetStatus();

        fastmap.uikit.relationEdit.RelationTool.prototype.startup.apply(this, arguments);

        // this.editResult.selectType = 'outLink';
        if (this.editResult.selectType == 'viaLink') {
            this.currentViaLink = this.editResult.inLink;
            this.currentViaLinkNode = this.editResult.inNode;
        } else {
            this.currentViaLink = null;
            this.currentViaLinkNode = null;
        }

        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.shutdown.apply(this, arguments);

        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.resetStatus.apply(this, arguments);

        this.snapActor = null;
        // this.editResult.selectType = 'outLink';
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

        if (this.editResult.inLink && this.editResult.inNode) {
            if (this.editResult.selectType == 'viaLink') {
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
        var viaLinks = this.editResult.vias;
        var pid = this.editResult.inNode.properties.id;
        var self = this;
        var nodePids = [pid];
        for (var i = 0; i < this.editResult.vias.length; i++) {
            pid = this.uikitUtil.getOtherNode(this.editResult.vias[i], pid);
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

    resetMouseInfo: function () {
        if (!this.editResult.inLink) {
            this.setMouseInfo('请选择进入线!');
            return;
        }
        if (!this.editResult.inNode) {
            this.setMouseInfo('请选择进入点!');
            return;
        }
        if (!this.editResult.outLink) {
            this.setMouseInfo('请选择退出线!');
            return;
        }
        this.setMouseInfo('重新选择退出线或者按空格保存!');
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

        if (this.editResult.outLink) {
            var outLinkSymbol = this.symbolFactory.getSymbol('ls_rdLink_out');
            this.defaultFeedback.add(this.editResult.outLink.geometry, outLinkSymbol);
        }

        if (this.editResult.vias.length) {
            var viasSymbol = this.symbolFactory.getSymbol('ls_rdLink_via');
            for (var i = 0; i < this.editResult.vias.length; i++) {
                this.defaultFeedback.add(this.editResult.vias[i].geometry, viasSymbol);
            }
        }

        this.refreshFeedback();
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

    onSelectInLink: function (res) {
        var newEditResult = FM.Util.clone(this.editResult);
        var inLink = res.feature;
        newEditResult.inLink = inLink;
        var self = this;
        var direct = inLink.properties.direct;
        if (direct === 2) {
            // 顺方向取终点作为进入点
            this.uikitUtil.getCanvasFeaturesFromServer([inLink.properties.enode], 'RDNODE').then(function (rest) {
                newEditResult.inNode = rest[0];
                newEditResult.selectType = 'outLink';
                self.createOperation('选择进入线和进入点', newEditResult);
            });
        } else if (direct === 3) {
            // 逆方向取起点作为进入点
            this.uikitUtil.getCanvasFeaturesFromServer([inLink.properties.snode], 'RDNODE').then(function (rest) {
                newEditResult.inNode = rest[0];
                newEditResult.selectType = 'outLink';
                self.createOperation('选择进入线和进入点', newEditResult);
            });
        } else {
            this.createOperation('选择进入线', newEditResult);
        }
    },

    // 选择退出线，查询经过线
    onSelectOutLink: function (res) {
        this.editResult.selectType = 'outLink';
        var newEditResult = FM.Util.clone(this.editResult);
        var outLink = res.feature;
        var self = this;
        var paramType = fastmap.uikit.topoEdit.TopoEditFactory.getInstance().createTopoEditor(this.editResult.geoLiveType, this.map).getServerFeatureType(this.geoLiveType, this.map);
        newEditResult.outLink = outLink;
        if (newEditResult.outLink.properties.snode == newEditResult.inNode.properties.id || newEditResult.outLink.properties.enode == newEditResult.inNode.properties.id) {
            newEditResult.vias = [];
            newEditResult.relationshipType = 1;
            self.createOperation('选择退出线', newEditResult);
            return;
        }
        var param = {
            type: 'RDLANEVIA',
            data: {
                inLinkPid: newEditResult.inLink.properties.id,
                nodePid: newEditResult.inNode.properties.id,
                outLinkPid: newEditResult.outLink.properties.id,
                type: paramType
            }
        };
        // 查询经过线
        this.dataService
            .getByCondition(param)
            .then(function (result) {
                if (result.length) {
                    newEditResult.relationshipType = result[0].relationshipType;
                    if (result[0].hasOwnProperty('errInfo')) {
                        self.setCenterInfo('查询经过线失败：' + result[0].errInfo, 1000);
                        newEditResult.vias = [];
                        newEditResult.outLink = null;
                    } else {
                        if (result[0].relationshipType == 1) {
                            newEditResult.vias = [];
                            self.createOperation('选择退出线', newEditResult);
                        } else {
                            var viaLinkIds = result[0].links;
                            newEditResult.vias = viaLinkIds.map(function (linkId) {
                                return self.featureSelector.selectByFeatureId(linkId, 'RDLINK');
                            });
                            newEditResult.isClose = true;
                            newEditResult.relationshipType = result[0].relationshipType;
                            self.uikitUtil.getCanvasFeaturesFromServer(viaLinkIds, 'RDLINK').then(function (features) {
                                newEditResult.vias = new Array(features.length);
                                var index;
                                for (var i = 0; i < features.length; i++) {
                                    index = viaLinkIds.indexOf(features[i].properties.id);
                                    newEditResult.vias[index] = features[i];
                                }
                                self.createOperation('选择退出线', newEditResult);
                            });
                        }
                    }
                }
            }).catch(function (err) {
                self.createOperation('查询经过线', newEditResult);
                self.setCenterInfo('查询经过线失败：' + err, 1000);
            });
    },

    // 修改经过线
    switchToSelectViaLink: function () {
        this.editResult.selectType = 'viaLink';
        this.currentViaLink = this.editResult.inLink;
        this.currentViaLinkNode = this.editResult.inNode;
        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.vias = [];
        this.createOperation('清空经过线', newEditResult);
    },

    onSelectViaLink: function (res) {
        this.currentViaLink = res.feature;
        this.currentViaLinkNode = this.getLinkOtherNode(this.currentViaLink, this.currentViaLinkNode);

        var outLink = this.editResult.outLink;
        if (this.uikitUtil.canPass(this.currentViaLink, outLink)) {
            this.setCenterInfo('经过线已闭合', 1000);
            this.editResult.isClose = true;
            this.editResult.selectType = 'outLink';
        }

        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.vias.push(this.currentViaLink);
        this.createOperation('添加经过线', newEditResult);
    },

    getLinkOtherNode: function (link, node) {
        var sNodePid = parseInt(link.properties.snode, 10);
        var eNodePid = parseInt(link.properties.enode, 10);

        if (sNodePid === node.properties.id) {
            return this.featureSelector.selectByFeatureId(eNodePid, 'RDNODE');
        }
        return this.featureSelector.selectByFeatureId(sNodePid, 'RDNODE');
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.relationEdit.RelationTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        var mousePoint = this.latlngToPoint(event.latlng);
        this.snapController.snap(mousePoint);

        return true;
    },

    onKeyUp: function (event) {
        if (!fastmap.uikit.relationEdit.RelationTool.prototype.onKeyUp.apply(this, arguments)) {
            return false;
        }

        var key = event.key;
        var newEditResult = FM.Util.clone(this.editResult);
        switch (key) {
            case 'c':   // 修改经过线
                newEditResult.vias = [];
                this.switchToSelectViaLink();
                newEditResult.isClose = false;
                newEditResult.selectType = 'viaLink';
                this.createOperation('修改经过线', newEditResult);
                break;
            case 'b':   // 修改退出线
                newEditResult.outLink = null;
                newEditResult.vias = [];
                this.createOperation('修改退出线', newEditResult);
                break;
            default:
                break;
        }

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
        } else if (!this.editResult.inNode) {
            var newEditResult = FM.Util.clone(this.editResult);
            newEditResult.inNode = this.featureSelector.selectByFeatureId(res.value, 'RDNODE');
            newEditResult.selectType = 'outLink';
            this.createOperation('选择进入点', newEditResult);
        } else if (this.editResult.selectType === 'outLink') {
            this.onSelectOutLink(res);
        } else {
            if (this.editResult.relationshipType == 1) {
                this.setCenterInfo('路口关系无法修改经过线', 1000);
            } else {
                this.onSelectViaLink(res);
            }
        }
        return true;
    }
});
