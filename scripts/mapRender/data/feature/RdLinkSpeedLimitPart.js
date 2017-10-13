/**
 * 普通线限速的前端数据模型
 * @class FM.mapApi.render.data.RdLinkSpeedLimitPart
 * @author LiuZhe
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.RdLinkSpeedLimitPart = FM.mapApi.render.data.Feature.extend({
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author LiuZhe
     * @date   2017-09-12
     * @param  {string} linkPid 唯一标识
     * @param  {array} geo 接口返回的数据
     * @param  {number} rotate 角度
     * @param  {string} direct 方向
     * @param  {object} speedData 接口返回的数据
     * @return {undefined}
     */
    setAttribute: function (linkPid, geo, rotate, direct, speedData) {
        this.geometry.type = 'Point';
        this.properties.geoLiveType = 'RDLINKSPEEDLIMIT';
        this.geometry.coordinates = geo;
        this.properties.linkPid = linkPid;
        this.properties.id = linkPid + '-' + direct + '-0-0';   //  普通线限速，限速类型为0
        this.properties.direct = direct;
        this.properties.condition = 0;
        var speedValue = speedData[0];// 限速值
        var limitSrc = parseInt(speedData[1], 10);// 限速来源
        this.properties.speedValue = parseInt(speedValue, 10) / 10;
        if (direct == 2) {
            this.properties.fromLimitSrc = limitSrc;
        } else if (direct == 3) {
            this.properties.toLimitSrc = limitSrc;
        }
        this.properties.rotate = rotate;
    }
});
