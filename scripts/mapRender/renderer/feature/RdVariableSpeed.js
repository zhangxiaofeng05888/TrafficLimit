FM.mapApi.render.renderer.RdVariableSpeed = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var imageSrc = '../../images/road/variableSpeed/1.svg';
        var symbolData = {
            type: 'ImageMarkerSymbol',
            url: imageSrc,
            width: 30,
            height: 30
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
            outLine: {
                width: 1,
                color: 'blue'
            }
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    }
});
