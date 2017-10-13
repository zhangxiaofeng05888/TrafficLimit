FM.mapApi.render.renderer.TipADASLink = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },

    getSymbol: function () {
        var simpleSymbol = this.addSimpleLineSymbol();
        var imageSymbol = this.addImageSymbol();
        return [simpleSymbol, imageSymbol];
    },
    addSimpleLineSymbol: function () {
        var symbolData = {
            type: 'SimpleLineSymbol',
            color: '#000000',
            width: 2
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.createLineString(this._feature.geometry.geometries[1].coordinates);
        return symbol;
    },

    addImageSymbol: function () {
        var waringSymbol = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/tips/2002/2002_0_0.svg',
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

        var compositeSymbols = [borderSymbol, waringSymbol, blurSymbol];
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
