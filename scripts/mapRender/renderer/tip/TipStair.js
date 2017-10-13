FM.mapApi.render.renderer.TipStair = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },

    getSymbol: function () {
        var symbols = [];
        for (var j = 0; j < this._feature.geometry.geometries[2].coordinates.length; ++j) {
            var compositeSymbol = this._symbolFactory.createSymbol({ type: 'CompositeLineSymbol' });
            compositeSymbol.geometry = this._geometryFactory.createLineString(this._feature.geometry.geometries[2].coordinates[j]);

            var lineSymbolData = {
                type: 'MarkerLineSymbol',
                direction: this._feature.properties.grade === 2 ? 'e2s' : 's2e',
                marker: {
                    type: 'TriangleMarkerSymbol',
                    width: 4,
                    height: 4,
                    sunken: 2,
                    outLine: {
                        color: '#000',
                        width: 1
                    }
                },
                pattern: [40, 10]
            };
            var lineSymbol = this._symbolFactory.createSymbol(lineSymbolData);
            compositeSymbol.symbols.push(lineSymbol);

            var lineData = {
                type: 'CartoLineSymbol',
                color: '#000',
                width: 1,
                opacity: 0.7,
                pattern: [4, 4]
            };
            var linesSymbol = this._symbolFactory.createSymbol(lineData);
            linesSymbol.geometry = this._geometryFactory.createLineString(this._feature.geometry.geometries[2].coordinates[j]);
            compositeSymbol.symbols.push(linesSymbol);
            symbols.push(compositeSymbol);
        }
        for (var i = 0; i < 2; i++) {
            var testSymbol = {
                type: 'ImageMarkerSymbol',
                url: '../../images/road/tips/1518/1518_0_0.svg',
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

            var compositeSymbols = [borderSymbol, testSymbol, blurSymbol];
            var symbolData = {
                type: 'CompositeMarkerSymbol',
                symbols: compositeSymbols
            };
            var symbol = this._symbolFactory.createSymbol(symbolData);
            symbol.geometry = this._geometryFactory.createPoint(i === 0 ? this._feature.geometry.geometries[0].coordinates : this._feature.geometry.geometries[1].coordinates);
            symbols.push(symbol);
        }
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
            symbol.geometry = this._geometryFactory.createPoint(i === 0 ? this._feature.geometry.geometries[0].coordinates : this._feature.geometry.geometries[1].coordinates);
            symbols.push(symbol);
        }
        for (var m = 0; m < this._feature.geometry.geometries[2].coordinates.length; m++) {
            var symbolData1 = {
                type: 'SimpleLineSymbol',
                color: '#00ffff',
                width: 2
            };

            var symbol1 = this._symbolFactory.createSymbol(symbolData1);
            symbol1.geometry = this._geometryFactory.createLineString(this._feature.geometry.geometries[2].coordinates[m]);

            symbols.push(symbol1);
        }
        return symbols;
    }
});
