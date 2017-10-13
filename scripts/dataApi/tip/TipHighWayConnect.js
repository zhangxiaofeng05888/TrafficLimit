/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipHighWayConnect = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPHIGHWAYCONNECT';
        this.code = '1211'; // 高速连接路
        this.source.s_sourceType = '1211';
        if (data.deep) {
            this.deep = {
                f: data.deep.f || {},
                tp: data.deep.tp || 1
            };
            if (data.deep.f) {
                this.deep.f = data.deep.f;
                if (this.deep.f.type === 1 && this.deep.f.id) {
                    this.deep.f.id = parseInt(this.deep.f.id, 10);
                }
            }
        } else {
            this.deep = {
                f: {},
                tp: 1
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

fastmap.dataApi.tipHighWayConnect = function (data, options) {
    return new fastmap.dataApi.TipHighWayConnect(data, options);
};
