/**
 * Created by Chensonglin on 17.4.11.
 */
fastmap.dataApi.TipDrivewayMount = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPDRIVEWAYMOUNT';
        this.code = '1202'; // 车道数
        this.source.s_sourceType = '1202';
        if (data.deep) {
            this.deep = {
                f: {},
                num: data.deep.num || 1,
                side: data.deep.side || 0
            };
            if (this.deep.f) {
                this.deep.f = data.deep.f;
                if (this.deep.f.type === 1 && this.deep.f.id) {
                    this.deep.f.id = parseInt(this.deep.f.id, 10);
                }
            }
        } else {
            this.deep = {
                f: {},
                num: 1,
                side: 0
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


fastmap.dataApi.tipDrivewayMount = function (data, options) {
    return new fastmap.dataApi.TipDrivewayMount(data, options);
};
