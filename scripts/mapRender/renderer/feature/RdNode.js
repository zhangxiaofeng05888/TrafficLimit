FM.mapApi.render.renderer.RdNode = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },

    getSymbol: function () {
        var symbolData = {
            type: 'CircleMarkerSymbol',
            radius: 2,
            color: '#9c8c89',
            opacity: 1
        };
        var symbolData2 = {
            type: 'CircleMarkerSymbol',
            radius: 2,
            color: 'red',
            opacity: 1
        };
        var symbol;
        if (this._feature.properties.forms.split(';').indexOf('3') > -1) {
            symbol = this._symbolFactory.createSymbol(symbolData2);
        } else {
            symbol = this._symbolFactory.createSymbol(symbolData);
        }
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    },

    getHighlightSymbol: function () {
        var symbolData = {
            type: 'CircleMarkerSymbol',
            radius: 3,
            color: 'blue'
        };
        var symbolData2 = {
            type: 'CircleMarkerSymbol',
            radius: 3,
            color: 'red'
        };
        var symbol;
        if (this._feature.properties.forms.split(';').indexOf('3') > -1) {
            symbol = this._symbolFactory.createSymbol(symbolData2);
        } else {
            symbol = this._symbolFactory.createSymbol(symbolData);
        }
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    }
});

