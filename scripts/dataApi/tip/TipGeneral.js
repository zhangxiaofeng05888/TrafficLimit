/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipGeneral = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPGENERAL';
        this.code = '2102'; // 万能标记
        this.deep = data.deep || {};
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

fastmap.dataApi.tipGeneral = function (data, options) {
    return new fastmap.dataApi.TipGeneral(data, options);
};
