/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipHighway = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPHIGHWAY';
        this.code = '8006'; // Highway道路名

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

fastmap.dataApi.tipHighway = function (data, options) {
    return new fastmap.dataApi.TipHighway(data, options);
};
