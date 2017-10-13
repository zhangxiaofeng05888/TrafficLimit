/**
 * Created by liuzhe on 2016/7/25.
 */
FM.mapApi.render.renderer.CmgBuildLink = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
     // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function (data) {
        var symbolData = {
            type: 'SimpleLineSymbol',
            color: '#800010',
            width: 2,
            opacity: 1,
            style: 'solid'
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    },
    getHighlightSymbol: function (data) {
        var symbolData = {
            type: 'SimpleLineSymbol',
            color: '#00ffff',
            width: 3
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    }
});
