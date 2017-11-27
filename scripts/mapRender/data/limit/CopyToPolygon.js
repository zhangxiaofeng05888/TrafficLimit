/**
 * Created by zhaohang on 2017/10/17.
 */
/**
 * 复制到面
 * @class FM.mapApi.render.data.CopyToPolygon
 * @author LiuZhe
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.CopyToPolygon = FM.mapApi.render.data.Limit.extend({
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
        this.properties.geoLiveType = 'COPYTOPOLYGON';
        this.properties.groupId = data.m.b;
        this.properties.boundaryLink = data.m.c;
    }
});
