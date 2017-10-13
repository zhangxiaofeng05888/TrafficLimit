FM.mapApi.render.renderer.TipMultiDigitized = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var symbols = [];
        for (var i = 0; i < 2; i++) {
            var testSymbol = {
                type: 'ImageMarkerSymbol',
                url: '../../images/road/tips/1501/0.svg',
                width: 18,
                height: 18
            };
            var borderSymbol = {
                type: 'ImageMarkerSymbol',
                url: '../../images/road/tips/icon/icon_' + this._feature.properties.path + '.svg',
                width: 22,
                height: 22
            };

            var blurSymbol = null;
            if (this._feature.properties.status === 0) {
                blurSymbol = {
                    type: 'CircleMarkerSymbol',
                    radius: 9,
                    color: 'transparent',
                    opacity: 0.5
                };
            } else {
                blurSymbol = {
                    type: 'ImageMarkerSymbol',
                    url: '../../images/road/tips/icon/status_' + this._feature.properties.status + '.svg',
                    width: 11,
                    height: 11,
                    offsetX: 11,
                    offsetY: -11
                };
            }

            var timeSymbol = {
                type: 'ImageMarkerSymbol',
                url: '../../images/road/tips/icon/icon_time.svg',
                width: 6,
                height: 6,

                offsetX: -11
            };
            var outLineSymbol = {
                type: 'ImageMarkerSymbol',
                url: '../../images/road/tips/icon/icon_outline.svg',
                width: 6,
                height: 6,

                offsetX: 11
            };
            var accessorySymbol = {
                type: 'ImageMarkerSymbol',
                url: '../../images/road/tips/icon/icon_attachment.svg',
                width: 6,
                height: 6,
                offsetY: 11
            };
            var compositeSymbols = [borderSymbol, testSymbol, blurSymbol];
            if (this._feature.properties.accessorySymbol === 1) {
                compositeSymbols.push(accessorySymbol);
            }
            if (this._feature.properties.timeSymbol === 1) {
                compositeSymbols.push(timeSymbol);
            }
            if (this._feature.properties.outLineSymbol === 1) {
                compositeSymbols.push(outLineSymbol);
            }
            var symbolData = {
                type: 'CompositeMarkerSymbol',
                symbols: compositeSymbols
            };
            var symbol = this._symbolFactory.createSymbol(symbolData);
            symbol.geometry = this._geometryFactory.createPoint(i === 0 ? this._feature.geometry.coordinates[0] : this._feature.geometry.coordinates[1]);
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
        // symbols.unshift(guideSymbol);
        return symbols;
    },
    getHighlightSymbol: function () {
        var symbols = [];
        for (var i = 0; i < 2; i++) {
            var symbolData = {
                type: 'CircleMarkerSymbol',
                radius: 9,
                color: 'transparent',
                outLine: {
                    width: 3,
                    color: '#00ffff'
                }
            };
            var symbol = this._symbolFactory.createSymbol(symbolData);
            symbol.geometry = this._geometryFactory.createPoint(i === 0 ? this._feature.geometry.coordinates[0] : this._feature.geometry.coordinates[1]);
            symbols.push(symbol);
        }
        return symbols;
    }
});

