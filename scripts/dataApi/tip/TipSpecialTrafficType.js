/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipSpecialTrafficType = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPSPECIALTRAFFICTYPE';
        this.code = '1602'; // 特殊交通类型

        if (data.deep) {
            this.deep = {
                geo: data.deep.geo || {},
                name: data.deep.name || '',
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
                name: '',
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

fastmap.dataApi.tipSpecialTrafficType = function (data, options) {
    return new fastmap.dataApi.TipSpecialTrafficType(data, options);
};
