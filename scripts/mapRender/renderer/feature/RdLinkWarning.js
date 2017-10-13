FM.mapApi.render.renderer.RdLinkWarning = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },

    getSymbol: function () {
        var symbols = [];
        var imageSrc = '../../images/road/warningInfo/13701.svg'; // 默认危险信息
        if (this._feature.properties.typeCode) {
            imageSrc = '../../images/road/warningInfo/' + this._feature.properties.typeCode + '.svg';
        }
        var symbolData = {
            type: 'ImageMarkerSymbol',
            url: imageSrc,
            width: 40,
            height: 40
            // angle: this._feature.properties.angle
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);

        //  同点位警示信息，只绘制一次箭头，在序号为1时绘制
        if (this._feature.properties.sequenceNo === 1) {
            var arrowData = {
                type: 'ImageMarkerSymbol',
                url: '../../images/road/warningInfo/arrow.svg',
                width: 40,
                height: 40,
                angle: this._feature.properties.angle - 90
            };
            var arrowSymbol = this._symbolFactory.createSymbol(arrowData);
            arrowSymbol.geometry = this._geometryFactory.fromGeojson(this._feature.arrowGeometry);
            symbols.push(arrowSymbol);
        }

        symbols.push(symbol);
        return symbols;
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
