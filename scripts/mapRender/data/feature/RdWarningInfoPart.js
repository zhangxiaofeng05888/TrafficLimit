/**
 * 警示信息的前端数据模型
 * @class FM.mapApi.render.data.RdWarningInfoPart
 * @author LiuZhe
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.RdWarningInfoPart = FM.mapApi.render.data.Feature.extend({
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author LiuZhe
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @param  {number} index 索引
     * @return {undefined}
     */
    setAttribute: function (data, index) {
        this.geometry.type = 'Point';
        var angle = (data.m.info[index].angle) * Math.PI / 180;
        // 按照角度调整偏移坐标
        this.geometry.coordinates = [(30 * index + 15) * Math.cos(angle) + data.g[0], (30 * index + 15) * Math.sin(angle) + data.g[1]];
        this.properties.geoLiveType = 'RDLINKWARNING';
        this.properties.id = data.m.info[index].pid;
        this.properties.info = data.m.info[index];
        this.properties.angle = data.m.info[index].angle;
    }
});
