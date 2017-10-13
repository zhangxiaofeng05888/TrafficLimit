/**
 * 点限速的前端数据模型
 * @class FM.mapApi.render.data.RdSpeedLimit
 * @author LiuZhe
 * @date   2017-09-12
 *
 * @copyright @Navinfo, all rights reserved.
 */
FM.mapApi.render.data.RdSpeedLimit = FM.mapApi.render.data.Feature.extend({
    /**
     * 模型转换主函数，将接口返回的数据转换为前端数据模型
     * @method setAttribute
     * @author LiuZhe
     * @date   2017-09-12
     * @param  {object} data 接口返回的数据
     * @return {undefined}
     */
    setAttribute: function (data) {
        this.properties.geoLiveType = parseInt(data.m.a, 10) === 3 ? 'RDSPEEDLIMIT_DEPENDENT' : 'RDSPEEDLIMIT';
        this.properties.speedType = parseInt(data.m.a, 10);
        this.properties.rotate = parseInt(data.m.c, 10);
        this.properties.direct = data.m.d;
        this.properties.linkPid = data.m.e;
        this.properties.text = data.m.f;
        this.properties.limitSrc = 1;
        this.properties.timeDomain = null;
        this.properties.tollgateFlag = data.m.k;
        this.properties.state = data.m.l;    //  m.l === 2 时，表示删除状态
        var resArray = data.m.b.split('|');
        if (this.properties.speedType === 0 || this.properties.speedType === 1) {
            this.properties.captureFlag = parseInt(resArray[0], 10); // 采集标志（0,现场采集;1,理论判断）
            this.properties.speedFlag = parseInt(resArray[1], 10); // 限速标志(0,限速开始;1,解除限速)
            this.properties.speedValue = parseInt(resArray[2], 10); // 限速值
        } else if (this.properties.speedType === 3) {
            this.properties.speedValue = parseInt(resArray[1], 10);
            this.properties.speedDependent = parseInt(resArray[2], 10);
            this.properties.speedFlag = parseInt(resArray[0], 10);
        } else if (this.properties.speedType === 4) {
            resArray = data.m.b.split(',');
            this.properties.speedValue = parseInt(resArray[0], 10);
            this.properties.laneSpeedValue = resArray[1].split('|').map(function (val) {
                return parseInt(val, 10);
            });
        }
        this.geometry = this._getGeometry(data.g);
    },

    /**
     * 获取数据模型的几何对象
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
