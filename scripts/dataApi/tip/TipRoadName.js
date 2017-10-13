/**
 * Created by Chensonglin on 17.4.13.
 */
fastmap.dataApi.TipRoadName = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPROADNAME';
        this.code = '1901'; // 道路名
        this.source.s_sourceType = '1901';
        if (data.deep) {
            this.deep = {
                n_array: [],
                geo: data.deep.geo || {}
            };
            if (data.deep.n_array) {
                this.deep.n_array = data.deep.n_array;
            }
        } else {
            this.deep = {
                n_array: [],
                geo: {}
            };
        }
    },
    getIntegrate: function () {
        var data = this.deepCopy(this);
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.deep = this.deep;
        return data;
    }
});
fastmap.dataApi.tipRoadName = function (data, options) {
    return new fastmap.dataApi.TipRoadName(data, options);
};
