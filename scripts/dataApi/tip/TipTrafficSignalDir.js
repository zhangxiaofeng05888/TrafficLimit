/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipTrafficSignalDir = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPTRAFFICSIGNALDIR';
        this.code = '1103'; // 红绿灯方位 *

        if (data.deep) {
            this.deep = {
                id: data.deep.id || '',
                in: data.deep.in || {},
                nId: data.deep.nId || 0,
                loc: data.deep.loc || 0
            };
            if (this.deep.in.type === 1 && this.deep.in.id) {
                this.deep.in.id = parseInt(this.deep.in.id, 10);
            }
        } else {
            this.deep = {
                id: '',
                in: {
                    id: '',
                    type: 1
                },
                nId: 0,
                loc: 0
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

fastmap.dataApi.tipTrafficSignalDir = function (data, options) {
    return new fastmap.dataApi.TipTrafficSignalDir(data, options);
};
