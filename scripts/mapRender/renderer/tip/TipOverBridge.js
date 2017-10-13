FM.mapApi.render.renderer.TipOverBridge = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },

    getSymbol: function () {
        var symbols = [];
        var testSymbol = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/tips/2201/2201_0_0.svg',
            width: 18,
            height: 18
        };
        var borderSymbol = {// 圆圈圈
            type: 'ImageMarkerSymbol',
            url: '../../images/road/tips/icon/icon_' + this._feature.properties.path + '.svg',
            width: 22,
            height: 22
        };

        var blurSymbol = null;
        if (this._feature.properties.status === 0) {
            blurSymbol = {
                type: 'CircleMarkerSymbol',
                radius: 9,
                color: 'transparent',
                opacity: 0.5
            };
        } else {
            blurSymbol = {
                type: 'ImageMarkerSymbol',
                url: '../../images/road/tips/icon/status_' + this._feature.properties.status + '.svg',
                width: 11,
                height: 11,
                offsetX: 11,
                offsetY: -11
            };
        }

        var compositeSymbols = [borderSymbol, testSymbol, blurSymbol];
        var symbolData = {
            type: 'CompositeMarkerSymbol',
            symbols: compositeSymbols
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.createPoint(this._feature.geometry.geometries[0].coordinates);

        var lineData = {
            type: 'SimpleLineSymbol',
            color: '#81B9FC',
            width: 2
        };

        if (this._feature.properties.tp < 2) {
            lineData.style = 'dash';
        }

        var linesSymbol = this._symbolFactory.createSymbol(lineData);
        linesSymbol.geometry = this._geometryFactory.createLineString(this._feature.geometry.geometries[1].coordinates);
        symbols.push(linesSymbol);

        for (var i = 0; i < this._feature.geometry.geometries[2].coordinates.length; i++) {
            var pointSymbol = {
                type: 'CircleMarkerSymbol',
                radius: 2,
                color: '#FF7C48',
                outLine: {
                    width: 1,
                    color: '#FF7C48'
                }
            };
            var txtSymbol = {
                type: 'TextMarkerSymbol',
                text: this._feature.properties.txts[i],
                offsetY: -20
            };
            var compositeSymbols2 = [pointSymbol, txtSymbol];
            var symbolData2 = {
                type: 'CompositeMarkerSymbol',
                symbols: compositeSymbols2
            };

            var nodeSymbol = this._symbolFactory.createSymbol(symbolData2);
            nodeSymbol.geometry = this._geometryFactory.createPoint(this._feature.geometry.geometries[2].coordinates[i]);
            symbols.push(nodeSymbol);
        }

        symbols.push(symbol);   //  tip图标放在最后，否则点、线会压在图标上
        return symbols;
    },
    getHighlightSymbol: function () {
        var symbols = [];
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
        symbol.geometry = this._geometryFactory.createPoint(this._feature.geometry.geometries[0].coordinates);
        symbols.push(symbol);

        var lineData = {
            type: 'SimpleLineSymbol',
            color: '#00ffff',
            width: 2
        };

        if (this._feature.properties.tp < 2) {
            lineData.style = 'dash';
        }

        var linesSymbol = this._symbolFactory.createSymbol(lineData);
        linesSymbol.geometry = this._geometryFactory.createLineString(this._feature.geometry.geometries[1].coordinates);
        symbols.push(linesSymbol);

        return symbols;
    }
});
