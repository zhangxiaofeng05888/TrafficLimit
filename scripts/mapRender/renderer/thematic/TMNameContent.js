/**
 * Created by zhaohang on 2016/11/23.
 */
// 道路名内容
FM.mapApi.render.renderer.TMNameContent = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },

    getSymbol: function () {
        var compositeSymbol = this._symbolFactory.createSymbol({ type: 'CompositeLineSymbol' });
        compositeSymbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        compositeSymbol.symbols.push(this._addNormalSymbol());

        var addForm30Symbol = this._addForm30Symbol();
        if (addForm30Symbol) {
            compositeSymbol.symbols.push(addForm30Symbol);
        }

        var addLimit4Symbol = this._addLimit4Symbol();
        if (addLimit4Symbol) {
            compositeSymbol.symbols.push(addLimit4Symbol);
        }
        var addForm52Symbol = this._addForm52Symbol();
        if (addForm52Symbol) {
            compositeSymbol.symbols.push(addForm52Symbol);
        }

        var addArrow = this._addArrowMarkerSymbol();
        if (addArrow) {
            compositeSymbol.symbols.push(addArrow);
        }

        var addName = this._addNameSymbol();
        if (addName) {
            compositeSymbol.symbols.push(addName);
        }
        return compositeSymbol;
    },

    _addArrowMarkerSymbol: function () {
        if (this._feature.zoom <= 14) {
            return null;
        }

        if (this._feature.properties.direct !== 2 && this._feature.properties.direct !== 3) {
            return null;
        }

        var direction = 's2e';
        if (this._feature.properties.direct === 3) {
            direction = 'e2s';
        }
        var symbolData = {
            type: 'CenterMarkerLineSymbol',
            direction: direction,
            marker: {
                type: 'TriangleMarkerSymbol',
                color: 'red',
                width: 6,
                height: 7,
                sunken: 6,
                outLine: {
                    color: 'red',
                    width: 2
                }
            }
        };
        return this._symbolFactory.createSymbol(symbolData);
    },

    _addNormalSymbol: function () {
        var rdLinkColors = ['#646464', '#FFAAFF', '#E5C8FF', '#FF6364', '#FFC000', '#0E7892',
            '#63DC13', '#C89665', '#C8C864', '#000000', '#00C0FF', '#DCBEBE',
            '#000000', '#7364C8', '#000000', '#DCBEBE'];
        var color = rdLinkColors[this._feature.properties.indexNum];
        var symbolData = {
            type: 'SimpleLineSymbol',
            color: color,
            width: 1,
            opacity: 1,
            style: 'solid'
        };
        return this._symbolFactory.createSymbol(symbolData);
    },

    _addNameSymbol: function () {
        if (this._feature.zoom <= 14) {
            return null;
        }

        if (!this._feature.properties.name) {
            return null;
        }
        var nameData = this._feature.properties.name;
        var test = nameData.replace(/\\/g, ' + ');
        var symbolData = {
            type: 'TextLineSymbol',
            text: test,
            gap: 300,
            marker: {
                type: 'TextMarkerSymbol',
                font: '微软雅黑',
                size: 10,
                color: 'black'
            }
        };
        return this._symbolFactory.createSymbol(symbolData);
    },

    _addForm30Symbol: function () {
        if (!this._feature.properties.form || this._feature.properties.form.indexOf('30') === -1) {
            return null;
        }
        var rdLinkColors = ['#646464', '#FFAAFF', '#E5C8FF', '#FF6364', '#FFC000', '#0E7892',
            '#63DC13', '#C89665', '#C8C864', '#000000', '#00C0FF', '#DCBEBE',
            '#000000', '#7364C8', '#000000', '#DCBEBE'];
        var color = rdLinkColors[this._feature.properties.indexNum];

        var symbolData = {
            type: 'HashLineSymbol',
            hashHeight: 6,
            hashLine: {
                type: 'SimpleLineSymbol',
                color: color,
                opacity: 1,
                width: 1,
                style: 'solid'
            },
            pattern: [2, 5]
        };
        return this._symbolFactory.createSymbol(symbolData);
    },

    _addLimit4Symbol: function () {
        if (!this._feature.properties.limit || this._feature.properties.limit.indexOf('4') === -1) {
            return null;
        }

        var symbolData = {
            type: 'MarkerLineSymbol',
            marker: {
                type: 'TiltedCrossMarkerSymbol',
                size: 6,
                color: 'red',
                opacity: 1
            },
            pattern: [2, 10]
        };
        return this._symbolFactory.createSymbol(symbolData);
    },

    _addForm52Symbol: function () {
        if (!this._feature.properties.form || this._feature.properties.form.indexOf('52') === -1) {
            return null;
        }

        var symbolData = {
            type: 'CompositeLineSymbol',
            symbols: [{
                type: 'SimpleLineSymbol',
                color: 'gray',
                width: 1,
                opacity: 1,
                style: 'solid'
            }, {
                type: 'CartoLineSymbol',
                color: 'blue',
                width: 1,
                opacity: 1,
                pattern: [4, 4, 12, 4]
            }]
        };
        return this._symbolFactory.createSymbol(symbolData);
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
    }
});
