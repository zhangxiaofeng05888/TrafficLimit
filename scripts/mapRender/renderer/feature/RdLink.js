FM.mapApi.render.renderer.RdLink = FM.mapApi.render.Renderer.extend({
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

        if (this._feature.properties.form && this._feature.properties.form.indexOf('36') !== -1) {
            this._addNormalSymbol();
            this._addForm36Symbol(); // POI连接路
        } else if (this._feature.properties.form && this._feature.properties.form.indexOf('20') !== -1) {
            this._addForm20Symbol(); // 步行街
            this._addNormalSymbol();
        } else if (this._feature.properties.limit && this._feature.properties.limit.indexOf('4') !== -1) {
            this._addLimit4Symbol(); // 施工中道路
            this._addNormalSymbol();
        } else if (this._feature.properties.limit && this._feature.properties.limit.indexOf('0') !== -1) {
            this._addLimit0Symbol(); // 维修
            this._addNormalSymbol();
        } else if (this._feature.properties.form && this._feature.properties.form.indexOf('15') !== -1) {
            this._addForm15Symbol(); // 匝道
        } else if (this._feature.properties.form && this._feature.properties.form.indexOf('31') !== -1) {
            this._addForm31Symbol(); // 隧道
        } else if (this._feature.properties.form && this._feature.properties.form.indexOf('30') !== -1) {
            this._addForm30Symbol(); // 桥
            this._addNormalSymbol();
        } else if (this._feature.properties.form && this._feature.properties.form.indexOf('52') !== -1) {
            this._addForm52Symbol(); // 区域内道路
        } else {
            this._addNormalSymbol();
        }
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
    },

    _addForm36Symbol: function () {
        if (this._zoom <= 14) {
            return;
        }
        var symbolData = {
            type: 'TextLineSymbol',
            text: 'POI',
            offset: 20,
            marker: {
                type: 'TextMarkerSymbol',
                font: '微软雅黑',
                size: 14,
                color: 'black'
            }
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        this._symbol.symbols.push(symbol);
    },

    _addForm30Symbol: function () {
        var symbolData = {
            type: 'HashLineSymbol',
            hashHeight: 6,
            hashLine: {
                type: 'SimpleLineSymbol',
                color: this._color,
                width: this._width,
                opacity: this._opacity,
                style: 'solid'
            },
            pattern: [2, 5]
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        this._symbol.symbols.push(symbol);
    },

    _addForm31Symbol: function () {
        var symbolData = {
            type: 'CartoLineSymbol',
            color: this._color,
            width: this._width,
            opacity: this._opacity,
            pattern: [4, 4]
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        this._symbol.symbols.push(symbol);
    },

    _addLimit4Symbol: function () {
        var symbolData = {
            type: 'MarkerLineSymbol',
            marker: {
                type: 'TiltedCrossMarkerSymbol',
                size: 6,
                color: 'red',
                width: this._width,
                opacity: this._opacity
            },
            pattern: [10, 10]
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        this._symbol.symbols.push(symbol);
    },

    _addForm20Symbol: function () {
        var symbolData = {
            type: 'MarkerLineSymbol',
            startOffset: 10,
            offset: -20,
            marker: {
                type: 'CircleMarkerSymbol',
                radius: 2,
                color: '#009ef9',
                offsetY: 2,
                outLine: {
                    width: this._width,
                    color: '#009ef9'
                }
            },
            pattern: [20, 20]
        };
        var symbolData1 = {
            type: 'MarkerLineSymbol',
            startOffset: 10,
            offset: -20,
            marker: {
                type: 'CircleMarkerSymbol',
                radius: 2,
                color: '#009ef9',
                offsetY: 2,
                outLine: {
                    width: this._width,
                    color: '#009ef9'
                }
            },
            pattern: [20, 20]
        };
        var json = {
            type: 'CompositeLineSymbol',
            symbols: [symbolData, symbolData1]
        };
        var symbol = this._symbolFactory.createSymbol(json);
        this._symbol.symbols.push(symbol);
    },

    _addLimit0Symbol: function () {
        var symbolData = {
            type: 'MarkerLineSymbol',
            marker: {
                type: 'TiltedCrossMarkerSymbol',
                size: 6,
                color: '#666666',
                opacity: this._opacity
            },
            pattern: [10, 10]
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        this._symbol.symbols.push(symbol);
    },

    _addForm15Symbol: function () {
        var symbolData = {
            type: 'CartoLineSymbol',
            color: this._color,
            width: this._width,
            opacity: this._opacity,
            pattern: [4, 4, 12, 4]
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        this._symbol.symbols.push(symbol);
    },

    _addForm52Symbol: function () {
        var symbolData = {
            type: 'CartoLineSymbol',
            color: this._color,
            width: this._width,
            opacity: this._opacity,
            pattern: [4, 4, 12, 4]
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        this._symbol.symbols.push(symbol);
    }
});
