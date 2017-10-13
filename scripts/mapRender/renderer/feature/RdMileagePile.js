/**
 * Created by zhaohang on 2017/3/14.
 */
FM.mapApi.render.renderer.RdMileagePile = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);

        // 绑定函数作用域
        FM.Util.bind(this);

        this._symbol = null;
    },

    getSymbol: function () {
        var angle = this._feature.properties.angle;
        var text = this._feature.properties.text;

        var symbolData1 = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/mileagePile/mileagePile.svg',
            width: 18,
            height: 18
        };
        var symbolData2 = {
            type: 'TextMarkerSymbol',
            text: text + ' KM',
            font: '微软雅黑',
            size: 12,
            offsetY: 20
        };
        var json = {
            type: 'CompositeMarkerSymbol',
            angle: angle,
            symbols: [symbolData1, symbolData2]
        };
        var symbol = this._symbolFactory.createSymbol(json);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);

        return symbol;
    },

    getHighlightSymbol: function (feature, zoom) {
        var symbolData = {
            type: 'SquareMarkerSymbol',
            size: 28,
            outLine: {
                width: 3,
                color: '#45c8f2'
            },
            color: 'transparent'
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);

        return symbol;
    }
});

