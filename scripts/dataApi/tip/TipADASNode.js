/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipADASNode = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPADASNODE';
        this.code = '1708'; // ADAS打点

        if (data.deep) {
            this.deep = {
                prj: data.deep.prj || '',
                time: data.deep.time || 0,
                tp: data.deep.tp || 1
            };
        } else {
            this.deep = {
                prj: '',
                time: 0,
                tp: 1
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

fastmap.dataApi.tipADASNode = function (data, options) {
    return new fastmap.dataApi.TipADASNode(data, options);
};
