/**
 * 地下通道／天桥 的前端数据模型
 * @class FM.mapApi.render.data.TipOverBridge
 * @author LiuZhe
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.TipOverBridge = FM.mapApi.render.data.Tip.extend({
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author LiuZhe
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    setAttribute: function (data) {
        this.properties.geoLiveType = 'TIPOVERBRIDGE';
        this.properties.path = parseInt(data.m.b, 10);
        this.properties.position = data.m.c;
        this.properties.tp = data.m.d;
        this.properties.points = data.m.e;
        this.properties.txts = data.m.f;
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
                }, {
                    type: 'LineString',
                    coordinates: []
                }, {
                    type: 'MultiPoint',
                    coordinates: []
                }
            ]
        };
        geometry.geometries[0].coordinates = this.properties.position;
        geometry.geometries[1].coordinates = geo;
        geometry.geometries[2].coordinates = this.properties.points;
        return geometry;
    }
});
