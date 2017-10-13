/**
 * Created by Chensonglin on 17.4.14.
 */
fastmap.dataApi.TipConnect = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPCONNECT';
        this.code = '1803'; // 挂接
        this.source.s_sourceType = '1803';
        if (data.deep) {
            this.deep = {
                agl: data.deep.agl || 0.0,
                pcd: data.deep.pcd || '',
                tp: data.deep.tp || 1
            };
        } else {
            this.deep = {
                agl: 0.0,
                pcd: '1803_2081_0',
                tp: 1
            };
        }
    },
    getIntegrate: function () {
        var data = this.deepCopy(this);
        return data;
    },
    getSnapShot: function () {
        var data = {};
        data.deep = this.deep;
        return data;
    }
});
fastmap.dataApi.tipConnect = function (data, options) {
    return new fastmap.dataApi.TipConnect(data, options);
};

