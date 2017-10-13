/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipDirect = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPDIRECT';
        this.code = '1804'; // 顺行

        if (data.deep) {
            this.deep = {
                id: data.deep.id || '',
                in: data.deep.in || {},
                nId: data.deep.nId || 0,
                out: data.deep.out || {},
                agl: data.deep.agl || 0
            };
        } else {
            this.deep = {
                id: '',
                in: {
                    id: '',
                    type: 1
                },
                nId: 0,
                out: {
                    id: '',
                    type: 1
                },
                agl: 0
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

fastmap.dataApi.tipDirect = function (data, options) {
    return new fastmap.dataApi.TipDirect(data, options);
};
