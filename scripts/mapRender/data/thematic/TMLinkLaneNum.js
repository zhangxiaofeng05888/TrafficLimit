/**
 * 车道数（总数）的前端数据模型
 * @class FM.mapApi.render.data.TMLinkLaneNum
 * @author ZhaoHang
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.TMLinkLaneNum = FM.mapApi.render.data.Thematic.extend({
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author ZhaoHang
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    setAttribute: function (data) {
        this.properties.indexNum = parseInt(data.m.a, 10);
        this.geometry.type = 'LineString';
        this.properties.geoLiveType = 'RDLINK';
        this.properties.kind = data.m.a;
        this.properties.direct = data.m.d;
        this.properties.fc = data.m.i;
    }
});
