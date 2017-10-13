/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipNoCrossing = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPNOCROSSING';
        this.code = '1304'; // 禁止穿行 *

        if (data.deep) {
            this.deep = {
                f: data.deep.f || {},
                agl: data.deep.agl || 0,
                rdDir: data.deep.rdDir || 0,
                time: data.deep.time || ''
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
                time: ''
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

fastmap.dataApi.tipNoCrossing = function (data, options) {
    return new fastmap.dataApi.TipNoCrossing(data, options);
};
