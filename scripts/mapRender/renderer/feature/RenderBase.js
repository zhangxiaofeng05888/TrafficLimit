FM.mapApi.render.renderer.Renderer = L.Class.extend({
    initialize: function (feature, zoom) {
        this._feature = feature;
        this._zoom = zoom;

        this._symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();
        this._geometryFactory = fastmap.mapApi.symbol.GeometryFactory.getInstance();
    },

    getSymbol: function (feature, zoom) {
        throw new Error('RenderBase未实现getSymbol方法');
    },

    getHighlightSymbol: function (feature, zoom) {
        throw new Error('RenderBase未实现getHighlightSymbol方法');
    }
});
