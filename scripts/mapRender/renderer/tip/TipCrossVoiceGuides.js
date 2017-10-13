FM.mapApi.render.renderer.TipCrossVoiceGuides = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var symbols = [];
        for (var i = 0; i < this._feature.properties.kinds.length; i++) {
            var waringSymbol = {
                type: 'ImageMarkerSymbol',
                url: '../../images/road/tips/1306/1306_' + this._feature.properties.kinds[i] + '_0.svg',
                width: 22,
                height: 22,
                outLine: {
                    width: 1,
                    color: 'red'
                }
            };
            var arrowSymbol = {
                type: 'ImageMarkerSymbol',
                url: '../../images/road/tips/1111/1111_0_0.svg',
                width: 30,
                height: 30,
                angle: -90,
                offsetY: -21
            };
            var compositeSymbols = [waringSymbol, arrowSymbol];
            var symbolData = {
                type: 'CompositeMarkerSymbol',
                symbols: compositeSymbols,
                offsetX: -15 * (this._feature.properties.kinds.length - 1) + 30 * i
            };
            symbols.push(symbolData);
        }
        var symbolData1 = {
            type: 'CompositeMarkerSymbol',
            symbols: symbols,
            angle: this._feature.properties.rotate
        };
        var symbol = this._symbolFactory.createSymbol(symbolData1);
        symbol.geometry = this._geometryFactory.createPoint(this._feature.properties.geo);
        return symbol;
    },
    getHighlightSymbol: function () {
        var symbols = [];
        for (var i = 0; i < this._feature.properties.kinds.length; i++) {
            var waringSymbol = {
                type: 'ImageMarkerSymbol',
                url: '../../images/road/tips/1306/1306_' + this._feature.properties.kinds[i] + '_0.svg',
                width: 30,
                height: 30,
                offsetX: -15 * (this._feature.properties.kinds.length - 1) + 30 * i,
                outLine: {
                    width: 1,
                    color: '#00ffff'
                }
            };
            symbols.push(waringSymbol);
        }
        var symbolData = {
            type: 'CompositeMarkerSymbol',
            symbols: symbols,
            angle: this._feature.properties.rotate
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.createPoint(this._feature.properties.geo);
        return symbol;
    }
});
