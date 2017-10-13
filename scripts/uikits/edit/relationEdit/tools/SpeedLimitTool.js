/**
 * Created by xujie3949 on 2016/12/8.
 */
fastmap.uikit.relationEdit.SpeedLimitTool = fastmap.uikit.relationEdit.RelationTool.extend({
    initialize: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.eventController = fastmap.uikit.EventController();
        this.name = 'SpeedLimitTool';
    },

    startup: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.startup.apply(this, arguments);

        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.shutdown.apply(this, arguments);

        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.resetStatus.apply(this, arguments);
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
        if (!this.editResult.inLink) {
            this.setMouseInfo('请选择点限速');
        } else {
            this.setMouseInfo('请编辑经过线，或者按空格保存');
        }
    },

    resetSnapActor: function () {
        this.uninstallSnapActors();

        if (!this.editResult.inLink) {
            this.installPointSpeedLimitSnapActor();
        } else {
            this.installViaLinksSnapActor();
        }
    },

    installPointSpeedLimitSnapActor: function () {
        var snap1 = this.createFeatureSnapActor('RDSPEEDLIMIT', null);
        var snap2 = this.createFeatureSnapActor('RDSPEEDLIMIT_DEPENDENT', null);

        this.installSnapActor(snap1);
        this.installSnapActor(snap2);
    },

    emptySideParams: function () {
        this.limitSideViaLinks = [];   //   追踪方向经过线
        this.limitSideNodePids = [];   //   追踪方向NodePids
        this.reverseSideViaLinks = [];   //   非追踪方向经过线
        this.reverseSideNodePids = [];   //   非追踪方向NodePids
    },

    resetLimitSideParams: function (pid) {
        var viaLinks = this.editResult.viaLinks;
        var len = viaLinks.length;
        var viaLink = null;

        this.limitSideNodePids.push(pid);
        for (var i = 0; i < len; i++) {
            viaLink = viaLinks[i];

            if (this.uikitUtil.isRouted(pid, viaLink)) {
                pid = this.uikitUtil.getOtherNode(viaLink, pid);
                this.limitSideViaLinks.push(viaLink);
                this.limitSideNodePids.push(pid);
            }
        }
        this.editResult.limitSideViaLinks = this.limitSideViaLinks;
    },

    resetReverseSideParams: function (pid) {
        var viaLinks = this.editResult.viaLinks;
        var len = viaLinks.length;
        var viaLink = null;

        this.reverseSideNodePids.push(pid);
        for (var i = 0; i < len; i++) {
            viaLink = viaLinks[i];

            if (this.uikitUtil.isRoutedOut(pid, viaLink)) {
                pid = this.uikitUtil.getOtherNode(viaLink, pid);
                this.reverseSideViaLinks.push(viaLink);
                this.reverseSideNodePids.push(pid);
            }
        }
        this.editResult.reverseSideViaLinks = this.reverseSideViaLinks;
    },

    installViaLinksSnapActor: function () {
        var pid = this.editResult.inNodePid;

        this.emptySideParams();
        this.resetLimitSideParams(pid);

        pid = this.uikitUtil.getOtherNode(this.editResult.inLink, this.editResult.inNodePid);
        this.resetReverseSideParams(pid);

        var inLinkPid = this.editResult.inLink.properties.id;
        var isRouted = this.uikitUtil.isRouted;
        var isRoutedOut = this.uikitUtil.isRoutedOut;
        var nodePids = this.limitSideNodePids;
        var nodePidsReverseSide = this.reverseSideNodePids;

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

            for (k = 0; k < nodePidsReverseSide.length; k++) {
                if (isRoutedOut(nodePidsReverseSide[k], feature)) {
                    return true;
                }
            }

            return false;
        };

        var snapActor = this.createFeatureSnapActor('RDLINK', null, func);

        this.installSnapActor(snapActor);
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        var symbol;
        if (this.editResult.inLink) {
            symbol = this.symbolFactory.getSymbol('relationEdit_ls_inLink');
            this.defaultFeedback.add(this.editResult.inLink.geometry, symbol);
        }

        if (this.editResult.viaLinks.length > 0) {
            symbol = this.symbolFactory.getSymbol('relationEdit_ls_viaLink');
            for (var i = 0; i < this.editResult.viaLinks.length; i++) {
                this.defaultFeedback.add(this.editResult.viaLinks[i].geometry, symbol);
            }
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

        if (!this.editResult.inLink) {
            this.onSelectPointSpeedLimit(res);
        } else {
            this.onSelectViaLink(res);
        }

        return true;
    },

    onSelectPointSpeedLimit: function (res) {
        var self = this;
        this.pause();
        var props = res.feature.properties;
        if (props.speedFlag == 1) {
            self.setCenterInfo('不允许根据“限速结束”点限速制作线限速', 1000);
            self.continue();
            return;
        }
        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.inLink = this.featureSelector.selectByFeatureId(props.linkPid, 'RDLINK');
        newEditResult.direct = props.direct;
        newEditResult.inNodePid = this.uikitUtil.getDirectEndNode(newEditResult.inLink, newEditResult.direct);
        if (newEditResult.direct === 2) {
            newEditResult.fromSpeedLimit = props.speedValue;
            newEditResult.fromLimitSrc = props.limitSrc;
        } else if (newEditResult.direct === 3) {
            newEditResult.toSpeedLimit = props.speedValue;
            newEditResult.toLimitSrc = props.limitSrc;
        }
        newEditResult.speedType = props.speedType;
        if (newEditResult.speedType == 3) { // 条件限速
            newEditResult.speedDependent = props.speedDependent;
            newEditResult.timeDomain = props.timeDomain || ''; // 服务端要求处理成空字符串
        }

        this.getViaLinks(newEditResult.inLink.properties.id, newEditResult.direct, newEditResult.speedType, newEditResult.speedDependent, props.speedValue).then(function (data) {
            if (data.length === 0) {
                self.setCenterInfo('未追踪到Link，请手动选择', 1000);
                newEditResult.viaLinks = [];
            } else {
                newEditResult.viaLinks = data;
            }

            self.createOperation('选择点限速', newEditResult);

            self.continue();
        });
    },

    _rebuildSideViaLinks: function (nodePid, existsViaLinks, newLink, routeFun) {
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
            if (routeFun(nodePid, newLink)) {
                viaLinks.push(newLink);
                index = 1;
            } else {
                for (i = 0; i < len; i++) {
                    viaLinks.push(existsViaLinks[i]);
                    nodePid = this.uikitUtil.getOtherNode(existsViaLinks[i], nodePid);
                    if (routeFun(nodePid, newLink)) {
                        viaLinks.push(newLink);
                        index = i + 2;
                        break;
                    }
                }
            }

            // 如果选择的link的退出点与原经过线挂接，则向后补
            nodePid = this.uikitUtil.getOtherNode(newLink, nodePid);
            for (i = index; i < len; i++) {
                if (routeFun(nodePid, existsViaLinks[i])) {
                    viaLinks.push(existsViaLinks[i]);
                    nodePid = this.uikitUtil.getOtherNode(existsViaLinks[i], nodePid);
                }
            }
        }

        return viaLinks;
    },

    _rebuildViaLinks: function (newLink) {
        var sNodePid = newLink.properties.snode;
        var eNodePid = newLink.properties.enode;

        if (this.limitSideNodePids.indexOf(sNodePid) > -1 || this.limitSideNodePids.indexOf(eNodePid) > -1) {
            this.limitSideViaLinks = this._rebuildSideViaLinks(this.editResult.inNodePid, this.limitSideViaLinks, newLink, this.uikitUtil.isRouted);
        } else {
            var pid = this.uikitUtil.getOtherNode(this.editResult.inLink, this.editResult.inNodePid);
            this.reverseSideViaLinks = this._rebuildSideViaLinks(pid, this.reverseSideViaLinks, newLink, this.uikitUtil.isRoutedOut);
        }

        return this.limitSideViaLinks.concat(this.reverseSideViaLinks);
    },

    onSelectViaLink: function (res) {
        var feature = res.feature;
        var newViaLinks = this._rebuildViaLinks(feature);
        this.eventController.fire('eventsFromTool', { data: newViaLinks });
        var newEditResult = FM.Util.clone(this.editResult);
        newEditResult.viaLinks = newViaLinks;
        this.createOperation('编辑经过线', newEditResult);
    },

    getViaLinks: function (linkPid, direct, type, dependent, value) {
        var params = {
            type: 'RDLINK',
            data: {
                queryType: 'RDSPEEDLIMIT',
                linkPid: linkPid,
                direct: direct,
                speedValue: value
            }
        };
        if (type === 3) {
            params.data.speedDependent = dependent;
        }

        var self = this;
        return this.dataService
            .getByCondition(params)
            .then(function (res) {
                var links = res[0];
                if (links.length > 1) {
                    return self.uikitUtil.getCanvasFeaturesFromServer(links.slice(1), 'RDLINK');
                }
                return [];
            });
    }
});
