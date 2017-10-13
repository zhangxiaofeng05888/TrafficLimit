/**
 * Created by Chensonglin on 17.4.11.
 */
fastmap.dataApi.TipRamp = fastmap.dataApi.Tip.extend({
    setAttributes: function (data) {
        this.geoLiveType = 'TIPRAMP';
        this.code = '1207'; // 匝道
        this.source.s_sourceType = '1207';
        if (data.deep) {
            this.deep = {
                f: {}
            };
            if (data.deep.f) {
                this.deep.f = data.deep.f;
                if (this.deep.f.type === 1 && this.deep.f.id) {
                    this.deep.f.id = parseInt(this.deep.f.id, 10);
                }
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
fastmap.dataApi.tipRamp = function (data, options) {
    return new fastmap.dataApi.TipRamp(data, options);
};
