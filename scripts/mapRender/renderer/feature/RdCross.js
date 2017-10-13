FM.mapApi.render.renderer.RdCross = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);

        // 绑定函数作用域
        FM.Util.bind(this);

        this._symbol = null;
    },

    getSymbol: function () {
        var nodes = this._feature.properties.nodes;

        var symbols = [];
        for (var i = 0; i < nodes.length; ++i) {
            var node = nodes[i];
            var isMain = node.isMain;
            var url = '../../images/road/rdcross/111.png';
            if (isMain === 1) {
                // 1表示的是主点
                url = '../../images/road/rdcross/11.png';
            }
            var symbolData = {
                type: 'ImageMarkerSymbol',
                url: url,
                width: 10,
                height: 10,
                style: 'solid'
            };
            var symbol = this._symbolFactory.createSymbol(symbolData);
            symbol.geometry = this._geometryFactory.createPoint(this._feature.geometry.coordinates[i]);
            symbols.push(symbol);
        }

        return symbols;
    },

    getHighlightSymbol: function () {
        var nodes = this._feature.properties.nodes;
        var symbols = [];
        for (var i = 0; i < nodes.length; ++i) {
            var node = nodes[i];
            var isMain = node.b;
            var color = 'blue';
            if (isMain === 1) {
                // 1表示的是主点
                color = 'red';
            }
            var symbolData = {
                type: 'CircleMarkerSymbol',
                color: color,
                radius: 3
            };
            var symbol = this._symbolFactory.createSymbol(symbolData);
            symbol.geometry = this._geometryFactory.createPoint(this._feature.geometry.coordinates[i]);
            symbols.push(symbol);
        }

        return symbols;
    }
});

