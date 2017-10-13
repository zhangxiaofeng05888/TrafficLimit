/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipTruckLimit = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPTRUCKLIMIT';
        this.code = '1110'; // 卡车限制

        if (data.deep) {
            this.deep = {
                id: data.deep.id || '',
                f: data.deep.f || {},
                agl: data.deep.agl || 0,
                rdDir: data.deep.rdDir || 0,
                ht: data.deep.ht || 0,
                wt: data.deep.wt || 0,
                ax: data.deep.ax || 0,
                wd: data.deep.wd || 0
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
                ht: 0,
                wt: 0,
                ax: 0,
                wd: 0
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

fastmap.dataApi.tipTruckLimit = function (data, options) {
    return new fastmap.dataApi.TipTruckLimit(data, options);
};
