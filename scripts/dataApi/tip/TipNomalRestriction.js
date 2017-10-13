/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipNomalRestriction = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPNOMALRESTRICTION';
        this.code = '1302'; // 普通交限
        this.source.s_sourceType = '1302';

        if (data.deep) {
            this.deep = {
                id: data.deep.id || '',
                in: data.deep.in || {},
                agl: data.deep.agl || 0.0,
                info: data.deep.info || [],
                nId: data.deep.nId || 0,
                o_array: data.deep.o_array || []
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
                for (var i = 0, len = this.deep.o_array.length; i < len; i++) {
                    for (var j = 0, len2 = this.deep.o_array[i].out.length; j < len2; j++) {
                        if (this.deep.o_array[i].out[j].type === 1 && this.deep.o_array[i].out[j].id) {
                            this.deep.o_array[i].out[j].id = parseInt(this.deep.o_array[i].out[j].id, 10);
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

fastmap.dataApi.tipNomalRestriction = function (data, options) {
    return new fastmap.dataApi.TipNomalRestriction(data, options);
};
