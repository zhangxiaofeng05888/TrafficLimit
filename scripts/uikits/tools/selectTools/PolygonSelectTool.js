/**
 * Created by zhaohang on 2017/7/5.
 */
fastmap.uikit.selectTool.PolygonSelectTool = fastmap.uikit.MapTool.extend({
    initialize: function () {
        fastmap.uikit.MapTool.prototype.initialize.apply(this, arguments);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'PolygonSelectTool';
        this.geometryAlgorithm = fastmap.mapApi.geometry.GeometryAlgorithm.getInstance();
        this.feedbackController = fastmap.mapApi.FeedbackController.getInstance();
        this.sceneController = fastmap.mapApi.scene.SceneController.getInstance();
        this.symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();
        this.featureSelector = fastmap.mapApi.FeatureSelector.getInstance();
        this.eventController = fastmap.uikit.EventController();
        this.feedback = null;
        this.finalGeometry = {
            type: 'LineString',
            coordinates: []
        };
        this.dashPoint = null;
        this.isDrag = false;
        this.selectGeoLiveTypes = null;
        this.centerInfoFeedback = null;
        this.editing = true;
    },

    onActive: function (onFinish) {
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

        this.feedback = new fastmap.mapApi.Feedback();
        this.feedbackController.add(this.feedback);
        this.centerInfoFeedback = new fastmap.mapApi.Feedback();
        this.feedbackController.add(this.centerInfoFeedback);
        this.selectGeoLiveTypes = this.getSelectedGeoLiveTypes();
        this.eventController.on(L.Mixin.EventTypes.SCENECHANGED, this.onSceneChanged);
    },

    shutdown: function () {
        this.feedbackController.del(this.feedback);
        this.feedbackController.refresh();

        this.resetStatus();

        this.eventController.off(L.Mixin.EventTypes.SCENECHANGED, this.onSceneChanged);
    },

    resetStatus: function () {
        this.feedback = null;
        this.finalGeometry = {
            type: 'LineString',
            coordinates: []
        };
        this.dashPoint = null;
        this.isDrag = false;
        this.selectGeoLiveTypes = null;
        this.editing = true;
    },

    resetFeedback: function () {
        this.feedback.clear();
        if (this.finalGeometry.coordinates.length > 0 && this.dashPoint) {
            var lineString = {
                type: 'LineString',
                coordinates: []
            };
            lineString.coordinates.push(this.finalGeometry.coordinates[this.finalGeometry.coordinates.length - 1]);
            lineString.coordinates.push(this.dashPoint.coordinates);
            var lineSymbol = this.symbolFactory.getSymbol('shapeEdit_ls_dash');
            this.feedback.add(lineString, lineSymbol);
        }
        if (this.finalGeometry.coordinates.length > 1) {
            var finalLineSymbol = this.symbolFactory.getSymbol('shapeEdit_ls_edge');
            this.feedback.add(this.finalGeometry, finalLineSymbol);
        }
        if (this.finalGeometry.coordinates.length > 0) {
            var vertexSymbol = this.symbolFactory.getSymbol('shapeEdit_pt_vertex');

            for (var i = 0; i < this.finalGeometry.coordinates.length; ++i) {
                var vertex = this.coordinatesToPoint(this.finalGeometry.coordinates[i]);
                this.feedback.add(vertex, vertexSymbol);
            }
        }
        this.feedbackController.refresh();
    },

    getSelectedGeoLiveTypes: function () {
        var geoLiveTypes = [];
        if (!this.options) {
            geoLiveTypes = this.getSceneGeoLiveTypes();
        } else {
            geoLiveTypes = this.options;
        }

        return geoLiveTypes;
    },

    onSceneChanged: function (args) {
        this.selectGeoLiveTypes = this.getSelectedGeoLiveTypes();
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.MapTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        if (!this.isDrag) {
            return true;
        }

        if (!this.editing) {
            return false;
        }
        this.dashPoint = this.latlngToGeojson(event.latlng);

        this.resetFeedback();

        return true;
    },

    onLeftButtonClick: function (event) {
        if (!fastmap.uikit.MapTool.prototype.onLeftButtonClick.apply(this, arguments)) {
            return false;
        }

        if (!this.editing) {
            return false;
        }

        this.isDrag = true;

        this.finalGeometry.coordinates.push([event.latlng.lng, event.latlng.lat]);

        this.resetFeedback();

        return true;
    },

    onLeftButtonDblClick: function (event) {
        if (!fastmap.uikit.MapTool.prototype.onLeftButtonDblClick.apply(this, arguments)) {
            return false;
        }

        if (this.finalGeometry.coordinates.length < 4) {
            this.setCenterInfo('至少需要三个点组成面！', 2000);
            return false;
        }
        this.geometryAlgorithm.close(this.finalGeometry);
        var polygonGeometry = {
            type: 'Polygon',
            coordinates: [this.finalGeometry.coordinates]
        };
        var features = this.featureSelector.selectByGeometry(polygonGeometry, this.selectGeoLiveTypes);
        var options = {
            ctrlKey: event.originalEvent.ctrlKey,
            type: 'PolygonSelectTool'
        };
        this.editing = false;

        if (this.onFinish) {
            this.onFinish(polygonGeometry, event, options);
        }
        return true;
    },

    latlngToGeojson: function (latlng) {
        var geojson = {
            type: 'Point',
            coordinates: [latlng.lng, latlng.lat]
        };
        return geojson;
    },

    coordinatesToPoint: function (coordinates) {
        var point = {
            type: 'Point',
            coordinates: coordinates
        };
        return point;
    },

    setCenterInfo: function (msg, duration, color) {
        if (!this.centerInfoFeedback) {
            return;
        }

        this.centerInfoFeedback.clear();
        if (!msg) {
            this.resetFeedback();
            return;
        }

        var symbol = this.symbolFactory.getSymbol('relationEdit_tx_center_info');
        symbol = FM.Util.clone(symbol);
        symbol.text = msg;
        if (color) {
            symbol.color = color;
        }
        var latlng = this.map.getBounds().getCenter();
        var point = this.latlngToGeojson(latlng);
        this.centerInfoFeedback.add(point, symbol);
        this.resetFeedback();

        var self = this;
        if (duration) {
            setTimeout(function () {
                self.setCenterInfo('');
            }, duration);
        }
    }
});
