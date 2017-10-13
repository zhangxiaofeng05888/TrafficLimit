/**
 * CRF道路的前端数据模型
 * @class FM.mapApi.render.data.RdRoad
 * @author LiuZhe
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.RdRoad = FM.mapApi.render.data.Feature.extend({
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author LiuZhe
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    setAttribute: function (data) {
        this.properties.geoLiveType = 'RDROAD';
        this.properties.id = parseInt(data.i, 10);
        this.properties.links = [];

        if (data.g) {
            for (var j = 0; j < data.g.length; j++) {
                this.properties.links.push({
                    linkId: parseInt(data.g[j].i, 10)
                });
            }
        }

        this.geometry = this._getGeometry(data);
    },

    /**
     * 获取数据模型的几何对象
     * @method _getGeometry
     * @author LiuZhe
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {object} 几何对象
     */
    _getGeometry: function (data) {
        var i;
        var geometry = {
            type: 'GeometryCollection',
            geometries: []
        };
        var lineString = {
            type: 'MultiLineString',
            coordinates: []
        };
        if (data.g) {
            for (i = 0; i < data.g.length; i++) {
                lineString.coordinates.push(data.g[i].g);
            }
        }
        geometry.geometries.push(lineString);
        return geometry;
    }
});
