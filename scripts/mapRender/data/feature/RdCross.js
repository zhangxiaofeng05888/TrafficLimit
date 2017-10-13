/**
 * 路口的前端数据模型
 * @class FM.mapApi.render.data.RdCross
 * @author LiuZhe
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.RdCross = FM.mapApi.render.data.Feature.extend({
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author LiuZhe
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    setAttribute: function (data) {
        this.geometry = this.getGeometry(data);
        this.properties.geoLiveType = 'RDCROSS';
        this.properties.nodes = [];
        for (var i = 0; i < data.m.a.length; i++) {
            this.properties.nodes.push({
                nodePid: data.m.a[i].i,
                isMain: data.m.a[i].b
            });
        }
    },

    /**
     * 获取数据模型的几何对象
     * @method getGeometry
     * @author LiuZhe
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {object} 几何对象
     */
    getGeometry: function (data) {
        var geometry = {
            type: 'MultiPoint',
            coordinates: []
        };
        for (var i = 0; i < data.m.a.length; i++) {
            geometry.coordinates.push(data.m.a[i].g);
        }
        return geometry;
    }
});
