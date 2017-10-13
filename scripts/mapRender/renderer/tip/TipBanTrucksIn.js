FM.mapApi.render.renderer.TipBanTrucksIn = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function (data) {
        var symbolData = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/tips/1308/1308_' + this._feature.properties.kind + '_0.svg',
            width: 22,
            height: 22,
            angle: this._feature.properties.rotate - 180,
            outLine: {
                width: 1,
                color: 'red'
            }
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.createPoint(this._feature.geometry.coordinates);
        var guideLinkData = {
            type: 'CartoLineSymbol',
            color: '#4343FF',
            width: 1,
            pattern: [4, 2]
        };
        var guideSymbol = this._symbolFactory.createSymbol(guideLinkData);
        guideSymbol.geometry = this._geometryFactory.fromGeojson(this._feature.guideLink);
        return [guideSymbol, symbol];
    },
    getHighlightSymbol: function (data) {
        var symbolData = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/tips/1308/1308_' + this._feature.properties.kind + '_0.svg',
            width: 22,
            height: 22,
            angle: this._feature.properties.rotate - 180,
            outLine: {
                width: 1,
                color: '#00ffff'
            }
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    }
});
