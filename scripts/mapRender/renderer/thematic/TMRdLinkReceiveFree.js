/**
 * Created by zhaohang on 2017/2/15.
 */
FM.mapApi.render.renderer.TMRdLinkReceiveFree = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var compositeSymbol = this._symbolFactory.createSymbol({ type: 'CompositeLineSymbol' });
        compositeSymbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        compositeSymbol.symbols.push(this._addNormalSymbol());
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
            0: '#909090',
            1: '#FF0000',
            2: '#909090',
            3: '#3075FF'
        };
        var color = rdLinkColor[this._feature.properties.indexNumFree];
        var symbolData = {
            type: 'SimpleLineSymbol',
            color: color,
            width: 1
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

        if (this._feature.properties.name || this._feature.properties.form) {
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
            if (this._feature.properties.form && this._feature.properties.form.indexOf('10') !== -1) {
                if (text.length > 0) {
                    text += '/IC';
                } else {
                    text = 'IC';
                }
            }
            if (this._feature.properties.form && this._feature.properties.form.indexOf('11') !== -1) {
                if (text.length > 0) {
                    text += '/JCT';
                } else {
                    text = 'JCT';
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
        return (this._symbolFactory.createSymbol(symbolData));
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
