FM.mapApi.render.renderer.RdDirectRoute = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var symbolData = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/rdDirectRoute/0.png',
            offsetX: -5,
            offsetY: -5,
            width: 24,
            angle: this._feature.properties.angle - 180,
            height: 24
        };

        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    },
    getHighlightSymbol: function () {
        var symbolData = {
            type: 'SquareMarkerSymbol',
            color: 'transparent',
            size: 30,
            angle: this._feature.properties.angle - 180,
            // offsetX: -5,
            // offsetY: -5,
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
