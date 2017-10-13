/**
 * Created by wangtun on 2017/5/2.
 */
fastmap.uikit.selectTool.StreetViewSelectTool = fastmap.uikit.MapTool.extend({
    initialize: function () {
        fastmap.uikit.MapTool.prototype.initialize.apply(this, arguments);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'StreetViewSelectTool';

        this.feedbackController = fastmap.mapApi.FeedbackController.getInstance();
        this.symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();
        this.geometryFactory = fastmap.mapApi.symbol.GeometryFactory.getInstance();
        this.featureSelector = fastmap.mapApi.FeatureSelector.getInstance();
        this.snapController = fastmap.mapApi.snap.SnapController.getInstance();
        this.dataService = fastmap.service.DataServiceEdit.getInstance();
        this.uikitUtil = fastmap.uikit.Util.getInstance();
        this.eventController = fastmap.uikit.EventController();
        this.defaultFeedback = null;
        this.feedbacks = [];
        this.symbols = [];
        this.snapActor = null;
        this.snapActors = [];
        this.mousePoint = null;
        this.onFinish = null;
        this.center = null;
        this.heading = 0;
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

        this.eventController.on(L.Mixin.EventTypes.STREETVIEWHEADINGCHANGED, this.refreshHeading);
    },

    shutdown: function () {
        this.defaultFeedback = null;

        this.uninstallFeedbacks();

        this.snapController.shutdown();

        this.uninstallSnapActors(this.snapActor);

        this.resetStatus();

        this.eventController.off(L.Mixin.EventTypes.STREETVIEWHEADINGCHANGED, this.refreshHeading);
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
    },

    resetFeedback: function () {
        if (!this.defaultFeedback) {
            return;
        }

        this.defaultFeedback.clear();

        if (this.center && this.heading) {
            var pt = this.latlngToPoint(this.center);
            if (!pt) {
                return;
            }
            var pointSymbol = this.symbolFactory.getSymbol('pt_streetView_heading');
            pointSymbol.angle = this.heading;
            this.defaultFeedback.add(pt, pointSymbol);
        }

        this.feedbackController.refresh();
    },

    installLinkSnapActor: function () {
        this.uninstallSnapActors(this.snapActor);
        this.snapActor = this.createFeatureSnapActor('RDLINK', null);

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

    createFeatureSnapActor: function (layerId, exceptions) {
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

        var self = this;
        self.pause();
        var panoLatLng = new qq.maps.LatLng(event.latlng.lat, event.latlng.lng);
        var panoService = new qq.maps.PanoramaService();
        panoService.getPano(panoLatLng, 100, function (result) {
            var data = {
                result: result,
                event: event
            };
            self.eventController.fire(L.Mixin.EventTypes.PARTSOPENPANEL, { panelName: 'StreetView', data: data });
            if (self.onFinish) {
                self.onFinish([], event);
            }

            var x1 = result.latlng.lng;
            var y1 = result.latlng.lat;
            var x2 = event.latlng.lng;
            var y2 = event.latlng.lat;

            var alpha = Math.acos((y2 - y1) / Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
            if (x2 - x1 < 0) {
                alpha = Math.PI * 2 - alpha;
            }

            self.center = result.latlng;
            self.heading = (alpha / Math.PI) * 180;
            self.refresh();
        });

        return true;
    },

    onKeyUp: function (event) {
        if (!fastmap.uikit.MapTool.prototype.onKeyUp.apply(this, arguments)) {
            return false;
        }

        var key = event.key;
        switch (key) {
            case 'Escape':
                this.selectObj = {};
                // this.uninstallFeedbacks();
                this.refresh();
                break;
            default:
                break;
        }

        return true;
    },

    refreshHeading: function (param) {
        this.center = param.center;
        this.heading = param.heading;
        this.refresh();
    },

    drawHeadingSymbol: function (param) {
        var pt = this.latlngToPoint(param.center);
        if (!pt) {
            return;
        }

        var pointSymbol = this.symbolFactory.getSymbol('pt_streetView_heading');
        pointSymbol.angle = this.heading;
        this.defaultFeedback.add(pt, pointSymbol);
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
