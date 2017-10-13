/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipBUAFace = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPBUAFACE';
        this.code = '8010'; // BUA

        if (data.deep) {
            this.deep = {
                geo: data.deep.geo || {},
                name: data.deep.name || ''
            };
        } else {
            this.deep = {
                geo: {},
                name: ''
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

fastmap.dataApi.tipBUAFace = function (data, options) {
    return new fastmap.dataApi.TipBUAFace(data, options);
};
