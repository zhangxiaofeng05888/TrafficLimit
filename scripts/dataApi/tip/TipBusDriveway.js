/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipBusDriveway = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPBUSDRIVEWAY';
        this.code = '1310'; // 公交车道

        if (data.deep) {
            this.deep = {
                gSLoc: data.deep.gSLoc || {},
                gELoc: data.deep.gELoc || {},
                agl: data.deep.agl || 0,
                ln: data.deep.ln || [],
                f_array: data.deep.f_array || []
            };

            for (var i = 0; i < this.deep.f_array.length; i++) {
                if (this.deep.f_array[i].type === 1 && this.deep.f_array[i].id) {
                    this.deep.f_array[i].id = parseInt(this.deep.f_array[i].id, 10);
                }
            }

            for (var m = 0; m < this.deep.ln.length; m++) {
                for (var j = 0; j < this.deep.ln[m].o_array.length; j++) {
                    if (this.deep.ln[m].o_array[j].type === 1 && this.deep.ln[m].o_array[j].id) {
                        this.deep.ln[m].o_array[j].id = parseInt(this.deep.ln[m].o_array[j].id, 10);
                    }
                }
            }
        } else {
            this.deep = {
                gSLoc: {},
                gELoc: {},
                agl: 0,
                ln: [
                    {
                        bus: 0,
                        time: '',
                        o_array: [
                            {
                                id: '',
                                type: 1,
                                num: 0,
                                geo: {}
                            }
                        ]
                    }
                ],
                f_array: [
                    {
                        id: '',
                        type: 1,
                        flag: '0'
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

fastmap.dataApi.tipBusDriveway = function (data, options) {
    return new fastmap.dataApi.TipBusDriveway(data, options);
};
