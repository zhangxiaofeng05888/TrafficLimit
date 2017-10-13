/**
 * Created by zhaohang on 2017/2/16.
 */
FM.mapApi.render.renderer.TMRdLinkSpeedRank = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var compositeSymbol = this._symbolFactory.createSymbol({ type: 'CompositeLineSymbol' });
        compositeSymbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        if (this._feature.properties.form && this._feature.properties.form.indexOf('52') !== -1) {
            compositeSymbol.symbols.push(this._addForm52Symbol()); // 区域内道路
        } else {
            compositeSymbol.symbols.push(this._addNormalSymbol());
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
            0: '#C0C0C0',
            1: '#808000',
            2: '#FF0000',
            3: '#00A000',
            4: '#FFC000',
            5: '#0000FF',
            6: '#FF50A8',
            7: '#3291F5',
            8: '#000000',
            99: 'red' };
        var color = rdLinkColor[this._feature.properties.indexNumRank];
        var symbolData = {
            type: 'SimpleLineSymbol',
            color: color,
            width: 1
        };
        return this._symbolFactory.createSymbol(symbolData);
    },
    _addForm52Symbol: function () {
        var rdLinkColor = {
            0: '#C0C0C0',
            1: '#808000',
            2: '#FF0000',
            3: '#00A000',
            4: '#FFC000',
            5: '#0000FF',
            6: '#FF50A8',
            7: '#3291F5',
            8: '#000000',
            99: 'red' };
        var color = rdLinkColor[this._feature.properties.indexNumRank];
        var symbolData = {
            type: 'CartoLineSymbol',
            color: color,
            width: 1,
            pattern: [4, 4, 12, 4]
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

        if (this._feature.properties.name || this._feature.properties.kind || this._feature.properties.fc) {
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
            if (this._feature.properties.fc) {
                if (text.length > 0) {
                    text = text + '/FC' + this._feature.properties.fc;
                } else {
                    text = 'FC' + this._feature.properties.fc;
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
