FM.mapApi.render.renderer.RdWarningInfo = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var imageSrc = '../../images/road/warningInfo/13701.svg'; // 默认危险信息
        if (this._feature.properties.info.type) {
            imageSrc = '../../images/road/warningInfo/' + this._feature.properties.info.type + '.svg';
        }
        var symbolData = {
            type: 'ImageMarkerSymbol',
            url: imageSrc,
            width: 40,
            height: 40,
            angle: this._feature.properties.angle
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
