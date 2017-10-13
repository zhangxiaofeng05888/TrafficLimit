/**
 * 步行街 的前端数据模型
 * @class FM.mapApi.render.data.TipPedestrianStreet
 * @author LiuZhe
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.TipPedestrianStreet = FM.mapApi.render.data.Tip.extend({
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author LiuZhe
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    setAttribute: function (data) {
        this.properties.geoLiveType = 'TIPPEDESTRIANSTREET';
        this.properties.choice = data.m.f;
        this.properties.txt = data.m.e;
        this.properties.path = parseInt(data.m.b, 10);

        this.properties.accessorySymbol = parseInt(data.m.k, 10);
        this.properties.timeSymbol = parseInt(data.m.l, 10);
        this.properties.outLineSymbol = parseInt(data.m.n, 10);
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
                    type: 'Point',
                    coordinates: []
                },
                {
                    type: 'MultiLineString',
                    coordinates: []
                }]
        };
        geometry.geometries[0].coordinates = data.m.c;
        geometry.geometries[1].coordinates = data.m.d;
        geometry.geometries[2].coordinates = data.g;
        return geometry;
    }
});
