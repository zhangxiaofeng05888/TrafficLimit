FM.mapApi.render.renderer.TipOrientation = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var waringUrl = '../../images/road/tips/1401/1401_0_0.svg';
        var waringSymbol = {
            type: 'ImageMarkerSymbol',
            url: waringUrl,
            width: 22,
            height: 22,
            style: 'solid',
            angle: this._feature.properties.angle,
            offsetX: 0,
            offsetY: 0,
            outLine: {
                width: 1,
                color: this._feature.properties.color == '0' ? this._feature.redFill.lineColor : this._feature.blueFill.lineColor
            }
        };
        
        var patternCodeSymbolData = {
            type: 'TextMarkerSymbol',
            text: this._feature.properties.txt,
            offsetY: -26
        };
        var patternCodeSymbol = this._symbolFactory.createSymbol(patternCodeSymbolData);
        patternCodeSymbol.geometry = this._geometryFactory.createPoint(this._feature.geometry.coordinates);

        var symbol = this._symbolFactory.createSymbol(waringSymbol);
        symbol.geometry = this._geometryFactory.createPoint(this._feature.geometry.coordinates);
        var guideLinkData = {
            type: 'CartoLineSymbol',
            color: '#4343FF',
            width: 1,
            pattern: [4, 2]
        };
        var guideSymbol = this._symbolFactory.createSymbol(guideLinkData);
        guideSymbol.geometry = this._geometryFactory.fromGeojson(this._feature.guideLink);
        return [guideSymbol, patternCodeSymbol, symbol];
    },
    getHighlightSymbol: function () {
        var waringUrl = '../../images/road/tips/1401/1401_0_0.svg';
        var waringSymbol = {
            type: 'ImageMarkerSymbol',
            url: waringUrl,
            width: 22,
            height: 22,
            style: 'solid',
            angle: this._feature.properties.angle,
            offsetX: 0,
            offsetY: 0,
            outLine: {
                width: 1,
                color: '#00ffff'
            }
        };
        var symbol = this._symbolFactory.createSymbol(waringSymbol);
        symbol.geometry = this._geometryFactory.createPoint(this._feature.geometry.coordinates);

        return symbol;
    }
});
