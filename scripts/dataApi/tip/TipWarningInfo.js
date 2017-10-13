/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipWarningInfo = fastmap.dataApi.Tip.extend({

    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPWARNINGINFO';
        this.code = '1105'; // 危险信息

        if (data.deep) {
            this.deep = {
                wID: data.deep.wID || [],
                in: data.deep.in || {},
                agl: data.deep.agl || 0,
                rdDir: data.deep.rdDir || 0,
                w_array: data.deep.w_array || []
            };
            if (this.deep.in.type === 1 && this.deep.in.id) {
                this.deep.in.id = parseInt(this.deep.in.id, 10);
            }
        } else {
            this.deep = {
                wID: [
                    {
                        id: '',
                        sq: 0
                    }
                ],
                in: {
                    id: '',
                    type: 1
                },
                agl: 0,
                rdDir: 0,
                w_array: [
                    {
                        sq: 0,
                        tp: '',
                        vDis: 0,
                        wDis: 0,
                        time: '',
                        desc: ''
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

fastmap.dataApi.tipWarningInfo = function (data, options) {
    return new fastmap.dataApi.TipWarningInfo(data, options);
};
