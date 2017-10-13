FM.mapApi.render.renderer.RdGsc = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var symbols = [];
        for (var i = 0; i < this._feature.properties.lines.length; ++i) {
            var line = this._feature.properties.lines[i];
            var color = '';
            if (line.z == 0) {
                color = '#14B7FC';
            } else if (line.z == 1) {
                color = '#4FFFB6';
            } else if (line.z == 2) {
                color = '#F8B19C';
            } else if (line.z == 3) {
                color = '#FCD6A4';
            }
            var symbolData = {
                type: 'SimpleLineSymbol',
                color: color,
                width: 8,
                opacity: 1,
                cap: 'round'
            };

            var symbol = this._symbolFactory.createSymbol(symbolData);
            symbol.geometry = this._geometryFactory.createLineString(line.g);
            symbols.push(symbol);
        }
        return symbols;
    },
    getHighlightSymbol: function () {
        var symbols = [];
        for (var i = 0; i < this._feature.properties.lines.length; ++i) {
            var line = this._feature.properties.lines[i];
            var symbolData = {
                type: 'SimpleLineSymbol',
                color: 'blue',
                width: 10,
                cap: 'round'
            };
            var symbol = this._symbolFactory.createSymbol(symbolData);
            symbol.geometry = this._geometryFactory.createLineString(line.g);
            symbols.push(symbol);
        }
        return symbols;
    }
});
