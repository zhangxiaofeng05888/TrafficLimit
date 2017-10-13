/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipAOIFace = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPAOIFACE';
        this.code = '8007'; // AOI面

        if (data.deep) {
            this.deep = {
                geo: data.deep.geo || {}
            };
        } else {
            this.deep = {
                geo: {}
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

fastmap.dataApi.tipAOIFace = function (data, options) {
    return new fastmap.dataApi.TipAOIFace(data, options);
};
