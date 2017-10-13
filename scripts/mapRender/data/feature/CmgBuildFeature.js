/**
 * 市街图feature的前端数据模型
 * @class FM.mapApi.render.data.CmgBuildFeature
 * @author MaLi
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.CmgBuildFeature = FM.mapApi.render.data.Feature.extend({
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author MaLi
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    setAttribute: function (data) {
        this.properties.geoLiveType = 'CMGBUILDING';
        this.geometry = this.getGeometry(data);
        this.properties.faces = [];
        for (var i = 0; i < data.m.a.length; i++) {
            this.properties.faces.push({
                facePid: data.m.a[i].i

            });
        }
    },

    /**
     * 获取数据模型的几何对象
     * @method getGeometry
     * @author MaLi
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {object} 几何对象
     */
    getGeometry: function (data) {
        var geometry = {
            type: 'MultiPolygon',
            coordinates: []
        };
        for (var i = 0; i < data.m.a.length; i++) {
            geometry.coordinates.push(data.m.a[i].g);
        }
        return geometry;
    }
});
