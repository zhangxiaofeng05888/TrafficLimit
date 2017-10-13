/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipAOINode = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPAOINODE';
        this.code = '8008'; // AOI代表点

        if (data.deep) {
            this.deep = {
                name: data.deep.name || '',
                eng: data.deep.eng || '',
                extend: data.deep.extend || ''
            };
        } else {
            this.deep = {
                name: '',
                eng: '',
                extend: ''
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

fastmap.dataApi.tipAOINode = function (data, options) {
    return new fastmap.dataApi.TipAOINode(data, options);
};
