FM.mapApi.render.renderer.CustomTipBridge = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var symbols = [];
        symbols = symbols.concat(this._addSimpleLineSymbol());
        symbols = symbols.concat(this._addImageSymbol());
        return symbols;
    },
    _addSimpleLineSymbol: function () {
        var symbols = [];
        for (var m = 0; m < this._feature.geometry.geometries[2].coordinates.length; m++) {
            var symbolData = {
                type: 'SimpleLineSymbol',
                color: 'blue',
                width: 2
            };
            var symbolData1 = {
                type: 'HashLineSymbol',
                hashHeight: 6,
                hashLine: {
                    type: 'SimpleLineSymbol',
                    color: 'blue',
                    width: 1,
                    style: 'solid'
                },
                pattern: [2, 5]
            };
            var json = {
                type: 'CompositeLineSymbol',
                symbols: [symbolData, symbolData1]
            };

            var symbol1 = this._symbolFactory.createSymbol(json);
            symbol1.geometry = this._geometryFactory.createLineString(this._feature.geometry.geometries[2].coordinates[m]);

            symbols.push(symbol1);
        }
        return symbols;
    },
    _addImageSymbol: function () {
        var symbols = [];
        for (var i = 0; i < 2; i++) {
            var testSymbol = {
                type: 'ImageMarkerSymbol',
                url: '../../images/road/tips/1510/0.svg',
                width: 18,
                height: 18
            };
            var borderSymbol = {
                type: 'ImageMarkerSymbol',
                url: '../../images/road/tips/icon/icon_' + this._feature.properties.kind + '.svg',
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
