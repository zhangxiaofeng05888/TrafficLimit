FM.mapApi.render.renderer.TipCrossVoiceGuide = FM.mapApi.render.Renderer.extend({
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
                angle: this._feature.properties.rotate
            };

            var symbol = this._symbolFactory.createSymbol(symbolData);
            symbol.geometry = this._geometryFactory.createPoint(this._feature.geometry.coordinates[i]);

            symbols.push(symbol);
        }
        var guideLinkData = {
            type: 'CartoLineSymbol',
            color: '#4343FF',
            width: 1,
            pattern: [4, 2]
        };
        var guideSymbol = this._symbolFactory.createSymbol(guideLinkData);
        guideSymbol.geometry = this._geometryFactory.fromGeojson(this._feature.guideLink);
        symbols.unshift(guideSymbol);
        return symbols;
    },
    getHighlightSymbol: function () {
        var symbols = [];
        for (var i = 0; i < this._feature.properties.kinds.length; i++) {
            var symbolData = {
                type: 'CircleMarkerSymbol',
                radius: 16,
                color: 'transparent',
                outLine: {
                    width: 3,
                    color: '#00ffff'
                }
            };

            var symbol = this._symbolFactory.createSymbol(symbolData);
            symbol.geometry = this._geometryFactory.createPoint(this._feature.geometry.coordinates[i]);

            symbols.push(symbol);
        }
        return symbols;
    }
});
