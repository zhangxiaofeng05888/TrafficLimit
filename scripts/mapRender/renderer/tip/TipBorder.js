FM.mapApi.render.renderer.TipBorder = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var symbols = [];
        symbols = symbols.concat(this._addSimpleLineSymbol());
        symbols.push(this._addImageSymbol());
        return symbols;
    },
    _addSimpleLineSymbol: function () {
        var symbolData = {
            type: 'SimpleLineSymbol',
            color: '#E36C0A',
            width: 2
        };
        var symbols = [];
        var multiLineString = this._feature.geometry.geometries[1];
        for (var i = 0; i < multiLineString.coordinates.length; ++i) {
            var lineString = this._geometryFactory.createLineString(multiLineString.coordinates[i]);
            var symbol = this._symbolFactory.createSymbol(symbolData);
            symbol.geometry = lineString;

            symbols.push(symbol);
        }
        return symbols;
    },
    _addImageSymbol: function (data) {
        var waringSymbol = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/tips/8802/border.png',
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
        var compositeSymbols = [borderSymbol, waringSymbol, blurSymbol];
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
        symbol.geometry = this._geometryFactory.createPoint(this._feature.geometry.geometries[0].coordinates);
        return symbol;
    },

    getHighlightSymbol: function () {
        var symbols = [];
        for (var i = 0; i < this._feature.geometry.geometries.length; ++i) {
            var symbolData = {
                type: 'SimpleLineSymbol',
                color: '#00ffff',
                width: 2
            };
            for (var j = 0; j < this._feature.geometry.geometries[1].coordinates.length; j++) {
                var symbol = this._symbolFactory.createSymbol(symbolData);
                symbol.geometry = this._geometryFactory.createLineString(this._feature.geometry.geometries[1].coordinates[j]);
                symbols.push(symbol);
            }
        }
        var symbolData1 = {
            type: 'CircleMarkerSymbol',
            radius: 9,
            color: 'transparent',
            outLine: {
                width: 3,
                color: '#00ffff'
            }
        };
        var symbol1 = this._symbolFactory.createSymbol(symbolData1);
        symbol1.geometry = this._geometryFactory.createPoint(this._feature.geometry.geometries[0].coordinates);
        symbols.push(symbol1);
        return symbols;
    }
});
