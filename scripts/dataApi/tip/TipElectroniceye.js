/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipElectroniceye = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPELECTRONICEYE';
        this.code = '1109'; // 电子眼

        if (data.deep) {
            this.deep = {
                id: data.deep.id || '',
                f: data.deep.f || {},
                agl: data.deep.agl || 0,
                rdDir: data.deep.rdDir || 0,
                tp: data.deep.tp || 1,
                loc: data.deep.loc || 0,
                value: data.deep.value || 0,
                pair: data.deep.pair || '',
                thrd: data.deep.thrd || 0
            };
            if (this.deep.f.type === 1 && this.deep.f.id) {
                this.deep.f.id = parseInt(this.deep.f.id, 10);
            }
        } else {
            this.deep = {
                id: '',
                f: {
                    id: '',
                    type: 1
                },
                agl: 0,
                rdDir: 0,
                tp: 1,
                loc: 0,
                value: 0,
                pair: '',
                thrd: 0
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

fastmap.dataApi.tipElectroniceye = function (data, options) {
    return new fastmap.dataApi.TipElectroniceye(data, options);
};
