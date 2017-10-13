/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipBanTrucksIn = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPBANTRUCKSIN';
        this.code = '1308'; // 禁止卡车驶入

        if (data.deep) {
            this.deep = {
                f: data.deep.f || {},
                agl: data.deep.agl || 0,
                rdDir: data.deep.rdDir || 0,
                c_array: data.deep.c_array || []
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
                c_array: [
                    {
                        time: '',
                        trl: 0,
                        wt: 0,
                        ax: 0,
                        ac: 0,
                        out: 0
                    }
                ]
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

fastmap.dataApi.tipBanTrucksIn = function (data, options) {
    return new fastmap.dataApi.TipBanTrucksIn(data, options);
};
