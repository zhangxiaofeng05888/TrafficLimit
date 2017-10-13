/**
 * 铁路线的前端数据模型
 * @class FM.mapApi.render.data.RwLink
 * @author LiuZhe
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.RwLink = FM.mapApi.render.data.Feature.extend({
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author LiuZhe
     * @date   2017-09-12
     * @param  {object} item 接口返回的数据
     * @return {undefined}
     */
    setAttribute: function (item) {
        this.properties.geoLiveType = 'RWLINK';
        this.geometry.type = 'LineString';
        this.properties.name = item.m.a;
        this.properties.color = item.m.b;
        this.properties.snode = item.m.c;
        this.properties.enode = item.m.d;
        this.addSymbol();
        this.addHighlightSymbol();
    },

    /**
     * 添加模型的符号
     * @method addSymbol
     * @author LiuZhe
     * @date   2017-09-12
     * @return {undefined}
     */
    addSymbol: function () {
        var color = 'black';
        if (this.properties.color) {
            color = '#' + this.properties.color;
        }
        var symbolData = {
            type: 'CompositeLineSymbol',
            symbols: [
                {
                    type: 'SimpleLineSymbol',
                    color: color,
                    width: 3,
                    style: 'solid'
                },
                {
                    type: 'SimpleLineSymbol',
                    color: 'white',
                    width: 2,
                    style: 'solid'
                },
                {
                    type: 'CartoLineSymbol',
                    color: color,
                    width: 2,
                    pattern: [10, 10]
                }
            ]
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
        var color = '#00FFFF';
        if (this.properties.color) {
            color = '#' + this.properties.color;
        }
        var symbolData = {
            type: 'SimpleLineSymbol',
            color: '#00ffff',
            width: 3
        };
        var symbol = this.symbolFactory.createSymbol(symbolData);
        symbol.geometry = this.geometryFactory.fromGeojson(this.geometry);
        this.properties.highlightSymbol = symbol;
    }
});
