/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipTollGate = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPTOLLGATE';
        this.code = '1107'; // 收费站
        this.source.s_sourceType = '1107';
        if (data.deep) {
            this.deep = {
                id: data.deep.id || '',
                in: {},
                out: {},
                nId: data.deep.nId || 0,
                agl: data.deep.agl || 0.0,
                tp: data.deep.tp || 0,
                pNum: data.deep.pNum || 0,
                etc: data.deep.etc || [],
                wgt: data.deep.wgt || [],
                loc: data.deep.loc || 0,
                name: data.deep.name || '',
                photo: data.deep.photo || 1
            };
            if (data.deep.in) {
                this.deep.in = data.deep.in;
                if (this.deep.in.type === 1 && this.deep.in.id) {
                    this.deep.in.id = parseInt(this.deep.in.id, 10);
                }
            }
            if (data.deep.out) {
                this.deep.out = data.deep.out;
                if (this.deep.out.type === 1 && this.deep.out.id) {
                    this.deep.out.id = parseInt(this.deep.out.id, 10);
                }
            }
        } else {
            this.deep = {
                id: '',
                in: {
                    id: '',
                    type: 1
                },
                out: {},
                nId: 0,
                agl: 0.0,
                tp: 0,
                pNum: 0,
                etc: [],
                wgt: [],
                loc: 0,
                photo: 1,
                name: ''
            };
        }
    },
    getIntegrate: function () {
        var data = this.deepCopy(this);
        if (data.deep.out.id) {
            data.deep.out.id = data.deep.out.id.toString();
        }
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

fastmap.dataApi.tipTollGate = function (data, options) {
    return new fastmap.dataApi.TipTollGate(data, options);
};
