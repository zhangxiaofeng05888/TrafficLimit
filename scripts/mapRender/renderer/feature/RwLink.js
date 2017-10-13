FM.mapApi.render.renderer.RwLink = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);

        // 绑定函数作用域
        FM.Util.bind(this);
    },

    getSymbol: function () {
        var color = 'black';
        if (this._feature.properties.color) {
            color = '#' + this._feature.properties.color;
        }
        var symbolData = {
            type: 'CompositeLineSymbol',
            symbols: [
                {
                    type: 'SimpleLineSymbol',
                    color: color,
                    width: 3,
                    style: 'solid'
                },
                {
                    type: 'SimpleLineSymbol',
                    color: 'white',
                    width: 2,
                    style: 'solid'
                },
                {
                    type: 'CartoLineSymbol',
                    color: color,
                    width: 2,
                    pattern: [10, 10]
                }
            ]
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    },

    getHighlightSymbol: function () {
        var color = '#00FFFF';
        if (this._feature.properties.color) {
            color = '#' + this._feature.properties.color;
        }
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

