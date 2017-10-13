/**
 * Created by mali on 2017/3/16.
 * 用于线线线操作的（如：线构面）
 */

fastmap.uikit.relationEdit.LineDimensionsTool = fastmap.uikit.relationEdit.RelationTool.extend({
    initialize: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.eventController = fastmap.uikit.EventController();

        this.name = 'LineDimensionsTool';
        this.snapActor = null;
    },

    startup: function () {
        this.resetStatus();
        fastmap.uikit.relationEdit.RelationTool.prototype.startup.apply(this, arguments);

        this.trackFlag = false;
        this.shiftNum = 0;
        this.cisFlag = 1; // 1顺 2 逆 0 初始状态;
        this.isRequest = false;

        this.snapFeatureType = this.editResult.snapFeatureType;
        this.nodeType = this.editResult.nodeType;

        this.refresh();
    },

    shutdown: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.shutdown.apply(this, arguments);
        this.resetStatus();
    },

    resetStatus: function () {
        fastmap.uikit.relationEdit.RelationTool.prototype.resetStatus.apply(this, arguments);
        this.snapActor = null;

        this.trackFlag = false;
        this.shiftNum = 0;
        this.cisFlag = 1;
        this.isRequest = false;
    },

    refresh: function () {
        this.setTrackCondition();
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
        if (!this.editResult.links.length) {
            this.setMouseInfo('请选择' + this.editResult.snapFeatureType + '或RDLINK!');
            return;
        }
        if (this.editResult.firstNodePid == this.editResult.lastNodePid && this.editResult.firstNodePid) {
            if (this.trackFlag) {
                if (this.cisFlag == 1) {
                    this.setMouseInfo('顺时针追踪Link已闭合，请点击空格生成面!');
                } else {
                    this.setMouseInfo('逆时针追踪Link已闭合，请点击空格生成面!');
                }
            } else {
                this.setMouseInfo('手动所选构面Link已闭合，请点击空格生成面!');
            }
            return;
        }
        if (this.editResult.links.length == 1 && !this.editResult.topoLinks.length) {
            this.setMouseInfo('断头线无法构面!');
            return;
        }
        if (this.trackFlag) {
            this.setMouseInfo('按快捷键c进行自动追踪构面link或手动修改!');
            return;
        }
        if (this.editResult.links.length) {
            this.setMouseInfo('已选择' + this.editResult.links.length + '条线,还未闭合请继续选择');
        }
    },

    resetSnapActor: function () {
        this.uninstallSnapActors(this.snapActor);
        if (this.editResult.links.length === 0) {
            var tempSnapActor;
            tempSnapActor = this.createFeatureSnapActor('RDLINK', null);
            this.installSnapActor(tempSnapActor);
            if (this.editResult.snapFeatureType != 'RDLINK') {
                tempSnapActor = this.createFeatureSnapActor(this.editResult.snapFeatureType, null);
                this.installSnapActor(tempSnapActor);
            }
        } else if (this.editResult.links.length > 0) {
            this.installLinkSnapActor();
        }
    },

    installLinkSnapActor: function () {
        var type = this.editResult.snapFeatureType;
        var topoLinkfeatures = this.editResult.topoLinks.map(function (topoLink) {
            return {
                id: topoLink.pid,
                geoLiveType: type
            };
        });
        var linkFeatures = this.editResult.links.map(function (link) {
            return {
                id: link.properties.id,
                geoLiveType: type
            };
        });
        var snapFeatures = topoLinkfeatures.concat(linkFeatures);
        this.snapActor = this.createGivenFeatureSnapActor(snapFeatures);
        this.installSnapActor(this.snapActor);
    },

    // 获取起终点的挂接link
    getTopoLinks: function (links, firstNodePid, lastNodePid, type) {
        var firstParam = {
            type: type,
            data: {
                nodePid: firstNodePid
            }
        };
        var lastParam = {
            type: type,
            data: {
                nodePid: lastNodePid
            }
        };
        var p = [];

        p.push(this.dataService.getByCondition(firstParam).then(function (firstLinks) {
            for (var i = 0; i < firstLinks.length; i++) {
                if (firstLinks[i].pid == links[0].properties.id) {
                    firstLinks.splice(i, 1);
                }
            }
            return firstLinks;
        }));
        p.push(this.dataService.getByCondition(lastParam).then(function (lastLinks) {
            for (var j = 0; j < lastLinks.length; j++) {
                if (lastLinks[j].pid == links[links.length - 1].properties.id) {
                    lastLinks.splice(j, 1);
                }
            }
            return lastLinks;
        }));
        return Promise.all(p).then(function (result) {
            return result[0].concat(result[1]);
        });
    },

    getLinksByNode: function (linkPid, nodePid, type) {
        var self = this;
        var topoLinks = this.featureSelector.selectByFunction(function (feature) {
            if (feature.properties.id === linkPid) {
                return false;
            }
            var sNodePid = parseInt(feature.properties.snode, 10);
            var eNodePid = parseInt(feature.properties.enode, 10);

            if (sNodePid == nodePid || eNodePid == nodePid) {
                return true;
            }
            return false;
        }, type);

        return topoLinks;
    },

    setTrackCondition: function () {
        this.trackFlag = (this.editResult.links.length == 1 && this.editResult.firstNodePid != this.editResult.lastNodePid) || this.isRequest;
        // console.log(this.trackFlag);
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }
        this.defaultFeedback.clear();
        // 高亮选中的线;
        if (this.editResult.links.length > 0) {
            var linkSymbol;
            for (var i = 0; i < this.editResult.links.length; ++i) {
                if (this.editResult.links[i].properties.id == this.editResult.firstLink.properties.id) {
                    linkSymbol = this.symbolFactory.getSymbol('ls_rdLink_out');
                } else {
                    linkSymbol = this.symbolFactory.getSymbol('ls_rdLink_in');
                }
                this.defaultFeedback.add(this.editResult.links[i].geometry, linkSymbol);
            }
        }
        // 高亮联通的线;
        if (this.editResult.topoLinks.length > 0) {
            for (var j = 0; j < this.editResult.topoLinks.length; j++) {
                var topoLinkSymbol = this.symbolFactory.getSymbol('ls_link');
                this.defaultFeedback.add(this.editResult.topoLinks[j].geometry, topoLinkSymbol);
            }
        }
        var self = this;
        // 虚线高亮起终点连线
        if (this.editResult.firstNodePid && this.editResult.lastNodePid) {
            var firstNode = this.featureSelector.selectByFeatureId(parseInt(this.editResult.firstNodePid, 10), this.editResult.nodeType);
            var lastNode = this.featureSelector.selectByFeatureId(parseInt(this.editResult.lastNodePid, 10), this.editResult.nodeType);
            var dottedLineGeometry = {
                type: 'LineString',
                coordinates: []
            };
            dottedLineGeometry.coordinates.push(firstNode.geometry.coordinates);
            dottedLineGeometry.coordinates.push(lastNode.geometry.coordinates);
            var dottedLineSymbol = this.symbolFactory.getSymbol('selectTool_ls_rectSelect');
            this.defaultFeedback.add(dottedLineGeometry, dottedLineSymbol);
        }
        this.refreshFeedback();
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.relationEdit.RelationTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        var mousePoint = this.latlngToPoint(event.latlng);
        this.snapController.snap(mousePoint);

        return true;
    },

    getSimgleArray: function (a, b) {
        for (var i = 0; i < a.length; i++) {
            for (var j = 0; j < b.length; j++) {
                if (a[i].pid == b[j].properties.id) {
                    a.splice(i, 1);
                }
            }
        }
    },

    onLeftButtonClick: function (event) {
        if (!fastmap.uikit.relationEdit.RelationTool.prototype.onLeftButtonClick.apply(this, arguments)) {
            return false;
        }
        var mousePoint = this.latlngToPoint(event.latlng);
        var res = this.snapController.snap(mousePoint);
        res.feature.geometry = this.geometryAlgorithm.precisionGeometry(res.feature.geometry, 5);
        var self = this;
        if (!res) {
            return true;
        }
        this.isRequest = false;
        var newEditResult = FM.Util.clone(this.editResult);
        if (this.editResult.links.length == 0) {
            this.shiftNum = 0; // 当选第一根link的时候，按键计数器从头开始;
            newEditResult.firstLink = res.feature;
            newEditResult.links.push(res.feature);
            newEditResult.firstNodePid = res.feature.properties.snode;
            newEditResult.lastNodePid = res.feature.properties.enode;

            newEditResult.nodeType = res.feature.properties.geoLiveType.substr(0, res.feature.properties.geoLiveType.length - 4) + 'NODE';
            newEditResult.snapFeatureType = res.feature.properties.geoLiveType;

            Promise.all([this.getTopoLinks(newEditResult.links, newEditResult.firstNodePid, newEditResult.lastNodePid, newEditResult.snapFeatureType)])
                .then(function (result) {
                    newEditResult.topoLinks = result[0];
                    self.createOperation('已选择1条组成线', newEditResult);
                });
        } else {
            var currentIndex = this.getIndexInArray(this.editResult.links, res.feature);
            var firstIndex = this.getIndexInArray(this.editResult.links, this.editResult.firstLink);
            if (currentIndex != -1) {
                if (currentIndex > firstIndex) {
                    newEditResult.links = newEditResult.links.slice(0, currentIndex);
                    newEditResult.lastNodePid = this.getLastPid(res.feature, currentIndex, this.editResult.links);

                    Promise.all([this.getTopoLinks(newEditResult.links, newEditResult.firstNodePid, newEditResult.lastNodePid, newEditResult.snapFeatureType)])
                        .then(function (result) {
                            newEditResult.topoLinks = result[0];
                            self.getSimgleArray(newEditResult.topoLinks, newEditResult.links);
                            self.createOperation('已选择1条组成线', newEditResult);
                        });
                } else if (currentIndex < firstIndex) {
                    newEditResult.links = newEditResult.links.slice(currentIndex + 1);
                    newEditResult.firstNodePid = this.getFirstPid(res.feature, currentIndex, this.editResult.links);

                    Promise.all([this.getTopoLinks(newEditResult.links, newEditResult.firstNodePid, newEditResult.lastNodePid, newEditResult.snapFeatureType)])
                        .then(function (result) {
                            newEditResult.topoLinks = result[0];
                            self.getSimgleArray(newEditResult.topoLinks, newEditResult.links);
                            self.createOperation('已选择1条组成线', newEditResult);
                        });
                } else {
                    this.clearEditResult(newEditResult);
                    this.createOperation('已取消所有组成线', newEditResult);
                }
            } else {
                this.insertNewLink(newEditResult, res.feature);
                if (newEditResult.lastNodePid == newEditResult.firstNodePid) {
                    newEditResult.topoLinks = [];
                    this.createOperation('继续选择组成线！', newEditResult);
                } else {
                    Promise.all([this.getTopoLinks(newEditResult.links, newEditResult.firstNodePid, newEditResult.lastNodePid, newEditResult.snapFeatureType)])
                        .then(function (result) {
                            newEditResult.topoLinks = result[0];
                            self.getSimgleArray(newEditResult.topoLinks, newEditResult.links);
                            self.createOperation('继续选择组成线！', newEditResult);
                        });
                }
                this.createOperation('继续选择组成线！', newEditResult);
            }
        }
        return true;
    },

    autoTrailFaceLinks: function () {
        var newEditResult = FM.Util.clone(this.editResult);
        var _self = this;
        if (!this.trackFlag) { return; }
        this.cisFlag = (++this.shiftNum) % 3;
        console.log(this.cisFlag);
        // 置为开始选中第一条link的状态;
        if (this.cisFlag == 0) {
            newEditResult.firstLink = this.editResult.firstLink;
            newEditResult.links = [this.editResult.firstLink];
            newEditResult.firstNodePid = this.editResult.firstLink.properties.snode;
            newEditResult.lastNodePid = this.editResult.firstLink.properties.enode;
            Promise.all([this.getTopoLinks(newEditResult.links, newEditResult.firstNodePid, newEditResult.lastNodePid, newEditResult.snapFeatureType)])
                .then(function (result) {
                    newEditResult.topoLinks = result[0];
                    _self.createOperation('继续选择组成线！', newEditResult);
                });
            // newEditResult.topoLinks = this.getTopoLinks(newEditResult.links, newEditResult.firstNodePid, newEditResult.lastNodePid, newEditResult.snapFeatureType);
            // this.createOperation('继续选择组成线！', newEditResult);
            return;
        }
        var requestParma = {
            type: this.editResult.firstLink.properties.geoLiveType,
            data: {
                cisFlag: this.cisFlag,
                linkPid: this.editResult.firstLink.properties.id
            }
        };
        this.dataService.getByCondition(requestParma).then(function (responseData) {
            newEditResult.links = [_self.editResult.firstLink];
            newEditResult.topoLinks = [];
            newEditResult.firstNodePid = _self.editResult.firstLink.properties.snode;
            newEditResult.lastNodePid = _self.editResult.firstLink.properties.enode;
            var linkPids = [];
            for (var i = 0; i < responseData.length; i++) {
                linkPids.push(responseData[i].pid);
            }
            _self.uikitUtil.getCanvasFeaturesFromServer(linkPids, newEditResult.snapFeatureType).then(function (features) {
                newEditResult.vias = new Array(features.length);
                for (var j = 0; j < features.length; j++) {
                    // 插入追踪得到的link,选选择的顺序一致;;
                    if (_self.editResult.firstLink.properties.id != features[j].properties.id) {
                        _self.insertNewLink(newEditResult, features[j]);
                    }
                }
                if (newEditResult.lastNodePid == newEditResult.firstNodePid) {
                    newEditResult.topoLinks = [];
                    // 如果是追踪的则可以继续使用快捷键重新追踪;
                    _self.isRequest = true;
                    _self.createOperation('继续选择组成线！', newEditResult);
                } else {
                    Promise.all([_self.getTopoLinks(newEditResult.links, newEditResult.firstNodePid, newEditResult.lastNodePid, newEditResult.snapFeatureType)])
                        .then(function (result) {
                            newEditResult.topoLinks = result[0];
                            // 如果是追踪的则可以继续使用快捷键重新追踪;
                            _self.isRequest = true;
                            _self.createOperation('继续选择组成线！', newEditResult);
                        });
                    // newEditResult.topoLinks = _self.getTopoLinks(newEditResult.links, newEditResult.firstNodePid, newEditResult.lastNodePid, newEditResult.snapFeatureType);
                }
            });
        });
    },

    onKeyUp: function (event) {
        if (!fastmap.uikit.relationEdit.RelationTool.prototype.onKeyUp.apply(this, arguments)) {
            return false;
        }
        var key = event.key;
        switch (key) {
            case 'c':
                this.autoTrailFaceLinks();
                break;
            default:
                break;
        }
        return true;
    },

    /* ------------------------------------------功能函数部分------------------------------------------------- */
    getIndexInArray: function (arr, obj) {
        var tempInex = -1;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].properties.id === obj.properties.id) {
                tempInex = i;
            }
        }
        return tempInex;
    },

    getFirstPid: function (feature, index, linkArr) {
        var nextFeature = linkArr[index + 1];
        var cancelFeature = feature;
        var firstNode = null;
        if (nextFeature.properties.id === this.editResult.firstLink.properties.id) {
            return this.editResult.firstLink.properties.snode;
        }
        if (cancelFeature.properties.enode === nextFeature.properties.enode) {
            firstNode = nextFeature.properties.enode;
        } else if (cancelFeature.properties.snode === nextFeature.properties.enode) {
            firstNode = nextFeature.properties.enode;
        } else if (cancelFeature.properties.enode === nextFeature.properties.snode) {
            firstNode = nextFeature.properties.snode;
        } else if (cancelFeature.properties.snode === nextFeature.properties.snode) {
            firstNode = nextFeature.properties.snode;
        }
        return firstNode;
    },

    getLastPid: function (feature, index, linkArr) {
        var preFeature = linkArr[index - 1];
        var cancelFeature = feature;
        var lastNode = null;
        if (preFeature.properties.id === this.editResult.firstLink.properties.id) {
            return this.editResult.firstLink.properties.enode;
        }
        if (cancelFeature.properties.enode === preFeature.properties.enode) {
            lastNode = preFeature.properties.enode;
        } else if (cancelFeature.properties.snode === preFeature.properties.enode) {
            lastNode = preFeature.properties.enode;
        } else if (cancelFeature.properties.enode === preFeature.properties.snode) {
            lastNode = preFeature.properties.snode;
        } else if (cancelFeature.properties.snode === preFeature.properties.snode) {
            lastNode = preFeature.properties.snode;
        }
        return lastNode;
    },

    clearEditResult: function (newEditResult) {
        newEditResult.firstLink = null;
        newEditResult.links = [];
        newEditResult.topoLinks = [];
        newEditResult.firstNodePid = null;
        newEditResult.lastNodePid = null;

        newEditResult.nodeType = this.nodeType;
        newEditResult.snapFeatureType = this.snapFeatureType;
    },

    insertNewLink: function (newEditResult, res) {
        if (res.properties.enode === newEditResult.firstNodePid) {
            newEditResult.links.unshift(res);
            newEditResult.firstNodePid = res.properties.snode;
        } else if (res.properties.snode === newEditResult.firstNodePid) {
            newEditResult.links.unshift(res);
            newEditResult.firstNodePid = res.properties.enode;
        } else if (res.properties.enode === newEditResult.lastNodePid) {
            newEditResult.lastNodePid = res.properties.snode;
            newEditResult.links.push(res);
        } else if (res.properties.snode === newEditResult.lastNodePid) {
            newEditResult.lastNodePid = res.properties.enode;
            newEditResult.links.push(res);
        }
    }
});
