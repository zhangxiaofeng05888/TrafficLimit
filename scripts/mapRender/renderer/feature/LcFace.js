/**
 * Created by linglong on 2016/7/25.
 */
FM.mapApi.render.renderer.LcFace = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
      // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var color = '#ff0000';
        var symbols = [];
        if (this._feature.properties.kind >= 1 && this._feature.properties.kind <= 6) {
            color = '#8fefd5';
        } else if (this._feature.properties.kind >= 11 && this._feature.properties.kind <= 17) {
            color = '#50B450';
        }
        var symbolData = {
            type: 'SimpleFillSymbol',
            color: color,
            opacity: 1
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        symbols.push(symbol);
        if (this._feature.properties.hasName === 1) {
            color = '#58ff59';
            var symbolData1 = {
                type: 'PatternFillSymbol',
                patternPath: 'M0 0, L10 10, L20 0, Z',
                patternWidth: 10,
                patternHeight: 10,
                patternLineWidth: 1,
                patternLineDash: [],
                patternColor: color,
                opacity: 1,
                outLine: this._feature.simpleLineSymbol
            };
            var symbol1 = this._symbolFactory.createSymbol(symbolData1);
            symbol1.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
            symbols.push(symbol1);
        }
        return symbols;
    },
    getHighlightSymbol: function () {
        var symbolData = {
            type: 'SimpleFillSymbol',
            color: '#00ffff',
            opacity: 1
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    }
});
