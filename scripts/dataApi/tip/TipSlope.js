/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipSlope = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPSLOPE';
        this.code = '1106'; // 坡度 *

        if (data.deep) {
            this.deep = {
                id: data.deep.id || '',
                nId: data.deep.nId || 0,
                out: data.deep.out || {},
                tp: data.deep.tp || 0,
                end: data.deep.end || 0
            };
            if (this.deep.out.type === 1 && this.deep.out.id) {
                this.deep.out.id = parseInt(this.deep.out.id, 10);
            }
        } else {
            this.deep = {
                id: '',
                nId: 0,
                out: {
                    id: '',
                    type: 1
                },
                tp: 0,
                end: 0
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

fastmap.dataApi.tipSlope = function (data, options) {
    return new fastmap.dataApi.TipSlope(data, options);
};
