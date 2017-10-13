FM.mapApi.render.renderer.ZoneFace = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var color = '';
        if (Number(this._feature.properties.id).toString(16).length > 6) {
            color = Number(this._feature.properties.id).toString(16).substring(Number(this._feature.properties.id).toString(16).length - 4);
        } else {
            color = Number(this._feature.properties.id).toString(16);
        }
        var symbolData = {
            type: 'SimpleFillSymbol',
            color: '#' + color + '00',
            // hasOutLine: true,
            opacity: 0.2
            // outLine: {
            //     type: 'SimpleLineSymbol',
            //     color: '#FF5151',
            //     width: 1,
            //     opacity: 1,
            //     style: 'solid'
            // }
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    },
    getHighlightSymbol: function () {
        var symbolData = {
            type: 'SimpleFillSymbol',
            color: '#00ffff',
            // hasOutLine: true,
            opacity: 0.5
            // outLine: {
            //     type: 'SimpleLineSymbol',
            //     color: '#FF5151',
            //     width: 1,
            //     opacity: 1,
            //     style: 'solid'
            // }
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    }
});
