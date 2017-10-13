/**
 * CRF交叉点的前端数据模型
 * @class FM.mapApi.render.data.RdInter
 * @author LiuZhe
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.RdInter = FM.mapApi.render.data.Feature.extend({
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author LiuZhe
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    setAttribute: function (data) {
        this.properties.geoLiveType = 'RDINTER';
        this.properties.id = parseInt(data.i, 10);
        this.properties.links = [];
        this.properties.nodes = [];

        for (var i = 0; i < data.g.length; i++) {
            this.properties.nodes.push({
                nodeId: parseInt(data.g[i].i, 10),
                // 判断rdNode形态是否为crf-info
                ifCrfi: data.g[i].crfi
            });
        }
        if (data.m && data.m.a) {
            for (var j = 0; j < data.m.a.length; j++) {
                this.properties.links.push({
                    linkId: parseInt(data.m.a[j].i, 10),
                    snode: data.m.a[j].s,
                    enode: data.m.a[j].e
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
        var point = {
            type: 'MultiPoint',
            coordinates: []
        };
        for (i = 0; i < data.g.length; i++) {
            point.coordinates.push(data.g[i].g);
        }
        geometry.geometries.push(point);

        var lineString = {
            type: 'MultiLineString',
            coordinates: []
        };
        if (data.m && data.m.a) {
            for (i = 0; i < data.m.a.length; i++) {
                lineString.coordinates.push(data.m.a[i].g);
            }
        }
        geometry.geometries.push(lineString);
        return geometry;
    }
});
