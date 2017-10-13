/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipAirPortFace = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPAIRPORTFACE';
        this.code = '8005'; // 机场功能面

        if (data.deep) {
            this.deep = {
                geo: data.deep.geo || {},
                kind: data.deep.kind || 1
            };
        } else {
            this.deep = {
                geo: {},
                kind: 1
            };
        }
    },

    getIntegrate: function () {
        var data = {};
        data.deep = this.deep;
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.deep = this.deep;
        return data;
    }
});

fastmap.dataApi.tipAirPortFace = function (data, options) {
    return new fastmap.dataApi.TipAirPortFace(data, options);
};
