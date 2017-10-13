FM.mapApi.render.renderer.RdLane = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var color = '#7D7DFF';
        var symbolData = {};
        if (this._feature.properties.kind == 'Y') { // 车道连通，实线渲染
            symbolData = {
                type: 'CompositeLineSymbol',
                symbols: [
                    {
                        type: 'SimpleLineSymbol',
                        color: color,
                        width: this._feature.properties.num * 2,
                        style: 'solid'
                    }
                ]
            };
        } else { // 详细车道，虚线渲染
            symbolData = {
                type: 'CompositeLineSymbol',
                symbols: [
                    {
                        type: 'SimpleLineSymbol',
                        color: color,
                        width: 4,
                        style: 'solid'
                    },
                    {
                        type: 'SimpleLineSymbol',
                        color: 'white',
                        width: 4,
                        style: 'solid'
                    },
                    {
                        type: 'CartoLineSymbol',
                        color: color,
                        width: 4,
                        pattern: [4, 4]
                    }
                ]
            };
        }
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    },
    getHighlightSymbol: function () {
        var symbolData = {
            type: 'SimpleLineSymbol',
            color: 'blue',
            width: 4
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    }
});
