/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipOverBridge = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPOVERBRIDGE';
        this.code = '2201'; // 地下通道/过街天桥

        if (data.deep) {
            this.deep = {
                tp: data.deep.tp || 1,
                geo: data.deep.geo || {},
                p_array: data.deep.p_array || []
            };
        } else {
            this.deep = {
                tp: 1,
                geo: {},
                p_array: [
                    {
                        geoP: {},
                        access: ''
                    }
                ]
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

fastmap.dataApi.tipOverBridge = function (data, options) {
    return new fastmap.dataApi.TipOverBridge(data, options);
};
