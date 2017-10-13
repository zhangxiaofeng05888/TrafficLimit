/**
 * Created by xujie3949 on 2016/12/8.
 */

fastmap.uikit.MapTool = fastmap.uikit.Tool.extend({
    initialize: function () {
        fastmap.uikit.Tool.prototype.initialize.call(this);

        // 绑定函数作用域
        FM.Util.bind(this);

        this.name = 'MapTool';

        this.sceneController = fastmap.mapApi.scene.SceneController.getInstance();
    },

    onActive: function (map, onFinish, options) {
        if (!fastmap.uikit.Tool.prototype.onActive.apply(this, arguments)) {
            return false;
        }

        this.map.getContainer().style.cursor = 'default';

        return true;
    },

    onWheel: function (event) {
        if (!fastmap.uikit.Tool.prototype.onWheel.apply(this, arguments)) {
            return false;
        }

        if (!this.map) {
            return false;
        }
        var zoom = this.map.getZoom();
        var mousePoint = this.map.mouseEventToLatLng(event);
        if (event.deltaY > 0) {
            if (zoom === this.map.getMinZoom()) {
                return true;
            }
            zoom -= 1;
        } else {
            if (zoom === this.map.getMaxZoom()) {
                return true;
            }
            zoom += 1;
        }
        this.map.setZoomAround(mousePoint, zoom);

        return true;
    },

    onRightButtonClick: function (event) {
        if (!fastmap.uikit.Tool.prototype.onRightButtonClick.apply(this, arguments)) {
            return false;
        }

        this.map.setView(event.latlng);

        return true;
    },

    getSceneGeoLiveTypes: function () {
        return this.sceneController.getLoadedFeatureTypes();
    },

    getRendersByGeoLiveType: function (geoLiveType) {
        var renders = [];
        var layers = this.sceneController.getLoadedLayersByFeatureType(geoLiveType);
        for (var i = 0; i < layers.length; i++) {
            if (layers[i].getFeatureType() === geoLiveType) {
                renders.push(layers[i].getRender());
            }
        }

        return FM.Util.unique(renders);
    },

    symbolizeFeatures: function (features) {
        this.symbols = [];
        var feature;
        var renders,
            symbol;
        var i,
            j;
        var zoom = this.map.getZoom();
        for (i = 0; i < features.length; ++i) {
            feature = features[i];
            renders = this.getRendersByGeoLiveType(feature.properties.geoLiveType);
            for (j = 0; j < renders.length; j++) {
                symbol = new renders[j]().getHighlightSymbol(feature, zoom);
                if (!symbol) {
                    // 如果要素在某种情况下不需要绘制会返回null
                    continue;
                }
                if (FM.Util.isArray(symbol)) {
                    this.symbols = this.symbols.concat(symbol);
                } else {
                    this.symbols.push(symbol);
                }
            }
        }
    },

    getEditableGeoLiveTypes: function () {
        return this.sceneController.getEditableFeatureTypes();
    }
});
