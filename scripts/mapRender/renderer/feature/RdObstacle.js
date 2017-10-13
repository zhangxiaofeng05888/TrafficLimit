FM.mapApi.render.renderer.RdObstacle = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },

    getSymbol: function () {
        if (this._feature.properties.forms !== '15') {
            return null;
        }
        var imageSrc = '../../images/road/rdNode/rdObstacle.svg';
        var symbolData = {
            type: 'ImageMarkerSymbol',
            url: imageSrc,
            width: 20,
            height: 20
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    }
});

