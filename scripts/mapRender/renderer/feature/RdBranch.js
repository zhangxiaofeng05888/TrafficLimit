FM.mapApi.render.renderer.RdBranch = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var url = '../../images/road/1407/' + this._feature.properties.branchType + '.svg';
        var symbolData = {
            type: 'ImageMarkerSymbol',
            url: url,
            width: 22,
            height: 22,
            angle: this._feature.properties.rotate
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    },
    getHighlightSymbol: function () {
        var url = '../../images/road/1407/' + this._feature.properties.branchType + '.svg';
        var symbolData = {
            type: 'ImageMarkerSymbol',
            url: url,
            width: 22,
            height: 22,
            angle: this._feature.properties.rotate,
            outLine: {
                width: 3,
                color: '#45c8f2'
            }
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    }
});
