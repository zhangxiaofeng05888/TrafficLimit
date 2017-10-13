/**
 * Created by wangtun on 2017/6/22.
 */
FM.mapApi.render.renderer.RdLinkAnnotation = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);

        // 绑定函数作用域
        FM.Util.bind(this);
        this._color = null;
        this._width = null;
        this._opacity = null;
        this._symbol = null;
    },

    getSymbol: function () {
        this._color = '#000';
        this._width = 1;
        this._opacity = 1;

        var direction = 's2e';
        if (this._feature.properties.direct === 3) {
            direction = 'e2s';
        }
        var symbolData = {
            type: 'CenterTextLineSymbol',
            direction: direction,
            alwaysisVerticalToLine: true,
            times: 1,
            text: this._feature.properties.LaneNum.toString(),
            marker: {
                type: 'TextMarkerSymbol',
                font: '微软雅黑',
                size: 15,
                color: '#0000FF'
            }
        };
        this._symbol = this._symbolFactory.createSymbol(symbolData);
        this._symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);

        return this._symbol;
    },

    getHighlightSymbol: function () {
        return null;
    }
});
