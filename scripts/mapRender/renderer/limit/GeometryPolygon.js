/**
 * Created by zhaohang on 2017/10/18.
 */
FM.mapApi.render.renderer.GeometryPolygon = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);

        // 绑定函数作用域
        FM.Util.bind(this);
    },

    getSymbol: function () {
        var symbolData = {
            type: 'SimpleFillSymbol',
            color: 'pink',
            opacity: 0.5,
            outLine: {
                type: 'SimpleLineSymbol',
                color: 'pink',
                width: 3,
                style: 'solid'
            }
        };
        if (this._feature.properties.boundaryLink === '2') {
            symbolData.outLine.type = 'CartoLineSymbol';
            symbolData.outLine.pattern = [10, 10];
        }
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    },

    getHighlightSymbol: function () {
        var symbolData = {
            type: 'SimpleFillSymbol',
            color: '#00ffff',
            opacity: 0.5
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    }
});
