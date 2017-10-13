FM.mapApi.render.renderer.RdRtic = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var position = 'e'; // 双方向只显示上行 enode
        if (this._feature.properties.direct === 1) { // 双方向
            if (this._feature.properties.alongText) {
                if (this._feature.properties.alongText[this._feature.properties.alongText.length - 1] === '上') { // 顺方向 是最后一个点
                    position = 'e';
                }
            }
            if (this._feature.properties.reverseText) {
                if (this._feature.properties.reverseText[this._feature.properties.reverseText.length - 1] === '上') { // 逆方向 是第一个点
                    position = 's';
                }
            }
        } else if (this._feature.properties.direct === 3) { // 逆方向
            position = 's';
        } else if (this._feature.properties.direct === 2) {
            position = 'e';
        }
        var symbolData = {
            type: 'CompositeLineSymbol',
            symbols: [{
                type: 'EndMarkerLineSymbol',
                position: position,
                marker: {
                    type: 'TriangleMarkerSymbol',
                    width: 12,
                    height: 10,
                    color: this._feature.properties.color,
                    outLine: {
                        width: 1,
                        color: 'black'
                    }
                }
            }]
        };
        // 显示顺向信息
        if (this._feature.properties.alongText) {
            var textShow = {
                type: 'TextLineSymbol',
                text: null,
                offset: 0,
                marker: {
                    type: 'TextMarkerSymbol',
                    font: '微软雅黑',
                    size: 10,
                    color: this._feature.properties.alongColor
                }
            };
            textShow.text = this._feature.properties.alongText;
            if (this._feature.properties.direct === 2) {
                textShow.offset = 10;
            } else if (this._feature.properties.direct === 3) {
                textShow.offset = -10;
            } else {
                textShow.offset = -10;
                if (this._feature.properties.alongText[this._feature.properties.alongText.length - 1] === '上') { // 顺方向
                    textShow.offset = 10;
                }
            }
            symbolData.symbols.push(textShow);
        }

        // 显示逆向信息
        if (this._feature.properties.reverseText) {
            var reverseShow = {
                type: 'TextLineSymbol',
                text: null,
                offset: 0,
                marker: {
                    type: 'TextMarkerSymbol',
                    font: '微软雅黑',
                    size: 10,
                    color: this._feature.properties.reverseColor
                }
            };
            reverseShow.text = this._feature.properties.reverseText;
            if (this._feature.properties.direct === 2) {
                reverseShow.offset = 10;
            } else if (this._feature.properties.direct === 3) {
                reverseShow.offset = -10;
            } else {
                reverseShow.offset = -10;
                if (this._feature.properties.reverseText[this._feature.properties.reverseText.length - 1] === '上') { // 顺方向
                    reverseShow.offset = 10;
                }
            }
            symbolData.symbols.push(reverseShow);
        }

        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.fromGeojson(this._feature.geometry);
        return symbol;
    }
});
