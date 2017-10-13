/**
 * Created by linglong on 2016/8/11.
 */
FM.mapApi.render.renderer.LcLink = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var color = '#ff0000';
        var kind = this._feature.properties.kind;

        if (kind.indexOf(',') === -1) {
            kind = parseInt(kind, 10);
        } else {    //  种别可多个，多个的情况下，取最小的种别进行渲染
            var tmp = kind.split(',').sort(function (a, b) {
                return parseInt(a, 10) > parseInt(b, 10);
            });
            kind = parseInt(tmp[0], 10);
        }

        if (kind >= 1 && kind <= 7) {
            color = '#8fefd5';
        } else if (kind === 8) {
            color = '#6afd6c';
        } else if (kind >= 11 && kind <= 17) {
            color = '#50b450';
        } else if (kind === 18) {
            color = '#2cb3be';
        }

        var symbolData = {
            type: 'SimpleLineSymbol',
            color: color,
            width: 2,
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
            width: 2
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    }
});
