FM.mapApi.render.renderer.TipBusDriveway = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var waringSymbol = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/tips/1310/1310_0_0.svg',
            width: 22,
            height: 22,
            angle: this._feature.properties.rotate - 180,
            outLine: {
                width: 1,
                color: 'red'
            }
        };

        var timeSymbol = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/tips/icon/icon_time.svg',
            width: 6,
            height: 6,

            offsetX: -11
        };

        var compositeSymbols = [waringSymbol];
        if (this._feature.properties.timeSymbol === 1) {
            compositeSymbols.push(timeSymbol);
        }

        var symbolData = {
            type: 'CompositeMarkerSymbol',
            symbols: compositeSymbols
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
    getHighlightSymbol: function () {
        var symbolData = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/tips/1310/1310_0_0.svg',
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

