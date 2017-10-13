FM.mapApi.render.renderer.TipLaneChangePoint = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },

    getSymbol: function () {
        var symbols = [];
        var testSymbol = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/tips/1115/1115_0_0.svg',
            width: 18,
            height: 18
        };
        var borderSymbol = {// 圆圈圈
            type: 'ImageMarkerSymbol',
            url: '../../images/road/tips/icon/icon_' + this._feature.properties.path + '.svg',
            width: 22,
            height: 22
        };
        var blurColor = 'transparent';
        var blurOpacity = 0.5;
        if (this._feature.properties.status === 2) {
            blurColor = '#000000';
            blurOpacity = 0.2;
        }
        if (this._feature.properties.status === 1) {
            blurColor = '#ffffff';
        }
        var blurSymbol = {
            type: 'CircleMarkerSymbol',
            radius: 9,
            color: blurColor,
            opacity: blurOpacity
        };
        var compositeSymbols = [borderSymbol, testSymbol, blurSymbol];
        var symbolData = {
            type: 'CompositeMarkerSymbol',
            symbols: compositeSymbols,
            angle: this._feature.properties.angle
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.createPoint(this._feature.geometry.coordinates);
        symbols.push(symbol);
        //  开始文字效果
        var symbolData2 = {
            type: 'TextMarkerSymbol',
            text: this._feature.properties.inNum + ', ' + this._feature.properties.outNum,
            offsetY: -26
        };
        var symbol2 = this._symbolFactory.createSymbol(symbolData2);
        symbol2.geometry = this._geometryFactory.createPoint(this._feature.geometry.coordinates);
        symbols.push(symbol2);
        var guideLinkData = {
            type: 'CartoLineSymbol',
            color: '#4343FF',
            width: 1,
            pattern: [4, 2]
        };
        var guideSymbol = this._symbolFactory.createSymbol(guideLinkData);
        guideSymbol.geometry = this._geometryFactory.fromGeojson(this._feature.guideLink);
        symbols.unshift(guideSymbol);
        return symbols;
    },

    getHighlightSymbol: function () {
        var symbolData = {
            type: 'CircleMarkerSymbol',
            radius: 9,
            color: 'transparent',
            outLine: {
                width: 3,
                color: '#00ffff'
            }
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.createPoint(this._feature.geometry.coordinates);
        return symbol;
    }
});
