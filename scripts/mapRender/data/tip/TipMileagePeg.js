/**
 * 里程桩 的前端数据模型
 * @class FM.mapApi.render.data.TipMileagePeg
 * @author LiuZhe
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.TipMileagePeg = FM.mapApi.render.data.Tip.extend({
    geometry: {},
    properties: {},
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author LiuZhe
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    setAttribute: function (data) {
        this.geometry.coordinates = data.g;
        this.properties.geoLiveType = 'TIPMILEAGEPEG';
        this.properties.path = parseInt(data.m.b, 10);

        this.properties.txt = data.m.c;
        this.properties.accessorySymbol = parseInt(data.m.k, 10);
        this.properties.timeSymbol = parseInt(data.m.l, 10);
        this.properties.outLineSymbol = parseInt(data.m.n, 10);
    }
});

