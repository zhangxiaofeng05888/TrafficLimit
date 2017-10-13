FM.mapApi.render.renderer.RdLinkSpeedLimit = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var limitSrc;
        if (this._feature.properties.direct == 2) {
            limitSrc = this._feature.properties.fromLimitSrc;
        } else if (this._feature.properties.direct == 3) {
            limitSrc = this._feature.properties.toLimitSrc;
        }
        var symbolData1 = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/1101/linkspeedlimit_' + limitSrc + '.svg',
            width: 24,
            height: 24
        };
        var symbolData2 = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/1101/arrow_' + limitSrc + '.svg',
            width: 24,
            height: 24,
            offsetX: 0,
            offsetY: -17
        };
        var symbolData3 = {
            type: 'TextMarkerSymbol',
            text: this._feature.properties.speedValue,
            font: '微软雅黑',
            size: 12
        };
        var json = {
            type: 'CompositeMarkerSymbol',
            symbols: [symbolData1, symbolData2, symbolData3],
            angle: (this._feature.properties.rotate - 90)
        };
        var symbol = this._symbolFactory.createSymbol(json);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    },
    getHighlightSymbol: function () {
        var symbolData = {
            type: 'SquareMarkerSymbol',
            color: 'transparent',
            size: 34,
            angle: (this._feature.properties.rotate - 90),
            outLine: {
                width: 3,
                color: '#45c8f2'
            }
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    }
});
