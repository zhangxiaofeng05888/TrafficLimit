/**
 * Created by zhaohang on 2017/7/5.
 */
FM.mapApi.render.renderer.DataPlanRdLink = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);

        // 绑定函数作用域
        FM.Util.bind(this);

        this._colors = ['#646464', '#FFAAFF', '#E5C8FF', '#FF6364', '#FFC000', '#0E7892',
            '#63DC13', '#C89665', '#C8C864', '#000000', '#00C0FF', '#DCBEBE',
            '#000000', '#7364C8', '#000000', '#DCBEBE'];
        this._color = null;
        this._width = null;
        this._opacity = null;
        this._symbol = null;
    },

    getSymbol: function () {
        this._color = this._colors[parseInt(this._feature.properties.kind, 10)];
        this._width = 1;
        this._opacity = 1;

        var compositeSymbol = this._symbolFactory.createSymbol({ type: 'CompositeLineSymbol' });
        compositeSymbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        this._symbol = compositeSymbol;
        this._addNormalSymbol();
        this._addArrowMarkerSymbol();
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

    _addArrowMarkerSymbol: function () {
        if (this._zoom <= 14) {
            return;
        }

        if (this._feature.properties.direct !== 2 && this._feature.properties.direct !== 3) {
            return;
        }

        var times = 10;

        if (this._zoom == 17) {
            times = 5;
        } else if (this._zoom > 17) {
            times = 1;
        }

        var direction = 's2e';
        if (this._feature.properties.direct === 3) {
            direction = 'e2s';
        }
        var symbolData = {
            type: 'CenterMarkerLineSymbol',
            direction: direction,
            times: times,
            marker: {
                type: 'TriangleMarkerSymbol',
                color: 'red',
                width: 4,
                height: 4,
                sunken: 2,
                outLine: {
                    color: 'red',
                    width: 2
                }
            }
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        this._symbol.symbols.push(symbol);
    },

    _addNormalSymbol: function () {
        var symbolData = {
            type: 'SimpleLineSymbol',
            color: this._color,
            width: this._width,
            opacity: this._opacity,
            style: 'solid'
        };
        if (this._feature.properties.isWork === 0) {
            symbolData.color = '#999999';
        }
        if (this._feature.properties.theCar === 0 && App.Temp.carFlag) {
            symbolData.color = '#a5a5a5';
        }
        if (this._feature.properties.theCar === 1 && App.Temp.carFlag) {
            symbolData.color = '#18bf00';
        }
        if (this._feature.properties.theCar === 2 && App.Temp.carFlag) {
            symbolData.color = '#cb92ff';
        }
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

        // 道路名末尾包含街或者路的要用不同颜色
        var color = '#A6A3A0';

        if (this._feature.properties.name.substr(-1, 1) === '街') {
            color = '#BF4F4F';
        } else if (this._feature.properties.name.substr(-1, 1) === '路') {
            color = '#17A908';
        }

        var symbolData = {
            type: 'TextLineSymbol',
            text: this._feature.properties.name,
            gap: 300,
            marker: {
                type: 'TextMarkerSymbol',
                font: '微软雅黑',
                size: 10,
                color: color
            }
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        this._symbol.symbols.push(symbol);
    }
});
