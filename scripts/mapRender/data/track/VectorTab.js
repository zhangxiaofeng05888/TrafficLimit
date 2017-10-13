/**
 * 矢量化tab的前端数据模型
 * @class FM.mapApi.render.data.VectorTab
 * @author ZhongXiaoMing
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.VectorTab = FM.mapApi.render.data.Feature.extend({
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author ZhongXiaoMing
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    setAttribute: function (data) {
        this.geometry.type = 'LineString';
        this.properties.geoLiveType = 'VECTORTAB';
        this.properties.name = data.m.a;
        this.properties.multi = data.m.d;
        this.properties.kind = data.m.b;
        this.properties.direct = data.m.e;
        this.properties.form = data.m.f;
        this.properties.width = data.m.c;
        this.properties.fieldSource = data.m.i;
    }
});
