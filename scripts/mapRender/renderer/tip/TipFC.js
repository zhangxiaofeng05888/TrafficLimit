FM.mapApi.render.renderer.TipFC = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var symbols = [];
        symbols = symbols.concat(this.addSimpleLineSymbol());
        symbols.push(this.addImageSymbol());
        return symbols;
    },
    addSimpleLineSymbol: function () {
        var symbolData = {
            type: 'CartoLineSymbol',
            color: '#000000',
            width: 2,
            pattern: [16, 16]
        };

        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.createLineString(this._feature.geometry.geometries[1].coordinates);
        return symbol;
    },
    addImageSymbol: function () {
        var waringSymbol = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/voiceGuide/FC.png',
            width: 18,
            height: 18
        };
        var borderSymbol = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/tips/icon/icon_' + this._feature.properties.path + '.svg',
            width: 22,
            height: 22
        };
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
        var compositeSymbols = [borderSymbol, waringSymbol];
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
        symbol.geometry = this._geometryFactory.createPoint(this._feature.geometry.geometries[0].coordinates);
        symbols.push(symbol);
        var symbolData1 = {
            type: 'SimpleLineSymbol',
            color: '#00ffff',
            width: 2
        };
        var symbol1 = this._symbolFactory.createSymbol(symbolData1);
        symbol1.geometry = this._geometryFactory.createLineString(this._feature.geometry.geometries[1].coordinates);

        symbols.push(symbol1);

        return symbols;
    }
});

