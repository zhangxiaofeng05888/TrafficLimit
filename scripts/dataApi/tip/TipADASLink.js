/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipADASLink = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPADASLINK';
        this.code = '2002'; // ADAS测线

        if (data.deep) {
            this.deep = {
                id: data.deep.id || '',
                geo: data.deep.geo || {},
                prj: data.deep.prj || '',
                sTime: data.deep.sTime || '',
                eTime: data.deep.eTime || '',
                time: data.deep.time || [],
                link: data.deep.link || []
            };
        } else {
            this.deep = {
                id: '',
                geo: {},
                prj: '',
                sTime: '',
                eTime: '',
                time: [],
                link: []
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

fastmap.dataApi.tipADASLink = function (data, options) {
    return new fastmap.dataApi.TipADASLink(data, options);
};
