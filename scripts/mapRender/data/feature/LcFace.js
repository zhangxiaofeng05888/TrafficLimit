/**
 * 土地覆盖面的前端数据模型
 * @class FM.mapApi.render.data.LcFace
 * @author LingLong
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.LcFace = FM.mapApi.render.data.Feature.extend({
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author LingLong
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    setAttribute: function (data) {
        this.properties.geoLiveType = 'LCFACE';
        this.properties.kind = data.m.a;
        this.properties.hasName = data.m.b;
        this.geometry.type = 'Polygon';
    }
});
