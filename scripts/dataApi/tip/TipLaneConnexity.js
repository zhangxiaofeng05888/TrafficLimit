/**
 * Created by Chensonglin on 17.4.11.
 */
fastmap.dataApi.TipLaneConnexity = fastmap.dataApi.Tip.extend({
    setAttributes: function (data) {
        this.geoLiveType = 'TIPLANECONNEXITY';
        this.code = '1301'; // 车信
        this.source.s_sourceType = '1301';
        if (data.deep) {
            this.deep = {
                id: data.deep.id || '',
                in: {},
                agl: data.deep.agl || 0.0,
                info: [],
                nId: data.deep.nId || 0,
                o_array: []
            };
            if (data.deep.in) {
                this.deep.in = data.deep.in;
                if (this.deep.in.type === 1 && this.deep.in.id) {
                    this.deep.in.id = parseInt(this.deep.in.id, 10);
                }
            }
            if (data.deep.info) {
                this.deep.info = data.deep.info;
            }
            if (data.deep.o_array) {
                this.deep.o_array = data.deep.o_array;
                for (var i = 0; i < this.deep.o_array.length; i++) {
                    for (var j = 0; j < this.deep.o_array[i].d_array.length; j++) {
                        if (this.deep.o_array[i].d_array[j].out.type === 1 && this.deep.o_array[i].d_array[j].out.id) {
                            this.deep.o_array[i].d_array[j].out.id = parseInt(this.deep.o_array[i].d_array[j].out.id, 10);
                        }
                    }
                }
            }
        } else {
            this.deep = {
                id: '',
                in: {
                    id: '',
                    type: 1
                },
                agl: 0.0,
                info: [],
                nId: 0,
                o_array: []
            };
        }
    },
    getIntegrate: function () {
        var data = this.deepCopy(this);
        if (data.deep.in.id) {
            data.deep.in.id = data.deep.in.id.toString();
        }
        return data;
    },
    getSnapShot: function () {
        var data = {};
        data.deep = this.deep;
        return data;
    }
});
fastmap.dataApi.tipLaneConnexity = function (data, options) {
    return new fastmap.dataApi.TipLaneConnexity(data, options);
};
