/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipParkinglot = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPPARKINGLOT';
        this.code = '1208'; // 停车场出入口 *

        if (data.deep) {
            this.deep = {
                f: data.deep.f || {},
                under: data.deep.under || 0
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
                under: 0
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

fastmap.dataApi.tipParkinglot = function (data, options) {
    return new fastmap.dataApi.TipParkinglot(data, options);
};
