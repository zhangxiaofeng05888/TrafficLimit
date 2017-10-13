FM.mapApi.render.renderer.ZoneLink = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var kind = this._feature.properties.kind;
        var color = '#FF8000';

        if (kind === 1) {
            color = '#ff3399';
        } else if (kind === 2) {
            color = '#58cf30';
        }

        var symbolData = {
            type: 'SimpleLineSymbol',
            color: color,
            width: kind > 0 ? 2 : 3,
            opacity: 1,
            style: 'solid'
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    },
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
