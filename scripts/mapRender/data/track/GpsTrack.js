/**
 * gps轨迹的前端数据模型
 * @class FM.mapApi.render.data.GpsTrack
 * @author ZhongXiaoMing
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.GpsTrack = FM.mapApi.render.data.Feature.extend({
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
        this.properties.geoLiveType = 'AUGPSRECORD';
        this.properties.source = data.m.a;
        this.properties.name = data.m.b;
        this.properties.laneNum = data.m.d;
        this.properties.kind = data.m.e;
        this.properties.meshId = data.m.f;
        this.properties.tablename = data.m.c;
        this.properties.fieldSource = data.m.i;
    }
});
