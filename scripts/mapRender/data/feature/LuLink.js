/**
 * 土地利用线的前端数据模型
 * @class FM.mapApi.render.data.LuLink
 * @author MaLi
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.LuLink = FM.mapApi.render.data.Feature.extend({
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author MaLi
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    setAttribute: function (data) {
        this.properties.geoLiveType = 'LULINK';
        this.geometry.type = 'LineString';
        this.properties.snode = data.m.a;
        this.properties.enode = data.m.b;
        this.properties.kind = data.m.c;
    }
});
