FM.mapApi.render.renderer.TipPavementCover = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var compositeSymbols = [];
        // for (var j = 0; j < data.m.i.diff_array.length; j++) {
        //    if (data.m.i.diff_array[j].opt === 1) {
        //        var deleteLinkData = {
        //            type: 'SimpleLineSymbol',
        //            color: 'red',
        //            width: 2
        //        };
        //        var deleteSymbol = this.symbolFactory.createSymbol(deleteLinkData);
        //        deleteSymbol.geometry = this.geometryFactory.createLineString(data.m.i.diff_array[j].geometry.coordinates);
        //        compositeSymbols.push(deleteSymbol);
        //    }
        //    if (data.m.i.diff_array[j].opt === 2) {
        //        var updateLinkData = {
        //            type: 'SimpleLineSymbol',
        //            color: 'blue',
        //            width: 2
        //        };
        //        var updateSymbol = this.symbolFactory.createSymbol(updateLinkData);
        //        updateSymbol.geometry = this.geometryFactory.createLineString(data.m.i.diff_array[j].geometry.coordinates);
        //        compositeSymbols.push(updateSymbol);
        //    }
        //    if (data.m.i.diff_array[j].opt === 3) {
        //        var addLinkData = {
        //            type: 'SimpleLineSymbol',
        //            color: 'green',
        //            width: 2
        //        };
        //        var addSymbol = this.symbolFactory.createSymbol(addLinkData);
        //        addSymbol.geometry = this.geometryFactory.createLineString(data.m.i.diff_array[j].geometry.coordinates);
        //        compositeSymbols.push(addSymbol);
        //    }
        // }
        var lineData = {
            type: 'SimpleLineSymbol',
            color: '#FF0000',
            width: 2
        };
        var symbol = this._symbolFactory.createSymbol(lineData);
        symbol.geometry = this._geometryFactory.createLineString(this._feature.geometry.geometries[2].coordinates);
        // compositeSymbols.push(symbol);
        for (var i = 0; i < 2; i++) {
            var testSymbol = {
                type: 'ImageMarkerSymbol',
                url: '../../images/road/tips/1502/1502_1_0.svg',
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
            var compositeSymbols1 = [borderSymbol, testSymbol, blurSymbol];
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
            imgSymbol.geometry = this._geometryFactory.createPoint(i === 0 ? this._feature.geometry.geometries[0].coordinates : this._feature.geometry.geometries[1].coordinates);
            compositeSymbols.push(imgSymbol);
        }
        return compositeSymbols;
    },
    getHighlightSymbol: function () {
        var compositeSymbols = [];

        for (var j = 0; j < this._feature.geometry.geometries[2].coordinates.length; ++j) {
            var lineData = {
                type: 'SimpleLineSymbol',
                color: '#00ffff',
                width: 2
            };
            var linesSymbol = this._symbolFactory.createSymbol(lineData);
            linesSymbol.geometry = this._geometryFactory.createLineString(this._feature.geometry.geometries[2].coordinates[j]);
            compositeSymbols.push(linesSymbol);
        }

        for (var i = 0; i < 2; i++) {
            var symbolData = {
                type: 'CircleMarkerSymbol',
                radius: 9,
                color: 'transparent',
                outLine: {
                    width: 3,
                    color: '#00ffff'
                }
            };
            var imgSymbol = this._symbolFactory.createSymbol(symbolData);
            imgSymbol.geometry = this._geometryFactory.createPoint(i === 0 ? this._feature.geometry.geometries[0].coordinates : this._feature.geometry.geometries[1].coordinates);
            compositeSymbols.push(imgSymbol);
        }
        return compositeSymbols;
    }
});
