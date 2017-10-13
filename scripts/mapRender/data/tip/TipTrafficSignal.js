/**
 * 红绿灯 的前端数据模型
 * @class FM.mapApi.render.data.TipTrafficSignal
 * @author LiuZhe
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.TipTrafficSignal = FM.mapApi.render.data.Tip.extend({
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author LiuZhe
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    setAttribute: function (data) {
        this.properties.geoLiveType = 'TIPTRAFFICSIGNAL';
        this.properties.path = data.m.c;
        this.properties.iconpath = parseInt(data.m.b, 10);

        this.properties.accessorySymbol = parseInt(data.m.k, 10);
        this.properties.timeSymbol = parseInt(data.m.l, 10);
        this.properties.outLineSymbol = parseInt(data.m.n, 10);
        this.properties.outLinkCode = data.m.f;
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
            type: 'Point',
            coordinates: []
        };
        geometry.coordinates = geo;
        return geometry;
    }
});
