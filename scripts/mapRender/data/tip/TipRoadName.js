/**
 * 道路名 的前端数据模型
 * @class FM.mapApi.render.data.TipRoadName
 * @author LiuZhe
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.TipRoadName = FM.mapApi.render.data.Tip.extend({
    geometry: null,
    properties: null,
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author LiuZhe
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    setAttribute: function (data) {
        this.properties.geoLiveType = 'TIPROADNAME';
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
        var gc = {
            type: 'GeometryCollection',
            geometries: []
        };
        var point = {
            type: 'Point',
            coordinates: data.m.c
        };
        gc.geometries.push(point);
        var lineString = {
            type: 'LineString',
            coordinates: []
        };
        // for (var i = 0; i < data.m.c.length; ++i) {
        //    lineString.coordinates.push(data.m.c[i]);
        // }
        lineString.coordinates = data.g;
        gc.geometries.push(lineString);

        return gc;
    }
});
