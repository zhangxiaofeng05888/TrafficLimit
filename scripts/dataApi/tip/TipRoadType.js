/**
 * Created by Chensonglin on 17.4.11.
 */
fastmap.dataApi.TipRoadType = fastmap.dataApi.Tip.extend({
    /*
     *返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPROADTYPE';
        this.code = '1201';    // 道路种别
        this.source.s_sourceType = '1201';
        if (data.deep) {
            this.deep = {
                f: {},
                kind: data.deep.kind || (data.deep.kind === 0 ? 0 : 7)
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
                kind: 7
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

fastmap.dataApi.tipRoadType = function (data, options) {
    return new fastmap.dataApi.TipRoadType(data, options);
};

