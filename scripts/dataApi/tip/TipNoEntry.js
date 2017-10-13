/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipNoEntry = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPNOENTRY';
        this.code = '1305'; // 禁止驶入 *

        if (data.deep) {
            this.deep = {
                f: data.deep.f || {},
                agl: data.deep.agl || 0,
                rdDir: data.deep.rdDir || 0,
                time: data.deep.time || '',
                vt: data.deep.vt || []
            };
            if (this.deep.f.type === 1 && this.deep.f.id) {
                this.deep.f.id = parseInt(this.deep.f.id, 10);
            }
        } else {
            this.deep = {
                f: {
                    id: '',
                    type: 1
                },
                agl: 0,
                rdDir: 0,
                time: '',
                vt: []
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

fastmap.dataApi.tipNoEntry = function (data, options) {
    return new fastmap.dataApi.TipNoEntry(data, options);
};
