/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipSpeedlimit = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPSPEEDLIMIT';
        this.code = '1111'; // 条件限速 *

        if (data.deep) {
            this.deep = {
                sID: data.deep.sID || [],
                f: data.deep.f || {},
                agl: data.deep.agl || 0,
                rdDir: data.deep.rdDir || 0,
                value: data.deep.value || 0,
                se: data.deep.se || 0,
                d_array: data.deep.d_array || []
            };
            if (this.deep.f.type === 1 && this.deep.f.id) {
                this.deep.f.id = parseInt(this.deep.f.id, 10);
            }
        } else {
            this.deep = {
                sID: [
                    {
                        id: '',
                        sq: 1
                    }
                ],
                f: {
                    id: '',
                    type: 1
                },
                agl: 0,
                rdDir: 0,
                value: 0,
                se: 0,
                d_array: [
                    {
                        sq: 1,
                        dpnd: 1,
                        time: ''
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

fastmap.dataApi.tipSpeedlimit = function (data, options) {
    return new fastmap.dataApi.TipSpeedlimit(data, options);
};
