
/**
 * Created by zhaohang on 2017/4/19.
 */
fastmap.dataApi.PreTipFC = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPFC';
        this.code = '8001'; // FC
        this.source.s_sourceType = '8001';
        if (data.deep) {
            this.deep = {
                geo: data.deep.geo || '',
                fc: data.deep.fc || ''
            };
        } else {
            this.deep = {
                geo: '',
                fc: ''
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


fastmap.dataApi.preTipFC = function (data, options) {
    return new fastmap.dataApi.PreTipFC(data, options);
};
