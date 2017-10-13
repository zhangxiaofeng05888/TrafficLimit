/**
 * Created by Chensonglin on 17.4.12.
 */
fastmap.dataApi.TipRoadDirection = fastmap.dataApi.Tip.extend({
    setAttributes: function (data) {
        this.geoLiveType = 'TIPROADDIRECTION';
        this.code = '1203'; // 道路方向
        this.source.s_sourceType = '1203';
        if (data.deep) {
            this.deep = {
                f: {},
                agl: data.deep.agl || 0.0,
                dr: data.deep.dr || 1,
                time: data.deep.time || ''
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
                agl: 0.0,
                dr: 1,
                time: ''
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

fastmap.dataApi.tipRoadDirection = function (data, options) {
    return new fastmap.dataApi.TipRoadDirection(data, options);
};
