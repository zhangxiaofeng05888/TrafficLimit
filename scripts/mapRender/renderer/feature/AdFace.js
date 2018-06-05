FM.mapApi.render.renderer.AdFace = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var symbolData = {
            type: 'SimpleFillSymbol',
            color: '#ffe599',
            // hasOutLine: true,
            opacity: 0.2
            // outLine: {
            //     type: 'SimpleLineSymbol',
            //     color: '#93c47d',
            //     width: 3,
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
            color: '#ffff00',
            opacity: 0.5
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    }
});
