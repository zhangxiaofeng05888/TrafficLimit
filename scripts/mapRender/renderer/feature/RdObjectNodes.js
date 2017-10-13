/**
 * Created by liuyang on 2016/8/24.
 */
FM.mapApi.render.renderer.RdObjectNodes = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var symbolData1 = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/crf/13.png',
            width: 10,
            height: 10
        };
        var symbolData2 = {
            type: 'CircleMarkerSymbol',
            radius: 1,
            color: 'blue',
            opacity: 1
        };
        var json = {
            type: 'CompositeMarkerSymbol',
            symbols: [symbolData1, symbolData2]
        };
        var symbol = this._symbolFactory.createSymbol(json);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    },
    getHighlightSymbol: function () {
        var symbolData = {
            type: 'SquareMarkerSymbol',
            color: 'transparent',
            size: 30,
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
