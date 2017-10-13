/**
 * Created by liuyang on 2016/8/24.
 */
 FM.mapApi.render.renderer.RdObject = FM.mapApi.render.Renderer.extend({
     initialize: function (feature, zoom) {
         FM.mapApi.render.Renderer.prototype.initialize.call(this, feature, zoom);
        // 绑定函数作用域
         FM.Util.bind(this);
     },
     getSymbol: function () {
         var markerPoint = this._feature.geometry.geometries[0];
         var linksLineString = this._feature.geometry.geometries[1];
         var nodesPoint = this._feature.geometry.geometries[2];
         var outLineString = this._feature.geometry.geometries[3];
         var symbol;
         var symbols = [];
         var symbolData1;
         var symbolData2;
         var symbolData;
         var json;
         var j;
         symbolData1 = {
             type: 'ImageMarkerSymbol',
             url: '../../images/road/crf/12.png',
             width: 10,
             height: 10
         };
         symbolData2 = {
             type: 'CircleMarkerSymbol',
             radius: 1,
             color: 'red',
             opacity: 0.2
         };
         json = {
             type: 'CompositeMarkerSymbol',
             symbols: [symbolData1, symbolData2]
         };
         symbol = this._symbolFactory.createSymbol(json);
         symbol.geometry = this._geometryFactory.createPoint(markerPoint.coordinates);
         symbols.push(symbol);

         if (this._feature.properties.links.length > 0) {
             for (var i = 0; i < linksLineString.coordinates.length; ++i) {
                 symbolData = {
                     type: 'SimpleLineSymbol',
                     color: '#DAB1D5',
                     width: 2,
                     opacity: 0.5,
                     style: 'solid'
                 };
                 symbol = this._symbolFactory.createSymbol(symbolData);
                 symbol.geometry = this._geometryFactory.createLineString(linksLineString.coordinates[i]);
                 symbols.push(symbol);
             }
         }
         if (this._feature.properties.nodes.length > 0) {
             for (j = 0; j < nodesPoint.coordinates.length; ++j) {
                 symbolData1 = {
                     type: 'ImageMarkerSymbol',
                     url: '../../images/road/crf/13.png',
                     width: 10,
                     height: 10
                 };
                 symbolData2 = {
                     type: 'CircleMarkerSymbol',
                     radius: 1,
                     color: 'blue',
                     opacity: 1
                 };
                 json = {
                     type: 'CompositeMarkerSymbol',
                     symbols: [symbolData1, symbolData2]
                 };
                 symbol = this._symbolFactory.createSymbol(json);
                 symbol.geometry = this._geometryFactory.createPoint(nodesPoint.coordinates[j]);
                 symbols.push(symbol);
             }
         }
         if (outLineString.coordinates.length > 0) {
             symbolData = {
                 type: 'SimpleLineSymbol',
                 color: '#F9F900',
                 width: 3,
                 opacity: 1,
                 style: 'solid'
             };
             symbol = this._symbolFactory.createSymbol(symbolData);
             symbol.geometry = this._geometryFactory.createLineString(outLineString.coordinates);
             symbols.push(symbol);
         }
         return symbols;
     },
     getHighlightSymbol: function () {
         var markerPoint = this._feature.geometry.geometries[0];
         var linksLineString = this._feature.geometry.geometries[1];
         var nodesPoint = this._feature.geometry.geometries[2];
         var outLineString = this._feature.geometry.geometries[3];
         var symbol;
         var symbols = [];
         var symbolData;
         var j;
         symbolData = {
             type: 'SquareMarkerSymbol',
             color: 'transparent',
             size: 20,
             outLine: {
                 width: 3,
                 color: '#45c8f2'
             }
         };
         symbol = this._symbolFactory.createSymbol(symbolData);
         symbol.geometry = this._geometryFactory.createPoint(markerPoint.coordinates);
         symbols.push(symbol);
         if (this._feature.properties.links.length > 0) {
             for (var i = 0; i < linksLineString.coordinates.length; ++i) {
                 symbolData = {
                     type: 'SimpleLineSymbol',
                     color: '#00ffff',
                     width: 2
                 };
                 symbol = this._symbolFactory.createSymbol(symbolData);
                 symbol.geometry = this._geometryFactory.createLineString(linksLineString.coordinates[i]);
                 symbols.push(symbol);
             }
         }
         if (this._feature.properties.nodes.length > 0) {
             for (j = 0; j < nodesPoint.coordinates.length; ++j) {
                 var symbolData1 = {
                     type: 'ImageMarkerSymbol',
                     url: '../../images/road/crf/13.png',
                     width: 10,
                     height: 10
                 };
                 var symbolData2 = {
                     type: 'CircleMarkerSymbol',
                     radius: 1,
                     color: 'blue',
                     opacity: 1
                 };
                 var json = {
                     type: 'CompositeMarkerSymbol',
                     symbols: [symbolData1, symbolData2]
                 };
                 symbol = this._symbolFactory.createSymbol(json);
                 symbol.geometry = this._geometryFactory.createPoint(nodesPoint.coordinates[j]);
                 symbols.push(symbol);
             }
         }
         if (outLineString.coordinates.length > 0) {
             symbolData = {
                 type: 'SimpleLineSymbol',
                 color: 'blue',
                 width: 3
             };
             symbol = this._symbolFactory.createSymbol(symbolData);
             symbol.geometry = this._geometryFactory.createLineString(outLineString.coordinates);
             symbols.push(symbol);
         }
         return symbols;
     }
 });
