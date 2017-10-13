/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipSpeedBump = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPSPEEDBUMP';
        this.code = '1108'; // 减速带

        if (data.deep) {
            this.deep = {
                id: data.deep.id || '',
                in: data.deep.in || {},
                nId: data.deep.nId || 0,
                agl: data.deep.agl || 0,
                dir: data.deep.dir || 2
            };
            if (this.deep.in.type === 1 && this.deep.in.id) {
                this.deep.in.id = parseInt(this.deep.in.id, 10);
            }
        } else {
            this.deep = {
                id: '',
                in: {
                    id: '',
                    type: 1
                },
                nId: 0,
                agl: 0,
                dir: 2
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

fastmap.dataApi.tipSpeedBump = function (data, options) {
    return new fastmap.dataApi.TipSpeedBump(data, options);
};
