FM.mapApi.render.renderer.TipAllNode = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var nodeSymbol = {
            type: 'CircleMarkerSymbol',
            radius: 3,
            color: '#999999',
            opacity: 0.5,
            outLine: {
                width: 1,
                opacity: 0.5,
                color: '#999999'
            }
        };
        var symbol = this._symbolFactory.createSymbol(nodeSymbol);
        var coordinates;
        var geom;
        if (this._feature.geometry.type === 'GeometryCollection') {
            geom = this._feature.geometry.geometries[0];
        } else {
            geom = this._feature.geometry;
        }
        if (geom.type === 'Point') {
            coordinates = geom.coordinates;
        } else if (geom.type === 'LineString' || geom.type === 'MultiPoint') {
            coordinates = geom.coordinates[0];
        } else if (geom.type === 'Polygon' || geom.type === 'MultiLine') {
            coordinates = geom.coordinates[0][0];
        }
        symbol.geometry = this._geometryFactory.createPoint(coordinates);
        return symbol;
    },

    getHighlightSymbol: function () {
        return null;
    }
});
