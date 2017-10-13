/**
 * TmcPoint的前端数据模型
 * @class FM.mapApi.render.data.TmcPoint
 * @author LiuZhe
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.TmcPoint = FM.mapApi.render.data.Feature.extend({
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author LiuZhe
     * @date   2017-09-12
     * @param  {object} item 接口返回的数据
     * @return {undefined}
     */
    setAttribute: function (item) {
        this.properties.geoLiveType = 'TMCPOINT';
        this.properties.loctableId = item.m.d;
        this.properties.locoffPos = item.m.e;
        this.properties.locoffNeg = item.m.f;
        this.properties.name = item.m.b;
        this.geometry.type = 'Point';
        this.properties.markerStyle = {};
        this.properties.markerStyle.icon = [];
        this.geometry.coordinates = item.g;
        this.addHighlightSymbol();
        this.addSymbol(item);
    },

    /**
     * 添加模型的符号
     * @method addSymbol
     * @author LiuZhe
     * @date   2017-09-12
     * @param  {object} item 接口返回的数据
     * @return {undefined}
     */
    addSymbol: function (item) {
        var waringSymbol = {
            type: 'ImageMarkerSymbol',
            url: '../../images/road/tmc/tmc.png',
            width: 30,
            height: 30,
            outLine: {
                width: 1,
                color: 'red'
            }
        };
        var arrowSymbol = {
            type: 'TextMarkerSymbol',
            text: item.m.a + ' ' + item.m.b,
            offsetX: 20,
            offsetY: item.m.c ? item.m.c * 15 : 0,
            align: 'left'
        };
        var compositeSymbols = [waringSymbol, arrowSymbol];
        var symbolData = {
            type: 'CompositeMarkerSymbol',
            symbols: compositeSymbols
        };
        var symbol = this.symbolFactory.createSymbol(symbolData);
        symbol.geometry = this.geometryFactory.fromGeojson(this.geometry);
        this.properties.symbol = symbol;
    },

    /**
     * 添加模型的高亮符号
     * @method addHighlightSymbol
     * @author LiuZhe
     * @date   2017-09-12
     * @return {undefined}
     */
    addHighlightSymbol: function () {
        var symbolData = {
            type: 'SquareMarkerSymbol',
            color: 'transparent',
            size: 30,
            outLine: {
                width: 1,
                color: 'blue'
            }
        };
        var symbol = this.symbolFactory.createSymbol(symbolData);
        symbol.geometry = this.geometryFactory.fromGeojson(this.geometry);
        this.properties.highlightSymbol = symbol;
    }
});
