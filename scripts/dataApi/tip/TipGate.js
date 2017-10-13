/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipGate = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPGATE';
        this.code = '1104'; // 大门 *

        if (data.deep) {
            this.deep = {
                id: data.deep.id || '',
                in: data.deep.in || {},
                nId: data.deep.nId || 0,
                out: data.deep.out || {},
                agl: data.deep.agl || 0,
                tp: data.deep.tp || 0,
                dir: data.deep.dir || 0,
                c_array: data.deep.c_array || []
            };
            if (this.deep.in.type === 1 && this.deep.in.id) {
                this.deep.in.id = parseInt(this.deep.in.id, 10);
            }
            if (this.deep.out.type === 1 && this.deep.out.id) {
                this.deep.out.id = parseInt(this.deep.out.id, 10);
            }
        } else {
            this.deep = {
                id: '',
                in: {
                    id: '',
                    type: 1
                },
                nId: 0,
                out: {
                    id: '',
                    type: 1
                },
                agl: 0,
                tp: 0,
                dir: 0,
                c_array: []
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

fastmap.dataApi.tipGate = function (data, options) {
    return new fastmap.dataApi.TipGate(data, options);
};
