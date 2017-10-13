/**
 * Created by Chensonglin on 17.4.14.
 */
fastmap.dataApi.TipICJCT = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'ICJCT';
        this.code = '1211'; // ICJCT
        this.source.s_sourceType = '1211';
        if (data.deep) {
            this.deep = {
                f: {},
                tp: data.deep.tp || 1
            };
            if (this.deep.f) {
                this.deep.f = data.deep.f;
            }
        } else {
            this.deep = {
                f: {
                    id: '',
                    type: 1
                },
                tp: 1
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


fastmap.dataApi.tipICJCT = function (data, options) {
    return new fastmap.dataApi.TipICJCT(data, options);
};
