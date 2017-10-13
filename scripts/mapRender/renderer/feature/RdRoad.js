FM.mapApi.render.renderer.RdRoad = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var symbols = [];
        if (this._feature.properties.links.length > 0) {
            for (var i = 0; i < this._feature.geometry.geometries[0].coordinates.length; ++i) {
                var symbolData = {
                    type: 'SimpleLineSymbol',
                    color: '#A3D1D1',
                    width: 6,
                    opacity: 0.5,
                    style: 'solid'
                };
                var symbol = this._symbolFactory.createSymbol(symbolData);
                symbol.geometry = this._geometryFactory.createLineString(this._feature.geometry.geometries[0].coordinates[i]);
                symbols.push(symbol);
            }
        }
        return symbols;
    },
    getHighlightSymbol: function () {
        var symbols = [];
        if (this._feature.properties.links.length > 0) {
            for (var i = 0; i < this._feature.geometry.geometries[0].coordinates.length; ++i) {
                var symbolData = {
                    type: 'SimpleLineSymbol',
                    color: '#00ffff',
                    width: 6,
                    opacity: 1,
                    style: 'solid'
                };
                var symbol = this._symbolFactory.createSymbol(symbolData);
                symbol.geometry = this._geometryFactory.createLineString(this._feature.geometry.geometries[0].coordinates[i]);
                symbols.push(symbol);
            }
        }
        return symbols;
    }
});
