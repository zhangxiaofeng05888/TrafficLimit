/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipCrossLineOverpass = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPCROSSLINEOVERPASS';
        this.code = '1509'; // 跨线立交桥

        if (data.deep) {
            this.deep = {
                name: data.deep.name || '',
                gSLoc: data.deep.gSLoc || {},
                gELoc: data.deep.gELoc || {},
                f_array: data.deep.f_array || []
            };
            for (var i = 0; i < this.deep.f_array.length; i++) {
                if (this.deep.f_array[i].type === 1 && this.deep.f_array[i].id) {
                    this.deep.f_array[i].id = parseInt(this.deep.f_array[i].id, 10);
                }
            }
        } else {
            this.deep = {
                name: '',
                gSLoc: {},
                gELoc: {},
                f_array: [
                    {
                        id: '',
                        type: 1,
                        flag: '0'
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

fastmap.dataApi.tipCrossLineOverpass = function (data, options) {
    return new fastmap.dataApi.TipCrossLineOverpass(data, options);
};
