/**
 * CRF道路的前端数据模型
 * @class FM.mapApi.render.data.RdRoadLinks
 * @author LiuZhe
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.RdRoadLinks = FM.mapApi.render.data.Feature.extend({
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author LiuZhe
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @param  {string} id 唯一标示
     * @return {undefined}
     */
    setAttribute: function (data, id) {
        this.geometry.type = 'LineString';
        this.geometry.coordinates = data.g;
        this.properties.geoLiveType = 'RDROAD';
        this.properties.linkId = parseInt(data.i, 10);
        this.properties.id = parseInt(id, 10);
    }
});
