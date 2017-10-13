/**
 * 管理平台数据规划的 IXPOI 的前端数据模型
 * @class FM.mapApi.render.data.DataPlanIXPOI
 * @author ZhaoHang
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.DataPlanIXPOI = FM.mapApi.render.data.DataPlan.extend({
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author ZhaoHang
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    setAttribute: function (data) {
        this.geometry.type = 'Point';
        this.properties.geoLiveType = 'IXPOI';
        this.properties.isWork = data.m.isPlanSelected;
        this.properties.isImportant = data.m.isImportant;
    }
});
