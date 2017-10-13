/**
 * 条件线限速的前端数据模型
 * @class FM.mapApi.render.data.RdLinkSpeedLimitDependent
 * @author ZhaoHang
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.RdLinkSpeedLimitDependent = FM.mapApi.render.data.Feature.extend({
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author ZhaoHang
     * @date   2017-09-12
     * @param  {string} linkPid 唯一标识
     * @param  {array} geo 接口返回的数据
     * @param  {number} rotate 角度
     * @param  {string} direct 方向
     * @param  {object} speedData 接口返回的数据
     * @return {undefined}
     */
    setAttribute: function (linkPid, geo, rotate, direct, speedData) {
        this.properties.geoLiveType = 'RDLINKSPEEDLIMIT_DEPENDENT';
        this.geometry.type = 'Point';
        this.geometry.coordinates = geo;
        this.properties.linkPid = linkPid;
        this.properties.id = linkPid + '-' + direct;
        this.properties.direct = direct;
        this.properties.rotate = rotate;
        this.properties.speedData = speedData;
    }
});
