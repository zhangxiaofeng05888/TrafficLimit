/**
 * Created by zhaohang on 2016/11/14.
 */
// 车道数（总数）
FM.mapApi.render.renderer.TMLinkLaneNum = FM.mapApi.render.Renderer.extend({
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
            1: '#993399',
            2: '#C0C0C0',
            3: '#FFC000',
            4: '#64DC14',
            5: '#0000FF',
            6: '#FF6464',
            7: '#00FFFF',
            8: '#818001',
            9: '#7364C9',
            10: '#C93146' };
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
