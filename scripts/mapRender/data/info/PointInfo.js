/**
 * 点情报的前端数据模型
 * @class FM.mapApi.render.data.PointInfo
 * @author ZhongXiaoMing
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.PointInfo = FM.mapApi.render.data.Info.extend({
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author ZhongXiaoMing
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    setAttribute: function (data) {
        this.geometry.type = 'Point';
        this.properties.geoLiveType = 'PointInfo';
        this.properties.level = data.i_level;
        this.properties.id = data.globalId;
    }
});
