FM.mapApi.render.renderer.ReceiveFreeRender = L.Class.extend({
    initialize: function () {
        this._symbolFactory = fastmap.mapApi.symbol.GetSymbolFactory();
        this._geometryFactory = fastmap.mapApi.symbol.GeometryFactory.getInstance();
    },

    getSymbol: function (feature, zoom) {
        var geoLiveType = feature.properties.geoLiveType;
        var featureRender = this._getRenderByGeoLiveType(geoLiveType, feature, zoom);
        if (!featureRender) {
            throw new Error('未实现符号化:' + geoLiveType);
        }
        return featureRender.getSymbol();
    },

    getHighlightSymbol: function (feature, zoom) {
        var geoLiveType = feature.properties.geoLiveType;
        var featureRender = this._getRenderByGeoLiveType(geoLiveType, feature, zoom);
        if (!featureRender) {
            throw new Error('未实现高亮符号化:' + geoLiveType);
        }
        return featureRender.getHighlightSymbol();
    },

    _getRenderByGeoLiveType: function (geoLiveType, feature, zoom) {
        var featureRender = null;
        switch (geoLiveType) {
            case 'RDLINK':
                return new FM.mapApi.render.renderer.TMRdLinkReceiveFree(feature, zoom);
            default:
                return null;
        }
    }
});
