FM.mapApi.render.renderer.RdHgwgLimit = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var symbolData1 = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/hgwgLimit/0.svg',
            width: 24,
            height: 24
        };
        var symbolData2 = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/1101/1101_0_0_s.svg',
            width: 24,
            height: 24,
            angle: -90,
            offsetX: 15,
            offsetY: 0
        };
        var json = {
            type: 'CompositeMarkerSymbol',
            symbols: [symbolData1, symbolData2],
            angle: this._feature.properties.rotate
        };
        var symbol = this._symbolFactory.createSymbol(json);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    },
    getHighlightSymbol: function () {
        var symbolData = {
            type: 'SquareMarkerSymbol',
            color: 'transparent',
            size: 30,
            outLine: {
                width: 3,
                color: '#45c8f2'
            }
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    }
});
