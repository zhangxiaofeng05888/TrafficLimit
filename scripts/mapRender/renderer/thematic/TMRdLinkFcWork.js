/**
 * Created by zhaohang on 2017/2/15.
 */
FM.mapApi.render.renderer.TMRdLinkFcWork = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var compositeSymbol = this._symbolFactory.createSymbol({ type: 'CompositeLineSymbol' });
        compositeSymbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        compositeSymbol.symbols.push(this._addNormalSymbol());
        if (this._feature.properties.limit && this._feature.properties.limit.indexOf('4') !== -1) {
            compositeSymbol.symbols.push(this._addLimit4Symbol());  // 施工中道路
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
    _addNormalSymbol: function () {
        var rdLinkColor = {
            0: '#000000',
            1: '#FF0000',
            2: '#00A000',
            3: '#FFC000',
            4: '#0000FF',
            5: '#909090' };
        var color = rdLinkColor[this._feature.properties.indexNumFC];
        var symbolData = {
            type: 'SimpleLineSymbol',
            color: color,
            width: 1
        };
        return this._symbolFactory.createSymbol(symbolData);
    },
    _addLimit4Symbol: function () {
        var symbolData = {
            type: 'MarkerLineSymbol',
            marker: {
                type: 'TiltedCrossMarkerSymbol',
                size: 6,
                color: 'red'
            },
            pattern: [2, 10]
        };
        return this._symbolFactory.createSymbol(symbolData);
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
    _addNameSymbol: function () {
        if (this._feature.zoom <= 14) {
            return null;
        }

        if (this._feature.properties.name || this._feature.properties.kind || this._feature.properties.totalDriveway) {
            var text = '';
            if (this._feature.properties.name) {
                text = this._feature.properties.name;
            }
            if (this._feature.properties.kind) {
                if (text.length > 0) {
                    text = text + '/K' + this._feature.properties.kind;
                } else {
                    text = 'K' + this._feature.properties.kind;
                }
            }
            if (this._feature.properties.totalDriveway) {
                if (text.length > 0) {
                    text = text + '/W' + this._feature.properties.totalDriveway;
                } else {
                    text = 'W' + this._feature.properties.totalDriveway;
                }
            }
        }
        var symbolData = {
            type: 'TextLineSymbol',
            text: text,
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
