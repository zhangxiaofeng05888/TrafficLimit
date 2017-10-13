FM.mapApi.render.renderer.RdInter = FM.mapApi.render.Renderer.extend({
    initialize: function (feature, zoom) {
        FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
        FM.Util.bind(this);
    },
    getSymbol: function () {
        var multiPoint = this._feature.geometry.geometries[0];
        var multiLine = this._feature.geometry.geometries[1];
        var symbols = [];
        var symbol;

        if (this._feature.properties.links.length > 0) {
            for (var j = 0; j < multiLine.coordinates.length; ++j) {
                var symbolData = {
                    type: 'SimpleLineSymbol',
                    color: '#E1E100',
                    width: 2,
                    opacity: 1,
                    style: 'solid'
                };
                symbol = this._symbolFactory.createSymbol(symbolData);
                symbol.geometry = this._geometryFactory.createLineString(multiLine.coordinates[j]);
                symbols.push(symbol);
            }
        }

        for (var i = 0; i < multiPoint.coordinates.length; ++i) {
            var symbolData1 = {
                type: 'ImageMarkerSymbol',
                url: '../../images/road/crf/11.png',
                width: 10,
                height: 10
            };
            var symbolData2 = {
                type: 'CircleMarkerSymbol',
                radius: 3,
                color: 'green',
                opacity: 1
            };
            var symbolData3 = {
                type: 'CircleMarkerSymbol',
                radius: 3,
                color: 'red',
                opacity: 1
            };
            var json1 = {
                type: 'CompositeMarkerSymbol',
                symbols: [symbolData1, symbolData2]
            };
            var json2 = {
                type: 'CompositeMarkerSymbol',
                symbols: [symbolData1, symbolData3]
            };
            if (this._feature.properties.nodes[i].ifCrfi) {
                symbol = this._symbolFactory.createSymbol(json2);
            } else {
                symbol = this._symbolFactory.createSymbol(json1);
            }
            symbol.geometry = this._geometryFactory.createPoint(multiPoint.coordinates[i]);
            symbols.push(symbol);
        }

        return symbols;
    },
    getHighlightSymbol: function () {
        var multiPoint = this._feature.geometry.geometries[0];
        var multiLine = this._feature.geometry.geometries[1];
        var symbols = [];
        var symbol;

        if (this._feature.properties.links.length > 0) {
            for (var j = 0; j < multiLine.coordinates.length; ++j) {
                var symbolData = {
                    type: 'SimpleLineSymbol',
                    color: 'red',
                    width: 3
                };
                symbol = this._symbolFactory.createSymbol(symbolData);
                symbol.geometry = this._geometryFactory.createLineString(multiLine.coordinates[j]);
                symbols.push(symbol);
            }
        }

        for (var i = 0; i < multiPoint.coordinates.length; ++i) {
            var symbolData1 = {
                type: 'CircleMarkerSymbol',
                radius: 4,
                color: 'green',
                opacity: 1
            };
            var symbolData2 = {
                type: 'CircleMarkerSymbol',
                radius: 4,
                color: 'red',
                opacity: 1
            };
            if (this._feature.properties.nodes[i].ifCrfi) {
                symbol = this._symbolFactory.createSymbol(symbolData2);
            } else {
                symbol = this._symbolFactory.createSymbol(symbolData1);
            }
            symbol.geometry = this._geometryFactory.createPoint(multiPoint.coordinates[i]);
            symbols.push(symbol);
        }
        return symbols;
    }
});
