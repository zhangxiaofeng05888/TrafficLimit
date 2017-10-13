FM.mapApi.render.renderer.RdGate = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var url;
        if (this._feature.properties.direct != 0) {
            url = '../../images/road/rdGate/' + this._feature.properties.kind + '_' + this._feature.properties.direct + '.svg';
        } else {
            url = '../../images/road/rdGate/' + this._feature.properties.kind + '_2.svg';
        }
        var symbolData1 = {
            type: 'ImageMarkerSymbol',
            url: url,
            width: 24,
            height: 24
        };
        var symbol = this._symbolFactory.createSymbol(symbolData1);
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
