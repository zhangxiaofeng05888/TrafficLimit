/**
 * IXPOI的前端数据模型
 * @class FM.mapApi.render.data.IXPOI
 * @author LiuZhe
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.IXPOI = FM.mapApi.render.data.Feature.extend({
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
        this.properties.geoLiveType = 'IXPOI';
        this.properties.status = data.m.b;
        this.properties.guideX = data.m.c;
        this.properties.guideY = data.m.f;
        this.properties.guideLink = data.m.l;
        this.properties.kindCode = data.m.d;
        this.properties.poiNum = data.m.n;
        this.properties.name = data.m.e;
        this.properties.indoor = data.m.g;
    }
});
