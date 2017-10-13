/**
 * Created by 123 on 2016/12/6.
 */
fastmap.dataApi.TipStair = fastmap.dataApi.Tip.extend({
    /*
     * 返回参数赋值
     */
    setAttributes: function (data) {
        this.geoLiveType = 'TIPSTAIR';
        this.code = '1518'; // 阶梯

        if (data.deep) {
            this.deep = {
                grade: data.deep.grade || 1,
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
                grade: 1,
                gSLoc: {},
                gELoc: {},
                f_array: [
                    {
                        id: '',
                        type: 0,
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

fastmap.dataApi.tipStair = function (data, options) {
    return new fastmap.dataApi.TipStair(data, options);
};
