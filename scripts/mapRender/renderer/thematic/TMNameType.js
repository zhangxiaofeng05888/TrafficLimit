/**
 * Created by zhaohang on 2016/11/23.
 */
// 名称类型
FM.mapApi.render.renderer.TMNameType = FM.mapApi.render.Renderer.extend({
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
        return compositeSymbol;
    },
    _addNormalSymbol: function () {
        var rdLinkColor = {
            0: '#008500',
            1: '#FF0000',
            2: '#FF0000',
            3: '#A500EC',
            4: '#0000FF',
            5: '#FA04C9',
            6: '#2FFFE3',
            7: '#0000FF',
            8: '#BEDE14',
            9: '#FF00FF',
            14: '#2FFFE3',
            15: '#000000',
            99: '#999999' };
        var color = rdLinkColor[this._feature.properties.indexNum];
        var symbolData = {
            type: 'SimpleLineSymbol',
            color: color,
            width: 1,
            opacity: 1,
            style: 'solid'
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
