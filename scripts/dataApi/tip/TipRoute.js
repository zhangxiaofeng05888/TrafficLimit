/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipRoute = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPROUTE';
        this.code = '1209'; // 航线

        if (data.deep) {
            this.deep = {
                f: data.deep.f || {},
                name: data.deep.name || ''
            };
        } else {
            this.deep = {
                f: {
                    id: '',
                    type: 1
                },
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

fastmap.dataApi.tipRoute = function (data, options) {
    return new fastmap.dataApi.TipRoute(data, options);
};
