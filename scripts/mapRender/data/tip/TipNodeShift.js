/**
 * 点位移 的前端数据模型
 * @class FM.mapApi.render.data.TipNodeShift
 * @author LiuZhe
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.TipNodeShift = FM.mapApi.render.data.Tip.extend({
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author LiuZhe
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    setAttribute: function (data) {
        this.properties.geoLiveType = 'TIPNODESHIFT';
        this.properties.path = parseInt(data.m.b, 10);
        this.geometry = this._getGeometry(data);
    },

    /**
     * 获取要素模型的几何对象
     * @method _getGeometry
     * @author LiuZhe
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {object} 几何对象
     */
    _getGeometry: function (data) {
        var geometry = {
            type: 'GeometryCollection',
            geometries: [
                {
                    type: 'Point',
                    coordinates: []
                },
                {
                    type: 'MultiLineString',
                    coordinates: []
                }]
        };
        geometry.geometries[0].coordinates = data.g;
        geometry.geometries[1].coordinates = [[data.m.c, data.g], [data.g, data.m.d]];
        return geometry;
    }
});
