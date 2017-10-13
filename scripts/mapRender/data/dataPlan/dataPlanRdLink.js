/**
 * 管理平台数据规划的link的前端数据模型
 * @class FM.mapApi.render.data.DataPlanRdLink
 * @author ZhaoHang
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.DataPlanRdLink = FM.mapApi.render.data.DataPlan.extend({
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author ZhaoHang
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
        if (data.m.isPlanSelected === 0 || data.m.isPlanSelected === 1) {
            this.properties.isWork = data.m.isPlanSelected;
        }
        if (data.m.n === 0 || data.m.n === 1 || data.m.n === 2) {
            this.properties.theCar = data.m.n;
        }
    }
});
