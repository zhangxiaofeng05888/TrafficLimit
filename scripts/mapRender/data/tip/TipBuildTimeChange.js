/**
 * 在建时间变更 的前端数据模型
 * @class FM.mapApi.render.data.TipBuildTimeChange
 * @author ZhaoHang
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.TipBuildTimeChange = FM.mapApi.render.data.Tip.extend({
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author ZhaoHang
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    setAttribute: function (data) {
        this.properties.geoLiveType = 'TIPBUILDTIMECHANGE';

        this.properties.kind = parseInt(data.m.b, 10);
        this.properties.startGeo = data.m.c;
        this.properties.endGeo = data.m.d;
        this.properties.accessorySymbol = parseInt(data.m.k, 10);
        this.properties.timeSymbol = parseInt(data.m.l, 10);
        this.properties.outLineSymbol = parseInt(data.m.n, 10);
        this.geometry = this.getGeometry(data.g);
    },

    /**
     * 获取要素模型的几何对象
     * @method getGeometry
     * @author ZhaoHang
     * @date   2017-09-12
     * @param  {object} geo 接口返回的数据
     * @return {object} 几何对象
     */
    getGeometry: function (geo) {
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

