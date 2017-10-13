/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipGPSDot = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPGPSDOT';
        this.code = '1706'; // GPS打点
        this.source.s_sourceType = '1706';
        if (data.deep && data.deep.f) {
            this.deep = {
                f: {
                    id: data.deep.f.id || '',
                    type: data.deep.f.type || 1
                }
            };
            if ((this.deep.f.type === 1 || this.deep.f.type === 3) && this.deep.f.id) {
                this.deep.f.id = parseInt(this.deep.f.id, 10);
            }
        } else {
            this.deep = {
                f: {}
            };
        }
    },
    getIntegrate: function () {
        var data = this.deepCopy(this);
        if (data.deep.f.id) {
            data.deep.f.id = data.deep.f.id.toString();
        }
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.deep = this.deep;
        return data;
    }
});

fastmap.dataApi.tipGPSDot = function (data, options) {
    return new fastmap.dataApi.TipGPSDot(data, options);
};
