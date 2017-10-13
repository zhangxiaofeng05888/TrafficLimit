/**
 * 阶梯 的前端数据模型
 * @class FM.mapApi.render.data.TipStair
 * @author LiuZhe
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.TipStair = FM.mapApi.render.data.Tip.extend({
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author LiuZhe
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    setAttribute: function (data) {
        this.properties.geoLiveType = 'TIPSTAIR';
        this.properties.path = parseInt(data.m.b, 10);
        this.properties.startGeo = data.m.c;
        this.properties.endGeo = data.m.d;
        this.properties.grade = data.m.e;
        this.geometry = this._getGeometry(data.g);
    },

    /**
     * 获取要素模型的几何对象
     * @method _getGeometry
     * @author LiuZhe
     * @date   2017-09-12
     * @param  {object} geo 接口返回的数据
     * @return {object} 几何对象
     */
    _getGeometry: function (geo) {
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
        geometry.geometries[0].coordinates = this.properties.startGeo;
        geometry.geometries[1].coordinates = this.properties.endGeo;
        geometry.geometries[2].coordinates = geo;
        return geometry;
    }
});
