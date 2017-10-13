/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipPOIRoad = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPPOIROAD';
        this.code = '1605'; // POI连接路

        if (data.deep) {
            this.deep = {
                geo: data.deep.geo || {},
                f_array: data.deep.f_array || []
            };

            for (var i = 0; i < this.deep.f_array.length; i++) {
                if (this.deep.f_array[i].type === 1 && this.deep.f_array[i].id) {
                    this.deep.f_array[i].id = parseInt(this.deep.f_array[i].id, 10);
                }
            }
        } else {
            this.deep = {
                geo: {},
                f_array: [
                    {
                        id: '',
                        type: 1,
                        geoF: {}
                    }
                ]
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

fastmap.dataApi.tipPOIRoad = function (data, options) {
    return new fastmap.dataApi.TipPOIRoad(data, options);
};
