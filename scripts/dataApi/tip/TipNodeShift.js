/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipNodeShift = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPNODESHIFT';
        this.code = '1709'; // 点位移

        if (data.deep) {
            this.deep = {
                geoO: data.deep.geoO || {},
                geoN: data.deep.geoN || {}
            };
        } else {
            this.deep = {
                geoO: {},
                geoN: {}
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

fastmap.dataApi.tpNodeShift = function (data, options) {
    return new fastmap.dataApi.TipNodeShift(data, options);
};
