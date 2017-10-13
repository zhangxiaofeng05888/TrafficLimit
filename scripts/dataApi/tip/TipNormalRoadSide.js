/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipNormalRoadSide = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPNORMALROADSIDE';
        this.code = '1405'; // 一般道路方面

        if (data.deep) {
            this.deep = {
                brID: data.deep.brID || [],
                in: data.deep.in || {},
                agl: data.deep.agl || 0,
                nId: data.deep.nId || 0,
                o_array: data.deep.o_array || []
            };
            if (this.deep.in.type === 1 && this.deep.in.id) {
                this.deep.in.id = parseInt(this.deep.in.id, 10);
            }
            for (var i = 0; i < this.deep.o_array.length; i++) {
                if (this.deep.o_array[i].out.type === 1 && this.deep.o_array[i].out.id) {
                    this.deep.o_array[i].out.id = parseInt(this.deep.o_array[i].out.id, 10);
                }
            }
        } else {
            this.deep = {
                brID: [
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
                nId: 0,
                o_array: [
                    {
                        sq: 0,
                        out: {
                            id: '',
                            type: 1
                        },
                        n_array: []
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

fastmap.dataApi.tipNormalRoadSide = function (data, options) {
    return new fastmap.dataApi.TipNormalRoadSide(data, options);
};
