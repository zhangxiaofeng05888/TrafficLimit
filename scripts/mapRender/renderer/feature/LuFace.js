/**
 * Created by mali on 2016/7/25.
 */
FM.mapApi.render.renderer.LuFace = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
     // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var symbolData = {
            type: 'SimpleFillSymbol',
            color: '#CD853F',
            // hasOutLine: true,
            opacity: 0.2
            // outLine: {
            //     type: 'SimpleLineSymbol',
            //     color: '#CD853F',
            //     width: 1,
            //     opacity: 1,
            //     style: 'solid'
            // }
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    },
    getHighlightSymbol: function () {
        var symbolData = {
            type: 'SimpleFillSymbol',
            color: '#5C4033',
            // hasOutLine: true,
            opacity: 0.5
            // outLine: {
            //     type: 'SimpleLineSymbol',
            //     color: '#CD853F',
            //     width: 1,
            //     opacity: 1,
            //     style: 'solid'
            // }
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    }
});
