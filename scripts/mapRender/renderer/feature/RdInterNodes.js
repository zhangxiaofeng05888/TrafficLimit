FM.mapApi.render.renderer.RdInterNodes = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var symbolData1 = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/crf/11.png',
            width: 10,
            height: 10
        };
        var symbolData2 = {
            type: 'CircleMarkerSymbol',
            radius: 3,
            color: 'green',
            opacity: 1
        };
        var json = {
            type: 'CompositeMarkerSymbol',
            symbols: [symbolData1, symbolData2]
        };
        var symbol = this.symbolFactory.createSymbol(json);
        symbol.geometry = this.geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    },

    addHighlightSymbol: function () {
        var symbolData = {
            type: 'CircleMarkerSymbol',
            radius: 4,
            color: 'green',
            opacity: 1
        };
        var symbol = this.symbolFactory.createSymbol(symbolData);
        symbol.geometry = this.geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    }

});
