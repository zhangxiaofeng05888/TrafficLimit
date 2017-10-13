/**
 * 电子眼的前端数据模型
 * @class FM.mapApi.render.data.RdElectronicEye
 * @author LiuZhe
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.RdElectronicEye = FM.mapApi.render.data.Feature.extend({
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author LiuZhe
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    setAttribute: function (data) {
        this.geometry.type = 'Point';
        this.properties.direct = data.m.a;
        this.properties.angle = data.m.b;
        this.properties.geoLiveType = 'RDELECTRONICEYE';
    }
});
