/**
 * Created by Chensonglin on 17.4.11.
 */
fastmap.dataApi.TipRestriction = fastmap.dataApi.Tip.extend({
    setAttributes: function (data) {
        this.geoLiveType = 'TIPRESTRICTION';
        this.code = '1101'; // 点限速
        this.source.s_sourceType = '1101';
        if (data.deep) {
            this.deep = {
                id: data.deep.id || '',
                f: {},
                agl: data.deep.agl || 0.0,
                toll: data.deep.toll || 0,
                rdDir: data.deep.rdDir || 0,
                value: data.deep.value || 5,
                se: data.deep.se || 0,
                flag: data.deep.flag || 0,
                desc: data.deep.desc || ''
            };
            if (data.deep.f) {
                this.deep.f = data.deep.f;
                if (this.deep.f.type === 1 && this.deep.f.id) {
                    this.deep.f.id = parseInt(this.deep.f.id, 10);
                }
            }
        } else {
            this.deep = {
                id: '',
                f: {},
                agl: 0.0,
                toll: 0,
                rdDir: 0,
                value: 5,
                se: 0,
                flag: 0,
                desc: ''
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

fastmap.dataApi.tipRestriction = function (data, options) {
    return new fastmap.dataApi.TipRestriction(data, options);
};
