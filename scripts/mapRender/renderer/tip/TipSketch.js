FM.mapApi.render.renderer.TipSketch = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var compositeSymbols = [];
        var geoms = this._feature.geometry.geometries;
        var symbol,
            symbolConf,
            symbolGeom;
        for (var i = 1; i < geoms.length; i++) {
            if (geoms[i].type === 'Point') {
                symbolConf = {
                    type: 'CircleMarkerSymbol',
                    radius: 2,
                    color: '#E36C0A',
                    opacity: 1
                };
                symbolGeom = this._geometryFactory.createPoint(geoms[i].coordinates);
            } else if (geoms[i].type === 'LineString') {
                symbolConf = {
                    type: 'SimpleLineSymbol',
                    color: '#E36C0A',
                    width: 1
                };
                symbolGeom = this._geometryFactory.createLineString(geoms[i].coordinates);
            } else if (geoms[i].type === 'Polygon') {
                symbolConf = {
                    type: 'SimpleFillSymbol',
                    opacity: 0,
                    outLine: {
                        type: 'SimpleLineSymbol',
                        style: 'solid',
                        color: '#E36C0A',
                        width: 1
                    }
                };
                symbolGeom = this._geometryFactory.createPolygon(geoms[i].coordinates);
            }
            symbol = this._symbolFactory.createSymbol(symbolConf);
            symbol.geometry = symbolGeom;
            compositeSymbols.push(symbol);
        }
        var waringSymbol = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/tips/1806/1806_0_0.svg',
            width: 18,
            height: 18
        };
        var borderSymbol = {
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

        var timeSymbol = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/tips/icon/icon_time.svg',
            width: 6,
            height: 6,
            offsetX: -11
        };
        var outLineSymbol = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/tips/icon/icon_outline.svg',
            width: 6,
            height: 6,
            offsetX: 11
        };
        var accessorySymbol = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/tips/icon/icon_attachment.svg',
            width: 6,
            height: 6,
            offsetY: 11
        };
        var compositeSymbols1 = [borderSymbol, waringSymbol, blurSymbol];
        if (this._feature.properties.accessorySymbol === 1) {
            compositeSymbols1.push(accessorySymbol);
        }
        if (this._feature.properties.timeSymbol === 1) {
            compositeSymbols1.push(timeSymbol);
        }
        if (this._feature.properties.outLineSymbol === 1) {
            compositeSymbols1.push(outLineSymbol);
        }
        var symbolData = {
            type: 'CompositeMarkerSymbol',
            symbols: compositeSymbols1
        };
        var imgSymbol = this._symbolFactory.createSymbol(symbolData);
        imgSymbol.geometry = this._geometryFactory.createPoint(this._feature.geometry.geometries[0].coordinates);
        compositeSymbols.push(imgSymbol);

        return compositeSymbols;
    },
    getHighlightSymbol: function () {
        var markArray = [];
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
        markArray.push(symbol);

        var geoms = this._feature.geometry.geometries;
        var symbolConf,
            symbolGeom;
        for (var i = 1; i < geoms.length; i++) {
            if (geoms[i].type === 'Point') {
                symbolConf = {
                    type: 'CircleMarkerSymbol',
                    radius: 2,
                    color: '#00ffff',
                    opacity: 1
                };
                symbolGeom = this._geometryFactory.createPoint(geoms[i].coordinates);
            } else if (geoms[i].type === 'LineString') {
                symbolConf = {
                    type: 'SimpleLineSymbol',
                    color: '#00ffff',
                    width: 2
                };
                symbolGeom = this._geometryFactory.createLineString(geoms[i].coordinates);
            } else if (geoms[i].type === 'Polygon') {
                symbolConf = {
                    type: 'SimpleFillSymbol',
                    opacity: 0,
                    outLine: {
                        type: 'SimpleLineSymbol',
                        style: 'solid',
                        color: '#00ffff',
                        width: 2
                    }
                };
                symbolGeom = this._geometryFactory.createPolygon(geoms[i].coordinates);
            }
            symbol = this._symbolFactory.createSymbol(symbolConf);
            symbol.geometry = symbolGeom;
            markArray.push(symbol);
        }

        return markArray;
    }
});
