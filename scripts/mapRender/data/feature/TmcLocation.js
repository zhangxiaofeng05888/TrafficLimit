/**
 * TMCLocation的前端数据模型
 * @class FM.mapApi.render.data.TmcLocation
 * @author LiuZhe
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.TmcLocation = FM.mapApi.render.data.Feature.extend({
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author LiuZhe
     * @date   2017-09-12
     * @param  {object} item 接口返回的数据
     * @return {undefined}
     */
    setAttribute: function (item) {
        var locDirectObj = {
            0: '0',
            1: '+',
            2: '-',
            3: 'P',
            4: 'N'
        };
        var directObj = {
            1: 'T',
            2: 'F'
        };
        this.properties.geoLiveType = 'RDTMCLOCATION';
        this.geometry.type = 'LineString';
        this.properties.markerStyle = {};
        this.properties.markerStyle.icon = [];
        this.geometry.coordinates = item.g;
        this.properties.id = item.i;
        this.properties.forwardtext = item.m.b + locDirectObj[item.m.c] + item.m.d + directObj[item.m.e];
        this.properties.forwarddirect = parseInt(item.m.c, 10);
        this.properties.color = '#006600';
        this.addSymbol();
        /* this.properties.markerStyle.icon.push(
            FM.mapApi.render.data.getIconStyle({
                row: 0,
                column: 1,
                color: '#006600'
            })
        );*/
    },

    /**
     * 添加模型的符号
     * @method addSymbol
     * @author LiuZhe
     * @date   2017-09-12
     * @return {undefined}
     */
    addSymbol: function () {
        var position = 'e';
        if (this.properties.direct === 3) {
            position = 's';
        }

        var offset = 0;
        if (this.properties.forwarddirect) {
            if (this.properties.forwarddirect == 1) {
                offset = 10;
            } else {
                offset = -10;
            }
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
                    color: this.properties.color,
                    outLine: {
                        width: 1,
                        color: 'black'
                    }
                }
            }, {
                type: 'TextLineSymbol',
                text: this.properties.forwardtext,
                offset: offset,
                marker: {
                    type: 'TextMarkerSymbol',
                    font: '微软雅黑',
                    size: 10,
                    color: this.properties.color
                }
            }]
        };
        var symbol = this.symbolFactory.createSymbol(symbolData);
        symbol.geometry = this.geometryFactory.fromGeojson(this.geometry);
        this.properties.symbol = symbol;
    }
});
