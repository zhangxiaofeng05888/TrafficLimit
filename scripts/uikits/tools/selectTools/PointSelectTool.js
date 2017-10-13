/**
 * Created by xujie3949 on 2016/12/28.
 */

fastmap.uikit.selectTool.PointSelectTool = fastmap.uikit.MapTool.extend({
    initialize: function () {
        fastmap.uikit.MapTool.prototype.initialize.apply(this, arguments);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'PointSelectTool';

        this.feedbackController = fastmap.mapApi.FeedbackController.getInstance();
        this.geometryFactory = fastmap.mapApi.symbol.GeometryFactory.getInstance();
        this.featureSelector = fastmap.mapApi.FeatureSelector.getInstance();
        this.feedback = null;
        this.selectGeoLiveTypes = [];
        this.selectTolerance = 10;
        this.symbols = [];
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

        this.feedback = new fastmap.mapApi.Feedback();
        this.feedbackController.add(this.feedback);
        this.selectGeoLiveTypes = this.getSelectedGeoLiveTypes();
        this.map.on('SceneChanged', this.onSceneChanged);
    },

    shutdown: function () {
        this.feedbackController.del(this.feedback);
        this.feedbackController.refresh();
        this.map.off('SceneChanged', this.onSceneChanged);
        this.resetStatus();
    },

    resetStatus: function () {
        this.feedback = null;
        this.selectGeoLiveTypes = [];
        this.symbols = [];
    },

    onSceneChanged: function () {
        this.selectGeoLiveTypes = this.getSelectedGeoLiveTypes();
    },

    getSelectedGeoLiveTypes: function () {
        var geoLiveTypes = [];
        if (!this.options) {
            geoLiveTypes = this.getEditableGeoLiveTypes();
        } else {
            geoLiveTypes = [this.options];
        }

        return geoLiveTypes;
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.MapTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        var point = this.latlngToGeojson(event.latlng);
        var box = this.getBox(point, this.selectTolerance);
        var features = this.featureSelector.selectByGeometry(box, this.selectGeoLiveTypes);
        this.symbolizeFeatures(features);
        this.resetFeedback();

        return true;
    },

    onLeftButtonClick: function (event) {
        if (!fastmap.uikit.MapTool.prototype.onLeftButtonClick.apply(this, arguments)) {
            return false;
        }

        var point = this.latlngToGeojson(event.latlng);
        var box = this.getBox(point, this.selectTolerance);
        var features = this.featureSelector.selectByGeometry(box, this.selectGeoLiveTypes);

        if (this.onFinish) {
            this.onFinish(features, event);
        }

        return true;
    },

    getBox: function (point, tolerance) {
        var x = point.coordinates[0];
        var y = point.coordinates[1];
        var pixelPoint = this.map.project([y, x]);
        var left = pixelPoint.x - tolerance;
        var right = pixelPoint.x + tolerance;
        var top = pixelPoint.y - tolerance;
        var bottom = pixelPoint.y + tolerance;

        var geojson = {
            type: 'Polygon',
            coordinates: []
        };

        var coordinates = [];
        var leftTop = this.map.unproject([left, top]);
        var rightTop = this.map.unproject([right, top]);
        var rightBottom = this.map.unproject([right, bottom]);
        var leftBottom = this.map.unproject([left, bottom]);

        coordinates.push([leftTop.lng, leftTop.lat]);
        coordinates.push([rightTop.lng, rightTop.lat]);
        coordinates.push([rightBottom.lng, rightBottom.lat]);
        coordinates.push([leftBottom.lng, leftBottom.lat]);
        coordinates.push([leftTop.lng, leftTop.lat]);

        geojson.coordinates = [coordinates];

        return geojson;
    },

    resetFeedback: function () {
        if (!this.feedback) {
            return;
        }

        this.feedback.clear();

        this.symbols.forEach(function (symbol) {
            var geometry = this.geometryFactory.toGeojson(symbol.geometry);
            this.feedback.add(geometry, symbol);
        }, this);

        this.feedbackController.refresh();
    },

    latlngToGeojson: function (latlng) {
        var geojson = {
            type: 'Point',
            coordinates: [latlng.lng, latlng.lat]
        };
        return geojson;
    }
});
