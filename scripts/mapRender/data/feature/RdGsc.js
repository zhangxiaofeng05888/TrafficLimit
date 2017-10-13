/**
 * 立交的前端数据模型
 * @class FM.mapApi.render.data.RdGsc
 * @author LiuZhe
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.RdGsc = FM.mapApi.render.data.Feature.extend({
    geometry: {},
    properties: {},
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author LiuZhe
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    setAttribute: function (data) {
        this.properties.geoLiveType = 'RDGSC';
        this.properties.geo = data.g;
        this.properties.lines = data.m.a;
        this.geometry = this._getGeometry();
    },

    /**
     * 获取数据模型的几何对象
     * @method _getGeometry
     * @author LiuZhe
     * @date   2017-09-12
     * @return {object} 几何对象
     */
    _getGeometry: function () {
        var gc = {
            type: 'GeometryCollection',
            geometries: []
        };
        var point = {
            type: 'Point',
            coordinates: this.properties.geo
        };
        gc.geometries.push(point);
        for (var i = 0; i < this.properties.lines.length; ++i) {
            var lineString = {
                type: 'LineString',
                coordinates: this.properties.lines[i].g
            };
            gc.geometries.push(lineString);
        }
        return gc;
    }
});
