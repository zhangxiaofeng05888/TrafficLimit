/**
 * Created by zhaohang on 2017/7/5.
 */
FM.mapApi.render.renderer.DataPlanIxPoi = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);

        // 绑定函数作用域
        FM.Util.bind(this);
    },

    getSymbol: function () {
        var nodeSymbol = {
            type: 'CircleMarkerSymbol',
            radius: 3,
            color: '#999999'
        };
        if (this._feature.properties.isWork === 1) {
            if (this._feature.properties.isImportant === 0) {
                nodeSymbol.color = '#009eff';
            } else if (this._feature.properties.isImportant === 1) {
                nodeSymbol.color = '#f75555';
            }
        }
        var symbol = this._symbolFactory.createSymbol(nodeSymbol);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    },

    getHighlightSymbol: function () {
        var symbolData = {
            type: 'CircleMarkerSymbol',
            radius: 5,
            color: '#00ffff'
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    }
});

