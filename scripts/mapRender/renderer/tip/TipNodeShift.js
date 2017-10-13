FM.mapApi.render.renderer.TipNodeShift = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },

    getSymbol: function () {
        var symbols = [];
        //  原位置线
        var lineData = {
            type: 'CartoLineSymbol',
            color: '#FF0000',
            width: 1,
            opacity: 0.7,
            pattern: [4, 4]
        };
        var linesSymbol = this._symbolFactory.createSymbol(lineData);
        linesSymbol.geometry = this._geometryFactory.createLineString(this._feature.geometry.geometries[1].coordinates[0]);

        var originCompositeSymbol = this._symbolFactory.createSymbol({ type: 'CompositeLineSymbol' });
        originCompositeSymbol.geometry = this._geometryFactory.fromGeojson({ type: 'LineString', coordinates: this._feature.geometry.geometries[1].coordinates[0] });
        originCompositeSymbol.symbols.push(linesSymbol);

        var originArrowData = {
            type: 'CenterMarkerLineSymbol',
            direction: 's2e',
            marker: {
                type: 'TriangleMarkerSymbol',
                width: 4,
                height: 4,
                sunken: 2,
                outLine: {
                    color: '#FF0000',
                    width: 1
                }
            }
        };
        var originArrowMarkerSymbol = this._symbolFactory.createSymbol(originArrowData);
        originCompositeSymbol.symbols.push(originArrowMarkerSymbol);
        symbols.push(originCompositeSymbol);

        //  新位置线
        var compositeSymbol = this._symbolFactory.createSymbol({ type: 'CompositeLineSymbol' });
        compositeSymbol.geometry = this._geometryFactory.fromGeojson({ type: 'LineString', coordinates: this._feature.geometry.geometries[1].coordinates[1] });

        var lineData2 = {
            type: 'CartoLineSymbol',
            color: '#595959',
            width: 1,
            opacity: 0.7,
            pattern: [4, 4]
        };
        var linesSymbol2 = this._symbolFactory.createSymbol(lineData2);
        compositeSymbol.symbols.push(linesSymbol2);

        var arrowData = {
            type: 'CenterMarkerLineSymbol',
            direction: 's2e',
            marker: {
                type: 'TriangleMarkerSymbol',
                width: 4,
                height: 4,
                sunken: 2,
                outLine: {
                    color: '#595959',
                    width: 1
                }
            }
        };
        var arrowMarkerSymbol = this._symbolFactory.createSymbol(arrowData);
        compositeSymbol.symbols.push(arrowMarkerSymbol);
        symbols.push(compositeSymbol);

        var testSymbol = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/tips/1709/1709_0_0.svg',
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
            symbols: compositeSymbols,
            angle: this._feature.properties.angle
        };
        var symbol = this._symbolFactory.createSymbol(symbolData);
        symbol.geometry = this._geometryFactory.createPoint(this._feature.geometry.geometries[0].coordinates);
        symbols.push(symbol);
        return symbols;
    },
    getHighlightSymbol: function () {
        var symbols = [];
        for (var j = 0; j < this._feature.geometry.geometries[1].coordinates.length; ++j) {
            var lineData = {
                type: 'SimpleLineSymbol',
                color: '#00ffff',
                width: 2
            };
            var linesSymbol = this._symbolFactory.createSymbol(lineData);
            linesSymbol.geometry = this._geometryFactory.createLineString(this._feature.geometry.geometries[1].coordinates[j]);
            symbols.push(linesSymbol);
        }
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
        return symbols;
    }
});
