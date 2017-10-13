FM.mapApi.render.renderer.RdTollgate = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var type = {
            0: '未调查',
            1: '领卡',
            2: '交卡付费',
            3: '固定收费(次费)',
            4: '交卡付费后再领卡',
            5: '交卡付费并代收固定费用',
            6: '验票(无票收费)值先保留',
            7: '领卡并代收固定费用',
            8: '持卡打标识不收费',
            9: '验票领卡',
            10: '交卡不收费'
        };
        var imageSrc = '../../images/road/rdTollgate/0.svg';
        var symbolData = {
            type: 'ImageMarkerSymbol',
            url: imageSrc,
            width: 30,
            height: 30
        };
        var symbolData1 = {
            type: 'TextMarkerSymbol',
            text: type[this._feature.properties.kind],
            font: '微软雅黑',
            color: 'blue',
            size: 12,
            offsetX: 6 * type[this._feature.properties.kind].length + 20
        };
        var json = {
            type: 'CompositeMarkerSymbol',
            symbols: [symbolData, symbolData1]
        };
        var symbol = this._symbolFactory.createSymbol(json);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    },
    getHighlightSymbol: function () {
        var symbolData = {
            type: 'SquareMarkerSymbol',
            color: 'transparent',
            size: 30,
            outLine: {
                width: 1,
                color: 'blue'
            }
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    }
});
