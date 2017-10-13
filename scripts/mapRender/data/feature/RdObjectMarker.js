/**
 * CRF对象的前端数据模型
 * @class FM.mapApi.render.data.RdObjectMarker
 * @author LiuYang
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.RdObjectMarker = FM.mapApi.render.data.Feature.extend({
    geometry: {},
    properties: {},
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author LiuYang
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @param  {string} id 接口返回的数据
     * @return {undefined}
     */
    setAttribute: function (data, id) {
        this.geometry.coordinates = data;
        this.geometry.type = 'Point';
        this.properties.geoLiveType = 'RDOBJECT';
        this.properties.id = parseInt(id, 10);
    }
});
