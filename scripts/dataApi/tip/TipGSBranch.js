/**
 * Created by 123 on 2016/12/5.
 */
fastmap.dataApi.TipGSBranch = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPGSBRANCH';
        this.code = '1407'; // 高速分歧

        if (data.deep) {
            this.deep = {
                brID: data.deep.brID || [],
                in: data.deep.in || {},
                agl: data.deep.agl || 0,
                ptn: data.deep.ptn || '',
                info: data.deep.info || [],
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
                ptn: '',
                info: [
                    {
                        sq: 0,
                        arw: '',
                        exit: '',
                        n_array: []
                    }
                ],
                nId: 0,
                o_array: [
                    {
                        sq: 0,
                        out: {
                            id: '',
                            type: 1,
                            num: 0,
                            geo: {}
                        },
                        arw: '',
                        exit: '',
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

fastmap.dataApi.tipGSBranch = function (data, options) {
    return new fastmap.dataApi.TipGSBranch(data, options);
};
