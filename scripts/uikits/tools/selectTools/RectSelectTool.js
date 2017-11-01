/**
 * Created by xujie3949 on 2016/12/28.
 */

fastmap.uikit.selectTool.RectSelectTool = fastmap.uikit.MapTool.extend({
    initialize: function () {
        fastmap.uikit.MapTool.prototype.initialize.apply(this, arguments);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'RectSelectTool';

        this.feedbackController = fastmap.mapApi.FeedbackController.getInstance();
        this.sceneController = fastmap.mapApi.scene.SceneController.getInstance();
        this.symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();
        this.featureSelector = fastmap.mapApi.FeatureSelector.getInstance();
        this.geometryFactory = fastmap.mapApi.symbol.GeometryFactory.getInstance();
        this.geojsonTransform = fastmap.mapApi.GeometryTransform.getInstance();
        this.geometryAlgorithm = fastmap.mapApi.geometry.GeometryAlgorithm.getInstance();
        this.eventController = fastmap.uikit.EventController();

        this.selectSquareFeedBack = null;
        this.selectFeatureFeedBack = null;
        this.startPoint = null;
        this.endPoint = null;
        this.isDrag = false;
        this.selectGeoLiveTypes = null;
        this.selectedFeatures = [];
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
        // 分别添加feedback;
        this.selectSquareFeedBack = new fastmap.mapApi.Feedback();
        this.feedbackController.add(this.selectSquareFeedBack);
        this.selectFeatureFeedBack = new fastmap.mapApi.Feedback();
        this.feedbackController.add(this.selectFeatureFeedBack);
        this.selectGeoLiveTypes = this.getSelectedGeoLiveTypes();
        this.map.on('SceneChanged', this.onSceneChanged);
        this.eventController.on('clearHighLightINTool', this.clearFeedBack);
    },

    clearFeedBack: function () {
        this.selectFeatureFeedBack.clear();
        this.feedbackController.refresh();
    },

    shutdown: function () {
        this.feedbackController.del(this.selectSquareFeedBack);
        this.feedbackController.del(this.selectFeatureFeedBack);
        this.feedbackController.refresh();

        this.resetStatus();

        this.map.off('SceneChanged', this.onSceneChanged);
        this.eventController.off('clearHighLightINTool', this.clearFeedBack);
    },

    resetStatus: function () {
        this.selectSquareFeedBack = null;
        this.selectFeatureFeedBack = null;
        this.startPoint = null;
        this.endPoint = null;
        this.isDrag = false;
        this.selectGeoLiveTypes = null;
    },

    getSelectedGeoLiveTypes: function () {
        var geoLiveTypes = [];

        if (!this.options) {
            geoLiveTypes = this.getEditableGeoLiveTypes();
        } else if (FM.Util.isArray(this.options)) {
            geoLiveTypes = this.options;
        } else if (this.options === 'TIPS') {
            var tipLayers = this.sceneController.getLayersByLabel('tip');
            tipLayers.forEach(function (item) {
                geoLiveTypes.push(item.getFeatureType());
            });
        } else {
            geoLiveTypes = [this.options];
        }

        return geoLiveTypes;
    },

    onSceneChanged: function (args) {
        this.selectGeoLiveTypes = this.getSelectedGeoLiveTypes();
    },

    refresh: function () {
        this.resetSquareFeedback();
        this.resetFeatureFeedback();
    },

    convertToPixel: function (map, tileInfo, coordinates) {
        var x = coordinates[0];
        var y = coordinates[1];
        var point = map.project([
            y,
            x
        ]);
        return [
            point.x,
            point.y
        ];
    },

    convertToGeography: function (map, tileInfo, coordinates) {
        var x = coordinates[0];
        var y = coordinates[1];
        var lnglat = map.unproject([
            x,
            y
        ]);
        return [
            lnglat.lng,
            lnglat.lat
        ];
    },

    resetSquareFeedback: function () {
        if (!this.selectSquareFeedBack) {
            return;
        }

        this.selectSquareFeedBack.clear();

        if (this.isDrag && this.startPoint && this.endPoint) {
            var box = this.getSelectBox(this.startPoint, this.endPoint);
            var symbol = this.symbolFactory.getSymbol('selectTool_py_rectSelect');
            this.selectSquareFeedBack.add(box, symbol);
        }

        this.feedbackController.refresh();
    },

    resetFeatureFeedback: function () {
        if (!this.selectFeatureFeedBack) {
            return;
        }
        this.selectFeatureFeedBack.clear();

        if (this.symbols && this.symbols.length) {
            this.symbols.forEach(function (highLightSymbol) {
                var geometry = this.geometryFactory.toGeojson(highLightSymbol.geometry);
                this.selectFeatureFeedBack.add(geometry, highLightSymbol);
            }, this);
        }

        this.feedbackController.refresh();
    },

    onLeftButtonDown: function (event) {
        if (!fastmap.uikit.MapTool.prototype.onLeftButtonDown.apply(this, arguments)) {
            return false;
        }

        this.startPoint = this.latlngToGeojson(event.latlng);
        this.isDrag = true;

        return true;
    },

    onMouseMove: function (event) {
        if (!fastmap.uikit.MapTool.prototype.onMouseMove.apply(this, arguments)) {
            return false;
        }

        if (!this.isDrag) {
            return true;
        }

        this.endPoint = this.latlngToGeojson(event.latlng);

        this.resetSquareFeedback();

        return true;
    },

    modifyFeatures: function (features) {
        var addItems = FM.Util.differenceBy(this.selectedFeatures, features, 'properties.id');
        var remainItems = FM.Util.differenceBy(features, this.selectedFeatures, 'properties.id');
        this.selectedFeatures = remainItems.concat(addItems);
    },

    onLeftButtonUp: function (event) {
        if (!fastmap.uikit.MapTool.prototype.onLeftButtonUp.apply(this, arguments)) {
            return false;
        }

        if (!this.isDrag) {
            return false;
        }

        this.isDrag = false;

        this.endPoint = this.latlngToGeojson(event.latlng);

        var box = this.getSelectBox(this.startPoint, this.endPoint);
        this.geojsonTransform.setEnviroment(map, null, this.convertToPixel);
        var pixelBox = this.geometryAlgorithm.bbox(this.geojsonTransform.convertGeometry(box));
        var lengthX = Math.abs(pixelBox.maxX - pixelBox.minX);
        var lengthY = Math.abs(pixelBox.maxY - pixelBox.minY);
        var boxPixelArea = lengthX * lengthY;

        var features = this.featureSelector.selectByGeometry(box, this.selectGeoLiveTypes);
        // 框选框面积小于100并且没有框选到数据则认为不是要清除高亮和回收面板;
        if (!features.length && boxPixelArea < 100) {
            this.resetSquareFeedback();
            return false;
        }

        if (event.originalEvent.ctrlKey) {
            this.modifyFeatures(features);
        } else {
            this.selectedFeatures = features;
        }

        this.symbolizeFeatures(this.selectedFeatures);
        this.refresh();

        var options = {
            ctrlKey: event.originalEvent.ctrlKey,
            type: 'rectSelect'
        };

        if (this.onFinish) {
            this.onFinish(this.selectedFeatures, event, options);
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

    getSelectBox: function (point1, point2) {
        var minLng = Math.min(point1.coordinates[0], point2.coordinates[0]);
        var minLat = Math.min(point1.coordinates[1], point2.coordinates[1]);
        var maxLng = Math.max(point1.coordinates[0], point2.coordinates[0]);
        var maxLat = Math.max(point1.coordinates[1], point2.coordinates[1]);

        var coordinates = [];
        coordinates.push([minLng, minLat]);
        coordinates.push([minLng, maxLat]);
        coordinates.push([maxLng, maxLat]);
        coordinates.push([maxLng, minLat]);
        coordinates.push([minLng, minLat]);

        var geojson = {
            type: 'Polygon',
            coordinates: [coordinates]
        };
        return geojson;
    }
});
