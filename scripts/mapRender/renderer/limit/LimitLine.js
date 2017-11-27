/**
 * 限行线
 * @author zhaohang
 * @date   2017/11/15
 * @class  FM.mapApi.render.renderer.GeometryPolygon
 * @return {undefined}
 */
FM.mapApi.render.renderer.LimitLine = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);

        // 绑定函数作用域
        FM.Util.bind(this);
    },
    /**
     * 渲染几何
     * @method getSymbol
     * @author Niuxinyi
     * @date   2017-11-20
     * @return {object} symbol 几何
     */
    getSymbol: function () {
        var symbolData = {
            type: 'SimpleLineSymbol',
            color: 'yellow',
            width: 3
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    },
    /**
     * 高亮几何
     * @method getHighlightSymbol
     * @author Niuxinyi
     * @date   2017-11-20
     * @return {object} symbol 几何
     */
    getHighlightSymbol: function () {
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
