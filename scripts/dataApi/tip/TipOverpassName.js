/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipOverpassName = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPOVERPASSNAME';
        this.code = '1705'; // 立交桥名称

        if (data.deep) {
            this.deep = {
                id: data.deep.id || '',
                name: data.deep.name || ''
            };
        } else {
            this.deep = {
                id: '',
                name: ''
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

fastmap.dataApi.tipOverpassName = function (data, options) {
    return new fastmap.dataApi.TipOverpassName(data, options);
};
