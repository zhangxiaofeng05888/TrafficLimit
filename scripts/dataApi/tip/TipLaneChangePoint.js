/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipLaneChangePoint = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPLANECHANGEPOINT';
        this.code = '1115'; // 车道变化点

        if (data.deep) {
            this.deep = {
                f: data.deep.f || {},
                agl: data.deep.agl || 0,
                inNum: data.deep.inNum || 0,
                outNum: data.deep.outNum || 0,
                inLink: data.deep.inLink || 0,
                outLink: data.deep.outLink || 0
            };
            if ((this.deep.f.type === 1 || this.deep.f.type === 3) && this.deep.f.id) {
                this.deep.f.id = parseInt(this.deep.f.id, 10);
            }
        } else {
            this.deep = {
                f: {
                    id: '',
                    type: 1
                },
                agl: 0,
                inNum: 0,
                outNum: 0,
                inLink: 0,
                outLink: 0
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

fastmap.dataApi.tipLaneChangePoint = function (data, options) {
    return new fastmap.dataApi.TipLaneChangePoint(data, options);
};
