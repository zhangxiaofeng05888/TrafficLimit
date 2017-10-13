/**
 * 道路线的前端数据模型
 * @class FM.mapApi.render.data.RdLink
 * @author LiuZhe
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.RdLink = FM.mapApi.render.data.Feature.extend({
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author LiuZhe
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    setAttribute: function (data) {
        this.geometry.type = 'LineString';
        this.properties.geoLiveType = 'RDLINK';
        this.properties.kind = data.m.a;
        this.properties.name = data.m.b;
        this.properties.direct = data.m.d;
        this.properties.snode = data.m.e;
        this.properties.enode = data.m.f;
        this.properties.limit = data.m.c || '';
        this.properties.form = data.m.h;
        this.properties.fc = data.m.i;
        this.properties.length = data.m.k;
        this.properties.imiCode = data.m.j;
        this.properties.special = data.m.l;
        this.properties.LaneNum = data.m.m;
    }
});
