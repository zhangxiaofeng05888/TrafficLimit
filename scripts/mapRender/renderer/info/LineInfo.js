/**
 * Created by zhongxiaoming on 2017/4/12.
 */
FM.mapApi.render.renderer.LineInfo = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);

        // 绑定函数作用域
        FM.Util.bind(this);

        this._colors = ['black', '#FFAAFF', '#E5C8FF', '#FF6364', '#FFC000', '#0E7892',
            '#63DC13', '#C89665', '#C8C864', '#000000', '#00C0FF', '#DCBEBE',
            '#000000', '#7364C8', '#000000', '#DCBEBE'];
        this._color = null;
        this._width = null;
        this._opacity = null;
        this._symbol = null;
    },

    getSymbol: function () {
        this._color = this._colors[0];
        this._width = 3;
        this._opacity = 1;

        var compositeSymbol = this._symbolFactory.createSymbol({ type: 'CompositeLineSymbol' });
        compositeSymbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        this._symbol = compositeSymbol;
        this._addNormalSymbol();
        this._addNameSymbol();

        return this._symbol;
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
    },

    _addNormalSymbol: function () {
        var symbolData = {
            type: 'SimpleLineSymbol',
            color: this._color,
            width: this._width,
            opacity: this._opacity,
            style: 'solid'
        };

        var symbol = this._symbolFactory.createSymbol(symbolData);
        this._symbol.symbols.push(symbol);
    },

    _addNameSymbol: function () {
        if (this._zoom <= 14) {
            return;
        }

        if (!this._feature.properties.name) {
            return;
        }

        var symbolData = {
            type: 'TextLineSymbol',
            text: this._feature.properties.name,
            gap: 300,
            marker: {
                type: 'TextMarkerSymbol',
                font: '微软雅黑',
                size: 10,
                color: 'black'
            }
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        this._symbol.symbols.push(symbol);
    }
});
