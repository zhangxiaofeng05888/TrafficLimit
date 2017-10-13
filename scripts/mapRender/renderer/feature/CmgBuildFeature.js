/**
 * Created by mali on 2017/5/22.
 */
FM.mapApi.render.renderer.CmgBuildFeature = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
        this._symbol = null;
    },

    getSymbol: function () {
        var symbols = [];
        var symbolData = {
            type: 'SimpleFillSymbol',
            color: 'black',
            hasOutLine: true,
            opacity: 1,
            outLine: {
                type: 'SimpleLineSymbol',
                color: 'yellow',
                width: 1,
                opacity: 1,
                style: 'solid'
            }
        };

        for (var j = 0; j < this._feature.geometry.coordinates.length; j++) {
            var symbol = this._symbolFactory.createSymbol(symbolData);
            symbol.geometry = this._geometryFactory.createPolygon(this._feature.geometry.coordinates[j]);
            symbols.push(symbol);
        }


        return symbols;
    },

    getHighlightSymbol: function () {
        var symbols = [];
        var symbolData = {
            type: 'SimpleFillSymbol',
            color: 'yellow',
            hasOutLine: true,
            opacity: 1,
            outLine: {
                type: 'SimpleLineSymbol',
                color: 'black',
                width: 1,
                opacity: 1,
                style: 'solid'
            }
        };

        for (var j = 0; j < this._feature.geometry.coordinates.length; j++) {
            var symbol = this._symbolFactory.createSymbol(symbolData);
            symbol.geometry = this._geometryFactory.createPolygon(this._feature.geometry.coordinates[j]);
            symbols.push(symbol);
        }

        return symbols;
    }
});
