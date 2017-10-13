/**
 * Created by wuzhen on 2017/04/20.
 * 批量编辑rdlink追踪选
 */

fastmap.uikit.selectTool.TrackSelectTool = fastmap.uikit.MapTool.extend({
    initialize: function () {
        fastmap.uikit.MapTool.prototype.initialize.apply(this, arguments);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'TrackSelectTool';

        this.feedbackController = fastmap.mapApi.FeedbackController.getInstance();
        this.symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();
        this.geometryFactory = fastmap.mapApi.symbol.GeometryFactory.getInstance();
        this.featureSelector = fastmap.mapApi.FeatureSelector.getInstance();
        this.snapController = fastmap.mapApi.snap.SnapController.getInstance();
        this.dataService = fastmap.service.DataServiceEdit.getInstance();
        this.uikitUtil = fastmap.uikit.Util.getInstance();
        this.defaultFeedback = null;
        this.feedbacks = [];
        this.symbols = [];
        this.snapActor = null;
        this.snapActors = [];
        this.mousePoint = null;
        this.onFinish = null;
    },

    onActive: function (map, onFinish, options) {
        if (!fastmap.uikit.MapTool.prototype.onActive.apply(this, arguments)) {
            return false;
        }

        this.startup();
        return true;
    },

    onDeactive: function () {
        this.shutdown();
        return fastmap.uikit.MapTool.prototype.onDeactive.apply(this, arguments);
    },

    startup: function () {
        this.resetStatus();

        this.defaultFeedback = new fastmap.mapApi.Feedback();
        this.installFeedback(this.defaultFeedback);

        this.snapController.startup();

        this.refresh();
    },

    shutdown: function () {
        this.defaultFeedback = null;

        this.uninstallFeedbacks();

        this.snapController.shutdown();

        this.uninstallSnapActors(this.snapActor);

        this.resetStatus();
    },

    resetStatus: function () {
        this.defaultFeedback = null;
        this.snapActor = null;
        this.snapActors = [];
        this.selectObj = {};
        this.mousePoint = null;
    },

    refresh: function () {
        this.resetSnapActor();
        this.resetFeedback();
    },

    installFeedback: function (feedback) {
        this.feedbacks.push(feedback);
        this.feedbackController.add(feedback);
    },

    uninstallFeedbacks: function () {
        for (var i = 0; i < this.feedbacks.length; ++i) {
            var feedback = this.feedbacks[i];
            this.feedbackController.del(feedback);
        }
        this.feedbacks = [];
    },

    resetSnapActor: function () {
        this.uninstallSnapActors(this.snapActor);

        if (this.selectObj && !this.selectObj.link) {
            this.installLinkSnapActor();
            return;
        }
        if (this.selectObj && !this.selectObj.node) {
            this.installNodeSnapActor();
        }
        if (this.selectObj && this.selectObj.trackLinks) { // 接续线
            this.installTrackLinksSnapActor();
        }
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        if (this.selectObj && this.selectObj.link) {
            var linkSymbol = this.symbolFactory.getSymbol('relationEdit_ls_inLink');
            this.defaultFeedback.add(this.selectObj.link.geometry, linkSymbol);
        }

        this.feedbackController.refresh();
    },

    getLastPoint: function () {
        var inNodeId = this.selectObj.node.properties.id;
        var trackLinks = this.selectObj.trackLinks;
        if (trackLinks.length > 0) {
            for (var i = 0; i < trackLinks.length; i++) {
                if (inNodeId === trackLinks[i].properties.enode) {
                    inNodeId = trackLinks[i].properties.snode;
                } else {
                    inNodeId = trackLinks[i].properties.enode;
                }
            }
        }
        var lastPoit;
        var p = this.uikitUtil.getCanvasFeaturesFromServer([inNodeId], 'RDNODE').then(function (features) {
            lastPoit = features[0];
        });
        return Promise.all([p]).then(function (data) {
            return lastPoit;
        });
    },

    installTrackLinksSnapActor: function () {
        this.uninstallSnapActors(this.snapActor);

        var promise = this.getLastPoint();
        var self = this;
        promise.then(function (data) {
            self.uikitUtil.getCanvasFeaturesFromServer(data.properties.links, 'RDLINK').then(function (res) {
                var links = self.unionFeature(self.selectObj.trackLinks, res); // 接续link和接续link的最后一个node的挂接link
                links = FM.Util.differenceBy(links, [self.selectObj.link], 'properties.id');// 进入线不可以反选需要排除掉

                var func = function (feature) {
                    var flag = false;
                    for (var i = 0, len = links.length; i < len; i++) {
                        if (feature.properties.id === links[i].properties.id) {
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

    unionFeature: function (features1, features2) {
        return FM.Util.unionBy(features1, features2, 'properties.id');
    },

    installLinkSnapActor: function () {
        this.uninstallSnapActors(this.snapActor);
        this.snapActor = this.createFeatureSnapActor('RDLINK', null);

        this.installSnapActor(this.snapActor);
    },

    installNodeSnapActor: function () {
        this.uninstallSnapActors(this.snapActor);
        var snode = this.selectObj.link.properties.snode;
        var enode = this.selectObj.link.properties.enode;
        var features = [];
        features.push({
            id: snode,
            geoLiveType: 'RDNODE'
        });
        features.push({
            id: enode,
            geoLiveType: 'RDNODE'
        });
        this.snapActor = this.createGivenFeatureSnapActor(features);
        this.installSnapActor(this.snapActor);
    },

    installSnapActor: function (snapActor) {
        this.snapActors.push(snapActor);
        this.snapController.add(snapActor);
    },

    uninstallSnapActors: function () {
        for (var i = 0; i < this.snapActors.length; ++i) {
            var snapActor = this.snapActors[i];
            this.snapController.del(snapActor);
        }
        this.snapActors = [];
    },

    createFeatureSnapActor: function (layerId, exceptions, snapFunction) {
        if (!layerId) {
            throw new Error('FeatureSnapActor必须指定捕捉的层');
        }

        var snapActor = new fastmap.mapApi.snap.FeatureSnapActor();
        snapActor.layerId = layerId;

        if (exceptions) {
            for (var i = 0; i < exceptions.length; ++i) {
                var exception = exceptions[i];
                snapActor.addSnapException(exception);
            }
        }

        if (snapFunction) {
            snapActor.setSnapFunction(snapFunction);
        }

        return snapActor;
    },

    createGivenFeatureSnapActor: function (features) {
        if (!features) {
            throw new Error('GivenFeatureSnapActor必须指定捕捉的要素');
        }

        var snapActor = new fastmap.mapApi.snap.GivenFeatureSnapActor();
        snapActor.setFeatures(features);
        return snapActor;
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.MapTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }
        this.mousePoint = this.latlngToPoint(event.latlng);
        this.snapController.snap(this.mousePoint);

        return true;
    },

    onLeftButtonClick: function (event) {
        if (!fastmap.uikit.MapTool.prototype.onLeftButtonClick.apply(this, arguments)) {
            return false;
        }

        var res = this.snapController.snap(this.mousePoint);
        if (!res) {
            return true;
        }

        if (!this.selectObj.link) {
            this.selectObj.link = res.feature;
            this.refresh();
            return true;
        }
        if (!this.selectObj.node) {
            this.selectObj.node = res.feature;

            var self = this;
            self.pause();
            this.getTrackLinks(this.selectObj, function (features) {
                self.resetSnapActor();
                self.continue();
                if (self.onFinish && features.length > 0) {
                    self.onFinish(features, event, { type: 'trackSelect' });
                }
            });
        }

        if (this.selectObj.node && this.selectObj.trackLinks) {
            var link = res.feature;
            this.invertSelect(this.selectObj.trackLinks, link);
            var arr = [];
            arr.push({
                id: this.selectObj.link.properties.id,
                geoLiveType: 'RDLINK'
            });
            var trackLinks = this.selectObj.trackLinks;
            for (var i = 0, len = trackLinks.length; i < len; i++) {
                arr.push({
                    id: trackLinks[i].properties.id,
                    geoLiveType: 'RDLINK'
                });
            }

            this.resetSnapActor();
            this.onFinish(arr, event, { type: 'trackSelect' });
        }

        return true;
    },

    /**
     * 反选，新增 功能
     * @param links
     * @param link
     */
    invertSelect: function (links, link) {
        var i,
            len;
        if (links && links.length > 0) {
            var exitFlag = false;
            for (i = 0, len = links.length; i < len; i++) {
                if (links[i].properties.id === link.properties.id) {
                    links = links.splice(i);
                    exitFlag = true;
                    break;
                }
            }
            if (!exitFlag) {
                links.push(link);
            }
        } else {
            links.push(link);
        }
    },

    onKeyUp: function (event) {
        if (!fastmap.uikit.MapTool.prototype.onKeyUp.apply(this, arguments)) {
            return false;
        }

        var key = event.key;
        switch (key) {
            case 'Escape':
                this.selectObj = {};
                this.refresh();
                break;
            default:
                break;
        }

        return true;
    },

    getTrackLinks: function (feature, callback) {
        var param = {
            command: 'CREATE',
            dbId: App.Temp.dbId,
            type: 'RDLINK',
            data: {
                linkPid: feature.link.properties.id,
                nodePidDir: feature.node.properties.id,
                loadChild: 0 // 表示是否查询关联的子表信息 0 不查询 1查询
            }
        };
        var self = this;
        this.dataService.getByCondition(param).then(function (res) {
            var links = [];
            res.forEach(function (item, index, array) {
                links.push(item.pid);
            });
            self.uikitUtil.getCanvasFeaturesFromServer(links, 'RDLINK').then(function (features) {
                var list = FM.Util.clone(features);
                if (list && list.length > 0) {
                    list = list.splice(1);
                }
                self.selectObj.trackLinks = list;
                var arr = [];
                for (var i = 0, len = res.length; i < len; i++) {
                    arr.push({
                        id: res[i].pid,
                        geoLiveType: 'RDLINK'
                    });
                }
                callback(arr);
            });
        });
    },

    latlngToPoint: function (latlng) {
        return {
            type: 'Point',
            coordinates: [
                latlng.lng,
                latlng.lat
            ]
        };
    }

});
